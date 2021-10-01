export function formatDaoAddress(address = ''): string {
  return address.toLowerCase().replace(/ +/g, ' ').replace(/ /g, '-');
}
