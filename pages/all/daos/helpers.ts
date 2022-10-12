export function getFilterValue(
  useOpenSearch: boolean,
  daosView: string
): string {
  if (useOpenSearch) {
    return daosView === 'active' ? 'Active' : 'Active Inactive';
  }

  return daosView === 'active' ? 'status||$eq||Active' : '';
}
