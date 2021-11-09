import React, { FC, useState } from 'react';
import Link from 'next/link';
import { Popup } from 'components/popup/Popup';
import cn from 'classnames';
import styles from './DaoInfoCard.module.scss';

interface DaoMembersProps {
  infoType: 'members' | 'funds';
  title: string;
  url: string;
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
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const boldText = infoType === 'members' ? members : daoFunds;
  const lightText = infoType === 'members' ? `/${groups}` : ' USD';

  return (
    <div
      className={cn(styles.root, {
        [styles.members]: infoType === 'members',
      })}
      ref={setRef}
    >
      <Link href={url}>
        <a>
          <div className={styles.label}>{title}</div>
          <div className={styles.value}>
            <span className={styles.bold}>{boldText}</span>
            {lightText}
          </div>
        </a>
      </Link>
      <Popup anchor={ref} offset={[0, -10]} placement="top">
        {tooltip}
      </Popup>
    </div>
  );
};
