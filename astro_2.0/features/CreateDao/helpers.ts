import { SputnikNearService } from 'services/sputnik';
import { configService } from 'services/ConfigService';

export async function validateDaoAddress(
  value: string | undefined
): Promise<boolean> {
  if (!value) {
    return true;
  }

  const { nearConfig } = configService.get();

  const res = await SputnikNearService.nearAccountExist(
    `${value}.${nearConfig?.contractName ?? ''}`
  );

  return !res;
}
