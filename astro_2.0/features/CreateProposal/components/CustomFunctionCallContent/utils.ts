export function getWidthOfDepositField(deposit: string): number {
  if (deposit.length <= 6) {
    return 7;
  }

  if (deposit.length >= 15) {
    return 15;
  }

  return deposit.length;
}
