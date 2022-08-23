import cn from 'classnames';
import React, { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMedia } from 'react-use';

import { Icon } from 'components/Icon';

import { useAppVersion } from 'hooks/useAppVersion';
import { ContextPopup } from 'astro_3.0/components/ContextPopup';
import { Button } from 'components/button/Button';
import { AppLogoSelector } from 'astro_3.0/components/AppLogoSelector';

import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

import styles from './DaoDashboardLogo.module.scss';

interface Props {
  src: string | undefined | null;
  className?: string;
  size?: 'md';
  isEditable: boolean;
}

export const DaoDashboardLogo: FC<Props> = ({
  src,
  size,
  className,
  isEditable,
}) => {
  const isMobile = useMedia('(max-width: 768px)');
  const { appVersion } = useAppVersion();
  const { watch, setValue } = useFormContext();
  const isNextVersion = appVersion === 3;

  const flagLogo = watch('flagLogo');

  const logo = useMemo(() => {
    if (flagLogo && flagLogo[0]) {
      return (
        <div
          className={styles.logo}
          style={{
            backgroundSize: flagLogo[0].name?.startsWith('avatar')
              ? '105% 105%'
              : 'cover',
            backgroundImage: `url(${getImageFromImageFileList(flagLogo)})`,
          }}
        />
      );
    }

    if (src) {
      return (
        <div
          className={styles.logo}
          style={{ backgroundImage: `url(${src})` }}
        />
      );
    }

    if (isNextVersion) {
      return (
        <div
          className={styles.logo}
          style={{
            backgroundSize: '105% 105%',
            backgroundImage: `url(/avatars/avatar1.png)`,
          }}
        />
      );
    }

    return <Icon name="defaultDaoLogo" className={styles.defaultLogo} />;
  }, [isNextVersion, flagLogo, src]);

  const rootClassName = cn(styles.root, className, {
    [styles.md]: size === 'md',
    [styles.square]: isNextVersion,
  });

  function renderContent() {
    if (isNextVersion && isMobile) {
      return (
        <Button
          disabled={!isEditable}
          variant="transparent"
          size="block"
          onClick={() => {
            setValue('flagLogo', '', { shouldDirty: true });
          }}
        >
          <div
            className={cn(styles.logoControl, {
              [styles.editable]: isEditable,
            })}
          >
            {logo}
            <div className={styles.logoOverlay}>
              <Icon name="camera" className={styles.overlayIcon} />
              <div className={styles.overlayText}>Change Logo</div>
            </div>
          </div>
        </Button>
      );
    }

    if (isNextVersion) {
      return (
        <ContextPopup
          offset={[84, -64]}
          className={styles.popup}
          controlItem={onClick => (
            <Button
              disabled={!isEditable}
              variant="transparent"
              size="block"
              onClick={onClick}
            >
              <div
                className={cn(styles.logoControl, {
                  [styles.editable]: isEditable,
                })}
              >
                {logo}
                <div className={styles.logoOverlay}>
                  <Icon name="camera" className={styles.overlayIcon} />
                  <div className={styles.overlayText}>Change Logo</div>
                </div>
              </div>
            </Button>
          )}
        >
          <AppLogoSelector />
        </ContextPopup>
      );
    }

    return logo;
  }

  return <div className={rootClassName}>{renderContent()}</div>;
};
