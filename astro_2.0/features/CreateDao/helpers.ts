import { SputnikNearService } from 'services/sputnik';
import { nearConfig } from 'config';

export async function validateDaoAddress(
  value: string | undefined
): Promise<boolean> {
  if (!value) {
    return true;
  }

  const res = await SputnikNearService.nearAccountExist(
    `${value}.${nearConfig.contractName}`
  );

  return !res;
}
