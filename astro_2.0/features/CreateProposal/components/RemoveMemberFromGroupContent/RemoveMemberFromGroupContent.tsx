import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { DebouncedInput } from 'components/inputs/Input';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { Group } from 'features/vote-policy/components/Group';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { useTranslation } from 'next-i18next';

import styles from './RemoveMemberFromGroupContent.module.scss';

interface ChangeDaoNameContentProps {
  groups: string[];
}

export const RemoveMemberFromGroupContent: FC<ChangeDaoNameContentProps> = ({
  groups,
}) => {
  const { register, setValue, getValues } = useFormContext();
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper fieldName="group" label={t('proposalCard.group')}>
          <DropdownSelect
            {...register('group')}
            onChange={v => {
              setValue('group', v as string, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            defaultValue={getValues().group}
            placeholder="Select group"
            isBorderless
            options={groups.map(group => ({
              value: group,
              label: <Group name={group} />,
            }))}
          />
        </InputWrapper>
      </div>
      <div className={styles.row}>
        <InputWrapper
          fieldName="memberName"
          label={t('proposalCard.proposalTarget')}
          flex
        >
          <DebouncedInput
            className={cn(styles.inputWrapper, styles.wide)}
            placeholder="someverylonglongname.near"
            isBorderless
            size="block"
            {...register('memberName')}
            onValueChange={val =>
              setValue('memberName', val, { shouldValidate: true })
            }
          />
        </InputWrapper>
      </div>
    </div>
  );
};
