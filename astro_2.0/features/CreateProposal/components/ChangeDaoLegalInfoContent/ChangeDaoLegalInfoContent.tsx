import cn from 'classnames';
import React, { VFC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/input/Input';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './ChangeDaoLegalInfoContent.module.scss';

interface ChangeDaoLegalInfoProps {
  daoId: string;
}

export const ChangeDaoLegalInfoContent: VFC<ChangeDaoLegalInfoProps> = ({
  daoId,
}) => {
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();

  function fieldValid(key: string) {
    return touchedFields[key] && !errors?.[key]?.message;
  }

  return (
    <div className={styles.root}>
      <div className={styles.inputsHolder}>
        <InputWrapper fieldName="legalStatus" label="DAO’s Legal Status">
          <Input
            {...register('legalStatus')}
            isValid={fieldValid('legalStatus')}
            size="block"
            inputClassName={styles.input}
            isBorderless
            placeholder="Public Limited Company"
            textAlign="left"
          />
        </InputWrapper>

        <InputWrapper fieldName="legalLink" label="Legal Document">
          <Input
            {...register('legalLink')}
            isValid={fieldValid('legalLink')}
            size="block"
            inputClassName={styles.input}
            isBorderless
            placeholder="Link"
            textAlign="left"
          />
        </InputWrapper>
      </div>
      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};
