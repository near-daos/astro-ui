import React, { FC } from 'react';

import { Button } from 'components/button/Button';
import { Icon, IconName } from 'components/Icon';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import styles from './CommentAction.module.scss';

type CommentActionProps = {
  overlayText: string;
  icon: IconName;
  onClick: () => void;
};

export const CommentAction: FC<CommentActionProps> = ({
  overlayText,
  icon,
  onClick,
}) => {
  return (
    <Tooltip
      popupClassName={styles.tooltipPopup}
      className={styles.tooltip}
      placement="left"
      overlay={<span className={styles.tooltipOverlay}>{overlayText}</span>}
    >
      <Button
        variant="transparent"
        className={styles.button}
        size="small"
        onClick={onClick}
      >
        <Icon name={icon} />{' '}
      </Button>
    </Tooltip>
  );
};
