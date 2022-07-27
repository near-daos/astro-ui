import cn from 'classnames';
import React, { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { DebouncedInput } from 'components/inputs/Input';
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
  const { register, setValue, getValues, watch } = useFormContext();
  const { t } = useTranslation();

  const currentValue = watch('memberName');

  const onChange = useCallback(
    v => {
      setValue('group', v as string, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper fieldName="group" label={t('proposalCard.group')}>
          <DropdownSelect
            {...register('group')}
            onChange={onChange}
            defaultValue={getValues().group}
            reverseMenu
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
            defaultValue={currentValue}
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
