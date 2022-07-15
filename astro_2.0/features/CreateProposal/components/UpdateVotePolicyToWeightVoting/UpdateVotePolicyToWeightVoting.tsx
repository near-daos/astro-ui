import React, { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAsync } from 'react-use';
import cn from 'classnames';

import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';
import { CustomContract } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/types';
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

    const contract = nearService.getContract(contractAddress, [
      'ft_balance_of',
      'ft_metadata',
    ]) as CustomContract;

    const meta = await contract.ft_metadata();

    setValue('decimals', meta.decimals);
    setValue('symbol', meta.symbol);

    return {
      symbol: meta.symbol,
      decimals: meta.decimals,
    };
  }, [nearService, accountId, contractAddress]);

  return (
    <div className={styles.root}>
      <div className={styles.blockExplanation}>
        Minimum Balance - A user can vote if they have more than this number of
        tokens delegated to them.
      </div>
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
      <br />
      <div className={styles.blockExplanation}>
        Threshold - Minimum votes to pass or reject a proposal. If Threshold is
        less than Quorum then more votes will be required even after the
        Threshold is met.
      </div>
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
      <br />
      <div className={styles.blockExplanation}>
        Quorum - Minimum tokens required to participate in the vote, regardless
        of if they vote for or against a proposal.
      </div>
      <div className={styles.row}>
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
    </div>
  );
};
