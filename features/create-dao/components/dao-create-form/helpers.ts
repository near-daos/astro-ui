export function formatDaoAddress(address = ''): string {
  return address.toLowerCase().trim().replace(/ +/g, ' ').replace(/ /g, '-');
}
