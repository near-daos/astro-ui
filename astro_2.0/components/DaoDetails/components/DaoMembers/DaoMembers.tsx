import React, { FC, useState } from 'react';
import Link from 'next/link';
import { Popup } from 'components/popup/Popup';

import styles from './DaoMembers.module.scss';

interface DaoMembersProps {
  daoId: string;
  groups: number;
  members: number;
  tooltip?: string;
  tooltipPlacement?: 'right' | 'top' | 'bottom' | 'left' | 'auto';
}

export const DaoMembers: FC<DaoMembersProps> = ({
  daoId,
  groups,
  members,
  tooltip,
  tooltipPlacement,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <div className={styles.root} ref={setRef}>
      <Link href={`/dao/${daoId}/groups/all-members`}>
        <a>
          <div className={styles.label}>Members/Groups</div>
          <div className={styles.value}>
            <span className={styles.bold}>{members}</span>/{groups}
          </div>
        </a>
      </Link>
      <Popup anchor={ref} offset={[0, -10]} placement={tooltipPlacement}>
        {tooltip}
      </Popup>
    </div>
  );
};
