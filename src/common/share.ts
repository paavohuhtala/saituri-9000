export function calculateShares({
  amount,
  participants,
}: {
  amount: number;
  participants: { id: string; weight: number }[];
}): Record<string, number> {
  const totalWeight = participants.reduce((acc, { weight }) => acc + weight, 0);

  const shares = participants.reduce((acc, { id, weight }) => {
    const share = (amount * weight) / totalWeight;
    acc[id] = share;
    return acc;
  }, {} as Record<string, number>);

  return shares;
}
