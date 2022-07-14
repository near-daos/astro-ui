import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation();
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
        label="Balance (minimum amount of tokens delegated to user to vote in DAO)"
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
        label={`${t(
          'threshold'
        )} (minimum amount of tokens needed to approve/reject proposal)`}
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
      <FieldWrapper label="Quorum (minimum amount of tokens required to approve/reject proposal)">
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
