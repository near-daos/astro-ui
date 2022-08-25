import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { Modal, useModal } from 'components/modal';
import { useDaoSubscriptions } from 'hooks/useDaoSubscriptions';
import { useTranslation } from 'next-i18next';

import styles from './FollowButton.module.scss';

interface FollowButtonProps {
  daoId: string;
  daoName: string;
  visible: boolean;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
  daoName: string;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  daoName,
}) => {
  const { t } = useTranslation();

  const closeModal = useCallback(() => {
    onClose(true);
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.confirmRoot}>
        <div className={styles.confirmText}>
          {t('confirmUnsubscribe')}
          &nbsp;
          <span className={styles.highlighted}>{daoName}</span>?
        </div>
        <Button onClick={closeModal} className={styles.confirmButton}>
          {t('unsubscribe')}
        </Button>
      </div>
    </Modal>
  );
};

export const FollowButton: FC<FollowButtonProps> = ({
  daoId,
  daoName,
  visible,
}) => {
  const { t } = useTranslation();
  const { subscriptions, handleFollow, handleUnfollow, isLoading } =
    useDaoSubscriptions();
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

  const toggleSubscription = useCallback(() => {
    if (isSubscribed) {
      confirmUnfollow();
    } else {
      handleFollow(daoId);
    }
  }, [daoId, handleFollow, isSubscribed, confirmUnfollow]);

  if (!subscriptions || !visible) {
    return null;
  }

  return (
    <Button
      disabled={isLoading}
      size="small"
      variant={isSubscribed ? 'secondary' : 'green'}
      className={cn(styles.root, {
        [styles.subscribedBtn]: isSubscribed,
      })}
      onClick={toggleSubscription}
    >
      {isSubscribed ? (
        <div className={styles.subscribed}>
          <Icon name="check" className={styles.followIcon} />
          {t('followed')}
        </div>
      ) : (
        <div className={styles.subscribed}>
          <Icon name="buttonFollow" className={styles.followIcon} />
          {t('follow')}
        </div>
      )}
    </Button>
  );
};
