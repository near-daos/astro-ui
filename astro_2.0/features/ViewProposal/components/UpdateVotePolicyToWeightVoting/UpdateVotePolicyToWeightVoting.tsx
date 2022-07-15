import React, { FC } from 'react';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import { useAsync } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { CustomContract } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/types';
import { formatYoktoValue } from 'utils/format';
import { useWalletContext } from 'context/WalletContext';

import styles from './UpdateVotePolicyToWeightVoting.module.scss';

interface Props {
  balance: string;
  quorum: string;
  threshold: string;
  daoId: string;
}

export const UpdateVotePolicyToWeightVoting: FC<Props> = ({
  balance: rawBalance,
  quorum: rawQuorum,
  threshold: rawThreshold,
  daoId,
}) => {
  const { nearService } = useWalletContext();

  const { value: tokenDetails } = useAsync(async () => {
    if (!nearService) {
      return undefined;
    }

    const settings = await SputnikHttpService.getDaoSettings(daoId);

    const contractAddress = settings?.createGovernanceToken?.contractAddress;

    if (!contractAddress) {
      return undefined;
    }

    const contract = nearService.getContract(contractAddress, [
      'ft_metadata',
    ]) as CustomContract;

    const [meta] = await Promise.all([contract.ft_metadata()]);

    return {
      symbol: meta.symbol,
      decimals: meta.decimals,
      contractAddress,
    };
  }, [nearService, daoId]);

  const balance = formatYoktoValue(rawBalance, tokenDetails?.decimals);
  const threshold = formatYoktoValue(rawThreshold, tokenDetails?.decimals);
  const quorum = formatYoktoValue(rawQuorum, tokenDetails?.decimals);

  return (
    <div className={styles.root}>
      <FieldWrapper
        label="Minimum Balance - A user can vote if they have more than this number of
        tokens delegated to them."
        flex
      >
        <FieldValue
          value={
            <span>
              <span>{balance}</span>
              <span className={styles.suffix}>{tokenDetails?.symbol}</span>
            </span>
          }
        />
      </FieldWrapper>
      <FieldWrapper
        label="Threshold - Minimum votes to pass or reject a proposal. If Threshold is
        less than Quorum then more votes will be required even after the
        Threshold is met."
      >
        <FieldValue
          value={
            <span>
              <span>{threshold}</span>
              <span className={styles.suffix}>{tokenDetails?.symbol}</span>
            </span>
          }
        />
      </FieldWrapper>
      <FieldWrapper
        label="Quorum - Minimum tokens required to participate in the vote, regardless
        of if they vote for or against a proposal."
      >
        <FieldValue
          value={
            <span>
              <span>{quorum}</span>
              <span className={styles.suffix}>{tokenDetails?.symbol}</span>
            </span>
          }
        />
      </FieldWrapper>
    </div>
  );
};
