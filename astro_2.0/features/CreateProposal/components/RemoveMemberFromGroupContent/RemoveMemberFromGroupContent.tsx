import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/input/Input';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';
import { Group } from 'features/vote-policy/components/group';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './RemoveMemberFromGroupContent.module.scss';

interface ChangeDaoNameContentProps {
  groups: string[];
}

export const RemoveMemberFromGroupContent: FC<ChangeDaoNameContentProps> = ({
  groups,
}) => {
  const { register, setValue } = useFormContext();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper fieldName="group" label="Group">
          <DropdownSelect
            {...register('group')}
            onChange={v => {
              setValue('group', v as string, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            isBorderless
            options={groups.map(group => ({
              label: group,
              component: <Group name={group} />,
            }))}
          />
        </InputWrapper>
      </div>
      <div className={styles.row}>
        <InputWrapper fieldName="memberName" label="Target">
          <Input
            className={cn(styles.inputWrapper, styles.wide)}
            placeholder="someverylonglongname.near"
            isBorderless
            size="block"
            {...register('memberName')}
          />
        </InputWrapper>
      </div>
    </div>
  );
};
