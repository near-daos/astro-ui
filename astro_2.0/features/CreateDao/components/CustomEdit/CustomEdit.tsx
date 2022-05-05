import React, { FC, useCallback } from 'react';
import { useStateMachine } from 'little-state-machine';
import cn from 'classnames';

import { Button } from 'components/button/Button';
import { CustomEditModal } from 'astro_2.0/features/CreateDao/components/CustomEdit/CustomEditModal';

import { updateAction } from 'astro_2.0/features/CreateDao/components/helpers';
import { useModal } from 'components/modal';

import { getNewDaoParams } from 'astro_2.0/features/CreateDao/helpers';
import { useCreateDao } from 'astro_2.0/features/CreateDao/components/hooks';
import { mapCreateDaoParamsToContractParams } from 'services/sputnik/mappers';
import { jsonToBase64Str } from 'utils/jsonToBase64Str';

import { useWalletContext } from 'context/WalletContext';
import styles from './CustomEdit.module.scss';

interface CustomEditProps {
  className?: string;
}

const CustomEdit: FC<CustomEditProps> = ({ className }) => {
  const [showModal] = useModal(CustomEditModal);
  const { state } = useStateMachine({ updateAction });
  const { createDao } = useCreateDao();
  const { accountId } = useWalletContext();

  const handleClick = useCallback(async () => {
    const newDaoParams = getNewDaoParams(state, accountId, '');

    const args = mapCreateDaoParamsToContractParams(newDaoParams);

    const json = JSON.stringify(args, null, 2);

    const res = await showModal({ json });

    if (res.length && res[0]) {
      const result = JSON.parse(res[0].json);

      const mappedArgs = jsonToBase64Str(result);

      if (result?.config?.name) {
        await createDao(result.config.name, {
          args: mappedArgs,
          amountToTransfer: newDaoParams.amountToTransfer,
          gas: newDaoParams.gas,
          name: result.config.name,
        });
      }
    }
  }, [createDao, showModal, state, accountId]);

  return (
    <div className={cn(styles.root, className)}>
      <Button
        onClick={handleClick}
        variant="secondary"
        className={styles.customEditButton}
        size="small"
      >
        Custom Edit
      </Button>
    </div>
  );
};

export default CustomEdit;
