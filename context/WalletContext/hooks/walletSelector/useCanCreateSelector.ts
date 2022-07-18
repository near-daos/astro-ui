import { useState } from 'react';
import { useRouter } from 'next/router';

import { LOGIN_PAGE } from 'constants/routing';

import { useSelectorLsAccount } from './useSelectorLsAccount';

type ReturnType = {
  canCreateSelector: boolean;
  setCanCreateSelector: (canCreate: boolean) => void;
};

export function useCanCreateSelector(): ReturnType {
  const { pathname } = useRouter();
  const [selectorAccountId] = useSelectorLsAccount();

  const [canCreateSelector, setCanCreateSelector] = useState(
    pathname === LOGIN_PAGE || !!selectorAccountId
  );

  return {
    canCreateSelector,
    setCanCreateSelector,
  };
}
