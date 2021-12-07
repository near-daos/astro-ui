import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { WizardStepProps } from 'features/voting-token/components/voting-token-wizard/types';
import { useWizardContext } from 'features/voting-token/components/voting-token-wizard/helpers';
import { UploadAvatarInput } from 'features/voting-token/components/upload-avatar-input';
import { Button } from 'components/button/Button';
import { Input } from 'components/inputs/Input';

import styles from './create-voting-token-step.module.scss';

const schema = yup.object().shape({
  tokenName: yup.string().required(),
  tokenSymbol: yup.string().required(),
  totalTokenSupply: yup.number().positive().integer(),
  tokensTarget: yup.string().required(),
});

interface IForm {
  tokenName: string;
  tokenSymbol: string;
  totalTokenSupply: number;
  tokensTarget: string;
}

export const CreateVotingTokenStep: FC<WizardStepProps> = () => {
  const { handleNext, handleBack } = useWizardContext();
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IForm> = data => {
    handleNext({ ...data, tokenIcon: avatar });
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2>Create token for voting</h2>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.name}>
          <Input
            size="block"
            isValid={touchedFields.tokenName && !errors.tokenName?.message}
            textAlign="left"
            {...register('tokenName')}
            label="Token name"
          />
        </div>
        <div className={styles.symbol}>
          <div className={styles.row}>
            <span>
              <Input
                size="block"
                isValid={
                  touchedFields.tokenSymbol && !errors.tokenSymbol?.message
                }
                textAlign="left"
                {...register('tokenSymbol')}
                label="Token symbol"
              />
            </span>
            <span>.tkn.near</span>
          </div>
        </div>
        <div className={styles.total}>
          <Input
            size="block"
            isValid={
              touchedFields.totalTokenSupply &&
              !errors.totalTokenSupply?.message
            }
            textAlign="left"
            {...register('totalTokenSupply')}
            label="Total supply of token"
          />
        </div>

        <div className={styles.avatar}>
          <UploadAvatarInput
            onChange={val => {
              setAvatar(val);
            }}
            selected={avatar}
          />
        </div>

        <div className={styles.target}>
          <h3>Where should the total supply of new tokens be sent?</h3>
          <div className={styles.account}>
            <div className={styles.row}>
              <span>
                <Input
                  size="block"
                  isValid={
                    touchedFields.tokensTarget && !errors.tokensTarget?.message
                  }
                  textAlign="left"
                  {...register('tokensTarget')}
                  label="Account"
                />
              </span>
              <span>.sputnikdao.near</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            variant="secondary"
            onClick={handleBack}
            size="small"
            className={styles.mr8}
          >
            Back
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="primary"
            type="submit"
            size="small"
            className={styles.ml8}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};
