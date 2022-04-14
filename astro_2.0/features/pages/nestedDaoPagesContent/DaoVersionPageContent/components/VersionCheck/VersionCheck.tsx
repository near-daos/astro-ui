import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { DotsLoader } from 'astro_2.0/components/DotsLoader';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Version } from 'services/sputnik/types';

import styles from './VersionCheck.module.scss';

interface VersionCheckProps {
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  version: Version | null;
  handleUpdate: () => void;
}

export const VersionCheck: FC<VersionCheckProps> = ({
  className,
  loading,
  disabled,
  version,
  handleUpdate,
}) => {
  const renderButton = () => {
    const updateButton = (
      <Button
        capitalize
        variant="primary"
        disabled={disabled}
        onClick={handleUpdate}
      >
        Propose Update
      </Button>
    );

    if (!disabled) {
      return updateButton;
    }

    return (
      <Tooltip
        placement="top"
        popupClassName={styles.popupWrapper}
        overlay="It is last version. Can't be updated"
      >
        {updateButton}
      </Tooltip>
    );
  };

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.iconWrapper}>
        <Icon name="navSettingsVersion" className={styles.icon} />
      </div>
      <div className={styles.title}>Your version</div>

      {loading ? (
        <>
          <div className={styles.loadingTitle}>Update check</div>
          <DotsLoader dotClassName={styles.loaderDot} />
        </>
      ) : null}

      {!loading && version ? (
        <div className={styles.version}>
          <div className={styles.date}>Last updated {version.date}</div>
          <div className={styles.number}>N {version.number}</div>
        </div>
      ) : null}

      {!loading ? renderButton() : null}
    </div>
  );
};
