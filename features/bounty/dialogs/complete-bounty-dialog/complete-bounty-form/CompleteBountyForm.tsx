import React, { FC } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';

import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';
import { TextArea } from 'components/textarea/TextArea';

import { VoteDetails } from 'components/vote-details';

import { SputnikService } from 'services/SputnikService';
import styles from './complete-bounty-form.module.scss';

interface CompleteBountyFormProps {
  onSubmit: (data: CompleteBountyFormInput) => void;
  onCancel: () => void;
}

export interface CompleteBountyFormInput {
  recipient: string;
  details: string;
  externalUrl: string;
}

const schema = yup.object().shape({
  recipient: yup.string().required(),
  details: yup.string().required(),
  externalUrl: yup.string()
});

export const CompleteBountyForm: FC<CompleteBountyFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields }
  } = useForm<CompleteBountyFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      recipient: SputnikService.getAccountId()
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <div className={styles.recipient}>
        <Input
          isValid={touchedFields.recipient && !errors.recipient?.message}
          size="block"
          textAlign="left"
          type="text"
          label="Send payment to"
          className={cn(styles.input)}
          {...register('recipient')}
        />
        {/* <span className={cn(styles.ml8, styles.inputInline)}></span> */}
      </div>
      <div className={styles.group}>
        <TextArea
          isValid={touchedFields.details && !errors.details?.message}
          size="block"
          textAlign="left"
          resize="none"
          placeholder="Sample text"
          className={styles.textArea}
          label="Details"
          {...register('details')}
        />
      </div>
      <Input
        size="block"
        textAlign="left"
        {...register('externalUrl')}
        label="External URL"
        className={cn(styles.input, styles.externalUrl)}
      />
      <div className={styles.vote}>
        <ExpandableDetails label="Vote details">
          <VoteDetails scope="bountyDone" />
        </ExpandableDetails>
      </div>
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={onCancel}
          size="small"
          className={styles.mr8}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          size="small"
          className={styles.ml8}
        >
          Propose
        </Button>
      </div>
    </form>
  );
};
