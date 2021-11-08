import React, { VFC } from 'react';
import { useDebounce } from 'react-use';
import { useFormContext } from 'react-hook-form';

import { nearConfig } from 'config';

import { SputnikNearService } from 'services/sputnik';

import { formatDaoAddress } from 'astro_2.0/features/CreateDao/components/DaoNameForm/helpers';

import styles from './DaoAddress.module.scss';

interface DaoAddressProps {
  displayName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: any) => void;
}

export const DaoAddress: VFC<DaoAddressProps> = ({ displayName, onChange }) => {
  const { setError } = useFormContext();

  async function validateAddress(address: string) {
    const daoAddressExists = await SputnikNearService.nearAccountExist(
      `${address}.${nearConfig.contractName}`
    );

    if (daoAddressExists) {
      setError('address', {
        message: 'Dao with such address already exists.',
      });
    }
  }

  useDebounce(
    () => {
      const address = formatDaoAddress(displayName);

      onChange({
        target: {
          value: address,
        },
      });

      validateAddress(address);
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
      .{nearConfig.contractName}
    </div>
  );
};
