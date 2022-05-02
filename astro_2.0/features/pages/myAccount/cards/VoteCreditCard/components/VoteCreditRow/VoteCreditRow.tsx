import React, { FC, useCallback } from 'react';
import { useMedia } from 'react-use';

import { shortenString } from 'utils/format';

import { CopyButton } from 'astro_2.0/components/CopyButton';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import { VoteCreditModal } from 'astro_2.0/features/pages/myAccount/cards/VoteCreditCard/components/VoteCreditModal';

import { DaoFeedItem } from 'types/dao';

import styles from './VoteCreditRow.module.scss';

interface Props {
  dao: DaoFeedItem;
}

export const VoteCreditRow: FC<Props> = ({ dao }) => {
  const isMobile = useMedia('(max-width: 640px)');

  const [showModal] = useModal(VoteCreditModal);

  const handleAssign = useCallback(async () => {
    await showModal({
      daoName: dao.name || dao.id,
      daoFunds: dao.totalDaoFunds,
    });
  }, [dao.id, dao.name, dao.totalDaoFunds, showModal]);

  return (
    <div className={styles.root}>
      <div className={styles.name}>
        <div className={styles.details}>
          <div className={styles.daoName}>{dao.name}</div>
          <div className={styles.address}>
            <div className={styles.addressId}>
              {shortenString(dao.id, isMobile ? 18 : 36)}
            </div>
            <CopyButton
              text={dao.id}
              tooltipPlacement="auto"
              className={styles.copyAddress}
            />
          </div>
        </div>
      </div>
      <div className={styles.control}>
        <Button size="small" capitalize onClick={handleAssign}>
          Assign amount
        </Button>
      </div>
    </div>
  );
};
