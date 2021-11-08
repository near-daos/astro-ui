import React, { FC, useState } from 'react';
import Link from 'next/link';
import { Popup } from 'components/popup/Popup';

import styles from './DaoFunds.module.scss';

interface DaoFundsProps {
  daoId: string;
  daoFunds: string;
  tooltip?: string;
  tooltipPlacement?: 'right' | 'top' | 'bottom' | 'left' | 'auto';
}

export const DaoFunds: FC<DaoFundsProps> = ({
  daoId,
  daoFunds,
  tooltip,
  tooltipPlacement,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <div className={styles.root} ref={setRef}>
      <Link href={`/dao/${daoId}/treasury/tokens`}>
        <a>
          <div className={styles.label}>DAO funds</div>
          <div className={styles.value}>
            <span className={styles.bold}>{daoFunds}</span> USD
          </div>
        </a>
      </Link>
      <Popup anchor={ref} offset={[0, -10]} placement={tooltipPlacement}>
        {tooltip}
      </Popup>
    </div>
  );
};
