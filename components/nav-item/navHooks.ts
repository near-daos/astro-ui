import reduce from 'lodash/reduce';
import { useRouter } from 'next/router';

export const useIsActive = (href?: string, subHrefs?: string[]): boolean => {
  const router = useRouter();
  const { pathname, query } = router;

  const filledPathname = reduce(
    query as Record<string, string>,
    (acc, val, key) => {
      return acc.replace(`[${key}]`, val);
    },
    pathname
  );

  return (
    href === pathname ||
    !!subHrefs?.some(h => h === pathname) ||
    href === filledPathname
  );
};
