import { ExpenseGroupResponse, ExpenseGroupWithDetails } from "./api";

export function calculateShares({
  amount,
  participants,
}: {
  amount: number;
  participants: { memberId: string; weight: number }[];
}): Record<string, number> {
  const totalWeight = participants.reduce((acc, { weight }) => acc + weight, 0);

  const shares = participants.reduce((acc, { memberId, weight }) => {
    const share = (amount * weight) / totalWeight;
    acc[memberId] = share;
    return acc;
  }, {} as Record<string, number>);

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
export function calculateBalanceMatrix(group: ExpenseGroupResponse): BalanceMatrix {
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
    const shares = calculateShares({ amount, participants });
    const payeeIds = Object.keys(shares);

    for (const payeeId of payeeIds) {
      // People do not owe themselves
      if (payerId === payeeId) {
        continue;
      }

      balanceMatrix[payerId][payeeId] = (balanceMatrix[payerId][payeeId] ?? 0) + shares[payeeId];
      balanceMatrix[payeeId][payerId] = (balanceMatrix[payeeId][payerId] ?? 0) - shares[payeeId];
    }
  }

  return balanceMatrix;
}
