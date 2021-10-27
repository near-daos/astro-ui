import React, { FC, useEffect, useState } from 'react';
import { CopyButton } from 'features/copy-button';
import { ActionButton } from 'features/proposal/components/action-button';

import styles from './proposal-actions.module.scss';

export const ProposalActions: FC = () => {
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    setLocation(document.location.href);
  }, []);

  return (
    <div className={styles.root}>
      <a
        className={styles.link}
        href="https://airtable.com/shr4ZmQzmTE5cKZm3"
        target="_blank"
        rel="noreferrer noopener"
      >
        <ActionButton
          tooltip="Report"
          iconName="buttonReport"
          className={styles.icon}
        />
      </a>
      <ActionButton
        tooltip="Share"
        iconName="buttonShare"
        className={styles.icon}
      />
      <ActionButton
        tooltip="Tweet"
        iconName="socialTwitter"
        className={styles.icon}
      />
      <CopyButton text={location} />
    </div>
  );
};
