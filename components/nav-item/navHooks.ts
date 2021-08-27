import { useRouter } from 'next/router';

export const useIsActive = (href?: string, subHrefs?: string[]): boolean => {
  const { pathname } = useRouter();

  return pathname === href || !!subHrefs?.some(h => h === pathname);
};
