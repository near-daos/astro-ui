import { useLocalStorage } from 'react-use';
import { Dispatch, SetStateAction } from 'react';

type ReturnType = [
  string | undefined,
  Dispatch<SetStateAction<string | undefined>>,
  () => void
];

export function useSelectorLsAccount(): ReturnType {
  return useLocalStorage<string>('selectorAccountId');
}
