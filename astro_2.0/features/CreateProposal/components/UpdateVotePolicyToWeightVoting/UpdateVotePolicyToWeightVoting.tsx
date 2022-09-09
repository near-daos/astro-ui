// TODO requires localisation

import React, { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAsync } from 'react-use';
import cn from 'classnames';

import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';
import { useWalletContext } from 'context/WalletContext';

import styles from './UpdateVotePolicyToWeightVoting.module.scss';

export const UpdateVotePolicyToWeightVoting: VFC = () => {
  const { register, watch, setValue } = useFormContext();
  const { nearService, accountId } = useWalletContext();

  const balance = watch('balance');
  const quorum = watch('quorum');
  const threshold = watch('threshold');
  const contractAddress = watch('contractAddress');

  const { value: tokenDetails } = useAsync(async () => {
    if (!nearService) {
      return undefined;
    }

    try {
      const meta = await nearService.getFtMetadata(contractAddress);

      setValue('decimals', meta.decimals);
      setValue('symbol', meta.symbol);

      return {
        symbol: meta.symbol,
        decimals: meta.decimals,
      };
    } catch (e) {
      return undefined;
    }
  }, [nearService, accountId, contractAddress]);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper
          fieldName="balance"
          label="Minimum Balance"
          className={cn(styles.detailsItem)}
          labelClassName={cn(styles.inputLabel)}
        >
          <div className={styles.input}>
            <Input
              className={cn(styles.inputWrapper, styles.detailsInput)}
              placeholder="1"
              type="number"
              min={1}
              step={1}
              isBorderless
              size="auto"
              inputStyles={{
                padding: '10.5px 0',
                width: getInputWidth(balance, 30, 12),
              }}
              {...register('balance')}
            />
          </div>
        </InputWrapper>
        <span className={styles.suffix}>{tokenDetails?.symbol}</span>
      </div>
      <div className={styles.blockExplanation}>
        Minimum Balance - A user can vote if they have more than this number of
        tokens delegated to them.
      </div>
      <br />
      <div className={styles.row}>
        <InputWrapper
          fieldName="threshold"
          label="Threshold"
          className={cn(styles.detailsItem)}
          labelClassName={cn(styles.inputLabel)}
        >
          <div className={styles.input}>
            <Input
              className={cn(styles.inputWrapper, styles.detailsInput)}
              placeholder="0"
              isBorderless
              type="number"
              min={1}
              step={1}
              size="auto"
              inputStyles={{
                padding: '10.5px 0',
                width: getInputWidth(threshold, 30, 12),
              }}
              {...register('threshold')}
            />
          </div>
        </InputWrapper>
        <span className={styles.suffix}>{tokenDetails?.symbol}</span>
      </div>
      <div className={styles.blockExplanation}>
        Threshold - Minimum votes to pass or reject a proposal.
      </div>
      <br />
      <div className={cn(styles.row, styles.hidden)}>
        <InputWrapper
          fieldName="quorum"
          label="Quorum"
          className={cn(styles.detailsItem)}
          labelClassName={cn(styles.inputLabel)}
        >
          <div className={styles.input}>
            <Input
              className={cn(styles.inputWrapper, styles.detailsInput)}
              placeholder="0"
              type="number"
              min={0}
              step={1}
              isBorderless
              size="auto"
              inputStyles={{
                padding: '10.5px 0',
                width: getInputWidth(quorum, 30, 12),
              }}
              {...register('quorum')}
            />
          </div>
        </InputWrapper>
        <span className={styles.suffix}>{tokenDetails?.symbol}</span>
      </div>
      <div className={cn(styles.blockExplanation, styles.hidden)}>
        Quorum - Minimum tokens required to participate in the vote, regardless
        of if they vote for or against a proposal.
      </div>
    </div>
  );
};
