import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import { useAsync } from 'react-use';

import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';
import { CustomContract } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/types';
import { useWalletContext } from 'context/WalletContext';

import styles from './UpdateVotePolicyToWeightVoting.module.scss';

export const UpdateVotePolicyToWeightVoting: VFC = () => {
  const { t } = useTranslation();
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
      <InputWrapper
        fieldName="balance"
        label="Balance (minimum amount of tokens delegated to user to vote in DAO)"
        flex
        className={styles.inputWrapper}
      >
        <div className={styles.input}>
          <Input
            placeholder="1"
            isBorderless
            size="auto"
            inputStyles={{
              padding: '10.5px 0',
              width: getInputWidth(balance, 30, 6),
            }}
            {...register('balance')}
          />
          <span className={styles.suffix}>{tokenDetails?.symbol}</span>
        </div>
      </InputWrapper>

      <InputWrapper
        fieldName="threshold"
        label={`${t(
          'threshold'
        )} (minimum amount of tokens needed to approve/reject proposal)`}
        flex
        className={styles.inputWrapper}
      >
        <div className={styles.input}>
          <Input
            placeholder="0000"
            isBorderless
            size="auto"
            inputStyles={{
              padding: '10.5px 0',
              width: getInputWidth(threshold, 30, 6),
            }}
            {...register('threshold')}
          />
          <span className={styles.suffix}>{tokenDetails?.symbol}</span>
        </div>
      </InputWrapper>

      <InputWrapper
        fieldName="quorum"
        label="Quorum (minimum amount of tokens required to approve/reject proposal)"
        flex
        className={styles.inputWrapper}
      >
        <div className={styles.input}>
          <Input
            placeholder="0"
            isBorderless
            size="auto"
            inputStyles={{
              padding: '10.5px 0',
              width: getInputWidth(quorum, 30, 6),
            }}
            {...register('quorum')}
          />
          <span className={styles.suffix}>{tokenDetails?.symbol}</span>
        </div>
      </InputWrapper>
    </div>
  );
};
