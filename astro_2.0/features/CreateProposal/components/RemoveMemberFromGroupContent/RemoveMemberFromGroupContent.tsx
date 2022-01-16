import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/Input';
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
  const { register, setValue } = useFormContext();
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
            isBorderless
            options={groups.map(group => ({
              label: group,
              component: <Group name={group} />,
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
