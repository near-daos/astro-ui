import React, { FC, useCallback } from 'react';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import { AllowanceKeyModal } from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/components/AllowanceKeyModal';
import { DAO } from 'types/dao';

interface Props {
  dao: DAO;
  onClose: () => void;
}

export const AllowanceKey: FC<Props> = ({ dao, onClose }) => {
  const [showModal] = useModal(AllowanceKeyModal);

  const handleClick = useCallback(async () => {
    const res = await showModal({
      daoName: dao.name || dao.id,
    });

    if (res.length) {
      onClose();
    }
  }, [dao.id, dao.name, onClose, showModal]);

  return <Button onClick={handleClick}>Deposit</Button>;
};
