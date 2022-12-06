export function calculateVoicesThreshold(
  votingThreshold: number,
  totalMembers: number
): number {
  if (!totalMembers) {
    return 0;
  }

  const oneMemberVotesPercent = 100 / totalMembers; // 25
  const votesNeeded = votingThreshold / oneMemberVotesPercent; // 74 - 2,96   75 - 3

  if (votesNeeded % 1 !== 0) {
    return Math.ceil(votesNeeded);
  }

  return votesNeeded + 1 > totalMembers ? votesNeeded : votesNeeded + 1;
}
