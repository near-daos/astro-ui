import React, { VFC } from 'react';
import { useDebounce } from 'react-use';

import { formatDaoAddress } from 'astro_2.0/features/CreateDao/components/DaoNameForm/helpers';

import { configService } from 'services/ConfigService';

import styles from './DaoAddress.module.scss';

interface DaoAddressProps {
  displayName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: any) => void;
}

export const DaoAddress: VFC<DaoAddressProps> = ({ displayName, onChange }) => {
  const { nearConfig } = configService.get();

  useDebounce(
    () => {
      const address = formatDaoAddress(displayName);

      onChange({
        target: {
          value: address,
        },
      });
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
