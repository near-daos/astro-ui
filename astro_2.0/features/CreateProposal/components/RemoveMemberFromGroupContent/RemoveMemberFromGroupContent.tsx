import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/input/Input';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';
import { Group } from 'features/vote-policy/components/group';

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
        <Input
          label="Target"
          className={cn(styles.inputWrapper, styles.wide)}
          placeholder="someverylonglongname.near"
          isBorderless
          size="block"
          {...register('memberName')}
        />
      </div>
      <div className={styles.row}>
        <DropdownSelect
          {...register('group')}
          onChange={v => {
            setValue('group', v as string, { shouldDirty: true });
          }}
          label="Group"
          isBorderless
          options={groups.map(group => ({
            label: group,
            component: <Group name={group} />,
          }))}
        />
      </div>
    </div>
  );
};
