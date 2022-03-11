import React, { FC, useCallback } from 'react';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { Modal, useModal } from 'components/modal';
import { useDaoSubscriptions } from 'hooks/useDaoSubscriptions';
import { useTranslation } from 'next-i18next';

import styles from './FollowButton.module.scss';

interface FollowButtonProps {
  daoId: string;
  daoName: string;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  daoName,
}: {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
  daoName: string;
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.confirmRoot}>
        <div className={styles.confirmText}>
          {t('confirmUnsubscribe')}
          &nbsp;
          <span className={styles.highlighted}>{daoName}</span>?
        </div>
        <Button onClick={() => onClose(true)} className={styles.confirmButton}>
          {t('unsubscribe')}
        </Button>
      </div>
    </Modal>
  );
};

export const FollowButton: FC<FollowButtonProps> = ({ daoId, daoName }) => {
  const { t } = useTranslation();
  const {
    subscriptions,
    handleFollow,
    handleUnfollow,
    isLoading,
  } = useDaoSubscriptions();
  const subscription = subscriptions ? subscriptions[daoId] : null;
  const isSubscribed = !!subscription;

  const [showModal] = useModal(ConfirmModal, {
    daoName: daoName || daoId,
  });

  const confirmUnfollow = useCallback(async () => {
    const res = await showModal();

    if (res?.length && subscription) {
      handleUnfollow(subscription?.subscriptionId);
    }
  }, [handleUnfollow, showModal, subscription]);

  if (!subscriptions) {
    return null;
  }

  return (
    <Button
      disabled={isLoading}
      size="medium"
      variant={isSubscribed ? 'secondary' : 'primary'}
      className={styles.root}
      onClick={() => {
        if (isSubscribed) {
          confirmUnfollow();
        } else {
          handleFollow(daoId);
        }
      }}
    >
      {isSubscribed ? (
        <>
          <div className={styles.subscribed}>
            <Icon name="check" className={styles.followIcon} />
            {t('youFollowed')}
          </div>
          <div className={styles.subscribedHovered}>{t('unfollow')}</div>
        </>
      ) : (
        t('follow')
      )}
    </Button>
  );
};
