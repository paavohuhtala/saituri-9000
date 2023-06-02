import { ExpenseGroupWithFullDetails } from "./api";
import _ from "lodash";
import { DbType } from "./domain";

export type SharesByMemberId = Partial<Record<string, number>>;

export interface ParticipantWithWeight {
  memberId: string;
  weight: number;
}

export type WeightByMemberId = Partial<Record<string, number>>;

export function calculateShares(amount: number, participants: ParticipantWithWeight[]): SharesByMemberId {
  const totalWeight = participants.reduce((acc, { weight }) => acc + weight, 0);

  const shares = participants.reduce((acc, { memberId, weight }) => {
    const share = (amount * weight) / totalWeight;
    acc[memberId] = share;
    return acc;
  }, {} as Partial<Record<string, number>>);

  return shares;
}

export interface BalanceMatrix {
  [payerId: string]: {
    [payeeId: string]: number;
  };
}

/**
 * Given an expense group, calculate the balance matrix.
 * The balance matrix tells how much each member owes to each other member.
 */
export function calculateBalanceMatrix(group: DbType<ExpenseGroupWithFullDetails>): BalanceMatrix {
  const { expenses, payments, members } = group;

  const balanceMatrix = members.reduce((acc, member) => {
    acc[member.id] = {};
    return acc;
  }, {} as BalanceMatrix);

  // First, add all the payments to the matrix
  for (const payment of payments) {
    const { payerId, payeeId, amount } = payment;
    balanceMatrix[payerId][payeeId] = (balanceMatrix[payerId][payeeId] ?? 0) + amount;
    balanceMatrix[payeeId][payerId] = (balanceMatrix[payeeId][payerId] ?? 0) - amount;
  }

  // Then, add all the expenses to the matrix
  for (const expense of expenses) {
    const { amount, payerId, participants } = expense;
    const shares = calculateShares(amount, participants);
    const payeeIds = Object.keys(shares);

    for (const payeeId of payeeIds) {
      // People do not owe themselves
      if (payerId === payeeId) {
        continue;
      }

      balanceMatrix[payerId][payeeId] = (balanceMatrix[payerId][payeeId] ?? 0) + (shares[payeeId] ?? 0);
      balanceMatrix[payeeId][payerId] = (balanceMatrix[payeeId][payerId] ?? 0) - (shares[payeeId] ?? 0);
    }
  }

  return balanceMatrix;
}

export function calculateSuggestedPayerId(matrix: BalanceMatrix, participantIds: string[]): string {
  const sortedBalanceAndId = _.sortBy(
    participantIds.map((payerId): [number, string] => [
      participantIds.reduce((acc, payeeId) => acc + (matrix[payerId][payeeId] ?? 0), 0),
      payerId,
    ]),
    (e) => e[0],
  );
  return sortedBalanceAndId[0][1];
}

export type BalancePerMember = Partial<Record<string, number>>;

export function calculatePersonalBalances(matrix: BalanceMatrix): BalancePerMember {
  return Object.entries(matrix).reduce((acc, [memberId, balances]) => {
    acc[memberId] = Object.values(balances).reduce((acc, balance) => acc + balance, 0);
    return acc;
  }, {} as Partial<Record<string, number>>);
}
