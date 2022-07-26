import { AllowanceKey } from 'services/sputnik/SputnikNearService/types';

export type DaoWithAllowanceKey = {
  daoId: string;
  allowanceKey: AllowanceKey | undefined;
  daoName: string;
};
