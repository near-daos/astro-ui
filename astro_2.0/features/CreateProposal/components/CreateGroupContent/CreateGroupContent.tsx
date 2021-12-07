import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/Input';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './CreateGroupContent.module.scss';

interface CreateGroupContentProps {
  daoId: string;
}

export const CreateGroupContent: FC<CreateGroupContentProps> = ({ daoId }) => {
  const { register } = useFormContext();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper fieldName="group" label="New Group Name" flex>
          <Input
            className={cn(styles.inputWrapper, styles.wide)}
            placeholder="group-name-here"
            isBorderless
            size="block"
            {...register('group')}
          />
        </InputWrapper>
        <InputWrapper fieldName="memberName" label="Initial Member Name" flex>
          <Input
            className={cn(styles.inputWrapper, styles.wide)}
            placeholder="member-name-here"
            isBorderless
            size="block"
            {...register('memberName')}
          />
        </InputWrapper>
      </div>

      <div className={styles.row}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};
