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

import styles from './complete-bounty-form.module.scss';

interface CompleteBountyFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

interface ICompleteBountyForm {
  recipient: string;
  details: string;
  externalUrl: string;
}

const schema = yup.object().shape({
  recipient: yup.string().required(),
  details: yup.string(),
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
  } = useForm<ICompleteBountyForm>({
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <div className={styles.recipient}>
        <Input
          isValid={touchedFields.recipient && !errors.recipient?.message}
          size="block"
          textAlign="left"
          type="number"
          {...register('recipient')}
          label="Send payment to"
          className={cn(styles.input)}
        />
        <span className={cn(styles.ml8, styles.inputInline)}>.near</span>
      </div>
      <div className={styles.group}>
        <TextArea
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
        isValid={touchedFields.externalUrl && !errors.externalUrl?.message}
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
