import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import { DAO } from 'types/dao';

import styles from './ViewToggle.module.scss';

interface ViewToggleProps {
  className?: string;
  dao: DAO;
}

export const ViewToggle: FC<ViewToggleProps> = ({ dao, className }) => {
  const router = useRouter();
  const { asPath } = router;
  const currentPath = asPath.split('?')[0];

  const subPages = {
    feed: `/dao/${dao.id}/tasks/bounties/feed?bountyPhase=inProgress`,
    list: `/dao/${dao.id}/tasks/bounties/list`,
  };

  const handleSelectView = useCallback(
    (view: string) => {
      router.push(view);
    },
    [router]
  );

  return (
    <div className={cn(styles.root, className)}>
      <Button
        size="small"
        variant="tertiary"
        onClick={() => handleSelectView(subPages.feed)}
        className={cn(styles.buttonWrapper, styles.first)}
      >
        <Icon
          name="feed"
          className={cn(styles.button, {
            [styles.active]: subPages.feed.indexOf(currentPath) === 0,
          })}
        />
      </Button>
      <Button
        size="small"
        variant="tertiary"
        onClick={() => handleSelectView(subPages.list)}
        className={cn(styles.buttonWrapper)}
      >
        <Icon
          name="list"
          className={cn(styles.button, {
            [styles.active]: subPages.list.indexOf(currentPath) === 0,
          })}
        />
      </Button>
    </div>
  );
};
