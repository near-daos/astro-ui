import React, { FC, useState } from 'react';
import { Popup } from 'components/popup/Popup';
import { Icon } from 'components/Icon';
import { formatYoktoValue } from 'helpers/format';

import styles from './bond-info.module.scss';

const TOOLTIP = `To prevent spam, you must pay a bond. The bond will be returned to you when the proposal is approved or rejected. The bond will not be returned if your proposal is marked as spam or expires.`;

interface BondInfoProps {
  bond?: string;
}

export const BondInfo: FC<BondInfoProps> = ({ bond }) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <div className={styles.root}>
      <div className={styles.label}>
        <div>Bond</div>
        <div ref={setRef} className="">
          <Icon name="info" width={12} className={styles.icon} />
        </div>
        <Popup anchor={ref} placement="top-end" offset={[0, 10]}>
          {TOOLTIP}
        </Popup>
      </div>
      <div>
        <span className={styles.bold}>
          {bond ? formatYoktoValue(bond ?? '0') : '-'}
        </span>
        &nbsp;
        <span>NEAR</span>
      </div>
    </div>
  );
};
