export function getAmountFieldWidth(amount?: unknown[]): number {
  if (amount?.length && amount.length <= 6) {
    return 7;
  }

  if (amount?.length && amount.length >= 15) {
    return 15;
  }

  return amount?.length || 7;
}
