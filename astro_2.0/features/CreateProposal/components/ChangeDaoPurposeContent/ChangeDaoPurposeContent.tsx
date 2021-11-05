import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';

import { TextArea } from 'components/inputs/textarea/TextArea';

import { LOREN_IPSUM } from 'constants/common';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './ChangeDaoPurposeContent.module.scss';

interface ChangeDaoPurposeContentProps {
  daoId: string;
}

export const ChangeDaoPurposeContent: FC<ChangeDaoPurposeContentProps> = ({
  daoId,
}) => {
  const {
    register,
    // setValue,
    // getValues,
    formState: { errors, touchedFields },
  } = useFormContext();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper fieldName="purpose" label="New Purpose" fullWidth>
          <TextArea
            isValid={touchedFields.purpose && !errors.purpose?.message}
            size="block"
            textAlign="left"
            resize="none"
            placeholder={LOREN_IPSUM}
            className={styles.textArea}
            isBorderless
            maxLength={500}
            maxRows={3}
            minRows={1}
            {...register('purpose')}
          />
        </InputWrapper>
      </div>
      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};
