import React, { FC, useRef, useState } from 'react';
import cn from 'classnames';
import { useClickAway } from 'react-use';

import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './proposal-actions.module.scss';

export const MobileProposalActions: FC = () => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useClickAway(ref, () => {
    setOpen(false);
  });

  return (
    <div className={styles.mobileRoot} ref={ref}>
      <IconButton
        icon="buttonMore"
        size="medium"
        className={cn({
          [styles.open]: open,
        })}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className={styles.options}>
          <Button variant="tertiary" className={styles.button}>
            <Icon name="buttonShare" width={20} /> Share
          </Button>
          <Button variant="tertiary" className={styles.button}>
            <Icon name="socialTwitter" width={20} /> Tweet
          </Button>
          <Button variant="tertiary" className={styles.button}>
            <Icon name="buttonCopy" width={20} /> Copy link
          </Button>
          <Button variant="tertiary" className={styles.button}>
            <Icon name="buttonReport" width={20} /> Report
          </Button>
        </div>
      )}
    </div>
  );
};
