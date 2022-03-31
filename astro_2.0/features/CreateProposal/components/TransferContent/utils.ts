export function getProposalAmountWidth(value = ''): number {
  if (value.length <= 6) {
    return 7;
  }

  if (value.length >= 15) {
    return 15;
  }

  return value.length;
}
