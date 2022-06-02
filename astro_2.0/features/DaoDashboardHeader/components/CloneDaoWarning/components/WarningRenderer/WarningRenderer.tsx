import React, { FC, ReactElement, useCallback, useMemo } from 'react';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { useModal } from 'components/modal';
import { ConfirmDismissModal } from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning/components/ConfirmDismissModal';
import { Button } from 'components/button/Button';

import styles from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning/CloneDaoWarning.module.scss';

interface Props {
  variant: 'progress' | 'info' | 'success' | 'fail';
  title: string;
  control?: ReactElement;
  className?: string;
  daoId: string;
  onDismiss: () => void;
}

export const WarningRenderer: FC<Props> = ({
  variant,
  title,
  control,
  children,
  className,
  onDismiss,
}) => {
  const [showModal] = useModal(ConfirmDismissModal);

  const handleDismissClick = useCallback(async () => {
    const res = await showModal();

    if (res[0]) {
      onDismiss();
    }
  }, [onDismiss, showModal]);

  const classesProps = useMemo(() => {
    switch (variant) {
      case 'progress': {
        return {
          rootClassName: styles.progressRoot,
          statusClassName: styles.progressStatus,
          iconClassName: styles.progressIcon,
        };
      }
      case 'success': {
        return {
          rootClassName: styles.successRoot,
          statusClassName: styles.successStatus,
          iconClassName: styles.successIcon,
        };
      }
      case 'fail': {
        return {
          rootClassName: styles.failRoot,
          statusClassName: styles.failStatus,
          iconClassName: styles.failIcon,
        };
      }
      case 'info':
      default: {
        return {
          rootClassName: styles.infoRoot,
          statusClassName: styles.infoStatus,
          iconClassName: styles.infoIcon,
        };
      }
    }
  }, [variant]);

  return (
    <DaoWarning
      {...classesProps}
      icon="proposalSendFunds"
      content={
        <>
          <div className={styles.title}>{title}</div>
          {children}
        </>
      }
      control={
        <>
          <Button
            capitalize
            variant="tertiary"
            size="small"
            className={styles.close}
            onClick={handleDismissClick}
          >
            Dismiss
          </Button>
          {control}
        </>
      }
      className={className}
    />
  );
};
