import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { useMountedState } from 'react-use';
import { Icon } from 'components/Icon';

import styles from './InfoPanel.module.scss';

export const InfoPanel: FC = () => {
  const [open, setOpen] = useState(true);
  const isMounted = useMountedState();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isMounted()) {
        setOpen(false);
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isMounted]);

  return (
    <div
      className={cn(styles.root, { [styles.open]: open })}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div>
        <Icon name="info" className={styles.infoIcon} />
      </div>
      <div className={styles.message}>
        Please make sure pop-ups and redirects are allowed on this page,
        <br />
        otherwise proposal may fail to be created
      </div>
    </div>
  );
};
