import React, { FC } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';

import { Input } from 'components/inputs/input/Input';
import { Button } from 'components/button/Button';
import { TextArea } from 'components/inputs/textarea/TextArea';
import { InputFormWrapper } from 'components/inputs/input-form-wrapper/InputFormWrapper';

import { VoteDetails } from 'components/vote-details';

import styles from './create-poll-form.module.scss';

type CreatePollInput = {
  question: string;
  externalUrl: string;
};

interface CreatePollFormProps {
  onSubmit: (data: CreatePollInput) => void;
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
  onCancel
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
        <InputFormWrapper
          errors={errors}
          className={styles.token}
          component={
            <TextArea
              isValid={touchedFields.question && !errors.question?.message}
              size="block"
              textAlign="left"
              resize="none"
              placeholder="Sample text"
              className={styles.textArea}
              label="Question or statement to vote on"
              {...register('question')}
            />
          }
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
          <VoteDetails scope="vote" />
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
