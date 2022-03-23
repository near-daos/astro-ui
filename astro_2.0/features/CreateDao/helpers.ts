import { configService } from 'services/ConfigService';

export async function validateDaoAddress(
  value: string | undefined
): Promise<boolean> {
  if (!value) {
    return true;
  }

  const { nearConfig } = configService.get();

  return window.nearService.nearAccountExist(
    `${value}.${nearConfig?.contractName ?? ''}`
  );
}
