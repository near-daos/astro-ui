import { UrlObject } from 'url';
import React, { FC, useCallback, useState } from 'react';
import { Popup } from 'components/Popup';
import cn from 'classnames';
import { Button } from 'components/button/Button';
import { useRouter } from 'next/router';

import styles from './DaoInfoCard.module.scss';

interface DaoMembersProps {
  infoType: 'members' | 'funds';
  title: string;
  url: string | UrlObject;
  daoFunds?: string;
  groups?: number;
  members?: number;
  tooltip?: string;
}

export const DaoInfoCard: FC<DaoMembersProps> = ({
  infoType,
  title,
  url,
  daoFunds,
  groups,
  members,
  tooltip,
}) => {
  const router = useRouter();
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const boldText = infoType === 'members' ? members : daoFunds;
  const lightText = infoType === 'members' ? `/${groups}` : ' USD';

  const handleClick = useCallback(
    e => {
      e.preventDefault();

      router.push(url);
    },
    [router, url]
  );

  return (
    <div
      className={cn(styles.root, {
        [styles.members]: infoType === 'members',
      })}
      ref={setRef}
    >
      <Button variant="transparent" onClick={handleClick} size="block">
        <div className={styles.label}>{title}</div>
        <div className={styles.value}>
          <span className={styles.bold}>{boldText}</span>
          {lightText}
        </div>
      </Button>
      <Popup anchor={ref} offset={[0, -10]} placement="top">
        {tooltip}
      </Popup>
    </div>
  );
};
