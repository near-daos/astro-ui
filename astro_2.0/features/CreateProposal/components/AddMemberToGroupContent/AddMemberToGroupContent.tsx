import cn from 'classnames';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/Input';
import { Group } from 'features/vote-policy/components/Group';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './AddMemberToGroupContent.module.scss';

interface AddMemberToGroupContentProps {
  groups: string[];
}

export const AddMemberToGroupContent: FC<AddMemberToGroupContentProps> = ({
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
        <InputWrapper fieldName="memberName" label="Target" flex>
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
