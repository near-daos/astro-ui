import React, { VFC } from 'react';
import { useDebounce } from 'react-use';

import { formatDaoAddress } from 'astro_2.0/features/CreateDao/components/DaoNameForm/helpers';
import { validateDaoAddress } from 'astro_2.0/features/CreateDao/helpers';

import { configService } from 'services/ConfigService';

import { useWalletContext } from 'context/WalletContext';
import styles from './DaoAddress.module.scss';

interface DaoAddressProps {
  name?: string;
  displayName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: any) => void;
  onError?: (v?: string) => void;
}

export const DaoAddress: VFC<DaoAddressProps> = ({
  displayName,
  onChange,
  onError,
}) => {
  const { nearConfig } = configService.get();
  const { nearService } = useWalletContext();

  useDebounce(
    async () => {
      const address = formatDaoAddress(displayName);

      if (!address && onError) {
        return;
      }

      const isAccountExist = await validateDaoAddress(
        address,
        nearService ?? undefined
      );

      if (isAccountExist && onError) {
        onError(address);
      } else {
        onChange(address);
      }
    },
    300,
    [displayName]
  );

  return (
    <div className={styles.addressText}>
      {displayName ? (
        formatDaoAddress(displayName)
      ) : (
        <span className={styles.addressPlaceholder}>sampledaoname</span>
      )}
      .{nearConfig?.contractName ?? ''}
    </div>
  );
};
