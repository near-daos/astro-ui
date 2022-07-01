import React, { FC, useCallback } from 'react';

import { useModal } from 'components/modal';
import { ConfirmModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/ConfirmModal';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import styles from './CommentActions.module.scss';

interface Props {
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  id: string;
  isEditable: boolean;
}

export const CommentActions: FC<Props> = ({
  onEdit,
  onDelete,
  id,
  isEditable,
}) => {
  const [showModal] = useModal(ConfirmModal);

  const handleDelete = useCallback(async () => {
    const res = await showModal({
      title: 'Delete comment',
      message: 'Are you sure you want to delete selected comment?',
    });

    if (res[0]) {
      await onDelete(id);
    }
  }, [id, onDelete, showModal]);

  if (!isEditable) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Tooltip
        popupClassName={styles.tooltipPopup}
        className={styles.tooltip}
        placement="left"
        overlay={<span className={styles.tooltipOverlay}>Delete</span>}
      >
        <Button
          variant="transparent"
          className={styles.button}
          size="small"
          onClick={handleDelete}
        >
          <Icon name="buttonDelete" />{' '}
        </Button>
      </Tooltip>
      <Tooltip
        popupClassName={styles.tooltipPopup}
        className={styles.tooltip}
        placement="left"
        overlay={<span className={styles.tooltipOverlay}>Edit</span>}
      >
        <Button
          variant="transparent"
          className={styles.button}
          size="small"
          onClick={onEdit}
        >
          <Icon name="buttonEdit" />{' '}
        </Button>
      </Tooltip>
    </div>
  );
};
