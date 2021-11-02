import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/input/Input';
import { Group } from 'features/vote-policy/components/group';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';

import styles from './ChangePolicyContent.module.scss';

export const ChangePolicyContent: FC = () => {
  const { register, setValue } = useFormContext();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <DropdownSelect
          onChange={v => {
            setValue('group', v as string, { shouldDirty: true });
          }}
          disabled
          label="Group"
          isBorderless
          defaultValue="All groups"
          options={[
            { label: 'All groups', component: <Group name="All groups" /> },
          ]}
        />
        <DropdownSelect
          onChange={v => {
            setValue('group', v as string, { shouldDirty: true });
          }}
          disabled
          label="Who votes"
          defaultValue="Person"
          isBorderless
          options={[{ label: 'Person', component: <span>Person</span> }]}
        />
        <Input
          {...register('amount')}
          placeholder="Amount"
          label="Consensus"
          isBorderless
          textAlign="left"
          type="number"
          size="small"
          className={styles.amount}
        />
        <div className={styles.percent}>%</div>
      </div>
    </div>
  );
};
