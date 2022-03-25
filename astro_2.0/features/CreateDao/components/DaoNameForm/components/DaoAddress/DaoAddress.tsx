import React, { VFC } from 'react';
import { useDebounce } from 'react-use';

import { formatDaoAddress } from 'astro_2.0/features/CreateDao/components/DaoNameForm/helpers';
import { validateDaoAddress } from 'astro_2.0/features/CreateDao/helpers';

import { configService } from 'services/ConfigService';

import styles from './DaoAddress.module.scss';

interface DaoAddressProps {
  name?: string;
  displayName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: any) => void;
  onError?: () => void;
}

export const DaoAddress: VFC<DaoAddressProps> = ({
  displayName,
  onChange,
  onError,
}) => {
  const { nearConfig } = configService.get();

  useDebounce(
    async () => {
      const address = formatDaoAddress(displayName);

      const res = await validateDaoAddress(address);

      if (!res && onError) {
        onError();
      } else {
        onChange(address);
      }
    },
    500,
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
