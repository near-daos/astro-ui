import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';

import { IconButton } from 'components/button/IconButton';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { useModal } from 'components/modal';
import { ConfirmModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/ConfirmModal';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

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
  const [open, setOpen] = useState(false);
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
    <GenericDropdown
      isOpen={open}
      onOpenUpdate={setOpen}
      parent={
        <div className={styles.root}>
          <IconButton icon="buttonMore" className={styles.rootIcon} />
        </div>
      }
    >
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Button
            variant="transparent"
            className={cn(styles.buttonContent)}
            size="small"
            onClick={onEdit}
          >
            <Icon name="buttonEdit" className={styles.icon} /> <span>Edit</span>
          </Button>
        </li>
        <li className={cn(styles.menuItem, styles.red)}>
          <Button
            variant="transparent"
            className={cn(styles.buttonContent, styles.red)}
            size="small"
            onClick={handleDelete}
          >
            <Icon name="buttonDelete" className={styles.icon} />{' '}
            <span>Remove</span>
          </Button>
        </li>
      </ul>
    </GenericDropdown>
  );
};
