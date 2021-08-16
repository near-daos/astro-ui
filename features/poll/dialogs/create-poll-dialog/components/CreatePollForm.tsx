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
import { BondDetail, VoteDetail } from 'features/types';
import styles from './create-poll-form.module.scss';

interface CreatePollFormProps {
  voteDetails: VoteDetail[];
  bondDetail: BondDetail;
  onSubmit: () => void;
  onCancel: () => void;
}

interface ICreatePollForm {
  question: string;
  externalUrl: string;
}

const schema = yup.object().shape({
  question: yup.string().required(),
  externalUrl: yup.string()
});

export const CreatePollForm: FC<CreatePollFormProps> = ({
  onSubmit,
  onCancel,
  voteDetails,
  bondDetail
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields }
  } = useForm<ICreatePollForm>({
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <div className={styles.group}>
        <TextArea
          size="block"
          textAlign="left"
          resize="none"
          placeholder="Sample text"
          className={cn(styles['text-area'])}
          label="Question or statement to vote on"
          {...register('question')}
        />
      </div>
      <Input
        size="block"
        isValid={touchedFields.externalUrl && !errors.externalUrl?.message}
        textAlign="left"
        {...register('externalUrl')}
        label="External URL"
        className={cn(styles.input, styles['external-url'])}
      />
      <div className={styles.vote}>
        <ExpandableDetails label="Vote details">
          <VoteDetails voteDetails={voteDetails} bondDetail={bondDetail} />
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
