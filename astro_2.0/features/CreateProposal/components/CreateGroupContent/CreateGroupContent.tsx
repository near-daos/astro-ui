import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/input/Input';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import styles from './CreateGroupContent.module.scss';

interface CreateGroupContentProps {
  daoId: string;
}

export const CreateGroupContent: FC<CreateGroupContentProps> = ({ daoId }) => {
  const { register } = useFormContext();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <Input
          label="New Group Name"
          className={cn(styles.inputWrapper, styles.wide)}
          placeholder="group-name-here"
          isBorderless
          size="block"
          {...register('group')}
        />
        <Input
          label="Member Name"
          className={cn(styles.inputWrapper, styles.wide)}
          placeholder="member-name-here"
          isBorderless
          size="block"
          {...register('memberName')}
        />
      </div>

      <div className={styles.row}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};
