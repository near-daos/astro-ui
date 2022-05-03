import React, { FC, useCallback } from 'react';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import { VoteCreditModal } from 'astro_2.0/features/pages/myAccount/cards/VoteCreditCard/components/VoteCreditModal';
import { DAO } from 'types/dao';

interface Props {
  dao: DAO;
  onClose: () => void;
}

export const VoteCreditDeposit: FC<Props> = ({ dao, onClose }) => {
  const [showModal] = useModal(VoteCreditModal);

  const handleClick = useCallback(async () => {
    const res = await showModal({
      daoName: dao.name || dao.id,
      daoFunds: dao.totalDaoFunds,
    });

    if (res.length) {
      onClose();
    }
  }, [dao.id, dao.name, dao.totalDaoFunds, onClose, showModal]);

  return <Button onClick={handleClick}>Deposit</Button>;
};
