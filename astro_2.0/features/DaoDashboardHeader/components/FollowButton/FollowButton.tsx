import React, { FC } from 'react';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { useDaoSubscriptions } from 'hooks/useDaoSubscriptions';
import { useTranslation } from 'next-i18next';

import styles from './FollowButton.module.scss';

interface FollowButtonProps {
  daoId: string;
}

export const FollowButton: FC<FollowButtonProps> = ({ daoId }) => {
  const { t } = useTranslation();
  const {
    subscriptions,
    handleFollow,
    handleUnfollow,
    isLoading,
  } = useDaoSubscriptions();

  if (!subscriptions) {
    return null;
  }

  const subscription = subscriptions[daoId];
  const isSubscribed = !!subscription;

  return (
    <Button
      disabled={isLoading}
      size="block"
      variant={isSubscribed ? 'secondary' : 'primary'}
      className={styles.root}
      onClick={() => {
        if (isSubscribed) {
          handleUnfollow(subscription?.subscriptionId);
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
