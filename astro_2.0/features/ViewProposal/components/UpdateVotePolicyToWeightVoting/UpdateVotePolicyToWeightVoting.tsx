import React, { FC } from 'react';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import { useAsync } from 'react-use';
import { formatYoktoValue } from 'utils/format';
import { useWalletContext } from 'context/WalletContext';
import { useDaoSettingsData } from 'context/DaoSettingsContext';

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
  const { settings } = useDaoSettingsData(daoId);

  const { value: tokenDetails } = useAsync(async () => {
    if (!nearService) {
      return undefined;
    }

    const contractAddress = settings?.createGovernanceToken?.contractAddress;

    if (!contractAddress) {
      return undefined;
    }

    const meta = await nearService.getFtMetadata(contractAddress);

    return {
      symbol: meta.symbol,
      decimals: meta.decimals,
      contractAddress,
    };
  }, [nearService, daoId, settings]);

  const balance = formatYoktoValue(rawBalance, tokenDetails?.decimals);
  const threshold = formatYoktoValue(rawThreshold, tokenDetails?.decimals);
  const quorum = formatYoktoValue(rawQuorum, tokenDetails?.decimals);

  return (
    <div className={styles.root}>
      <FieldWrapper label="" flex>
        <FieldValue
          value={
            <span>
              <span>{balance}</span>
              <span className={styles.suffix}>
                {tokenDetails?.symbol} Minimum Balance
              </span>
            </span>
          }
        />
        <div className={styles.sub}>
          A DAO member can only cast a vote if they hold an amount of tokens
          equal or greater to the minimum balance.
        </div>
      </FieldWrapper>
      <FieldWrapper label="">
        <FieldValue
          value={
            <span>
              <span>{threshold}</span>
              <span className={styles.suffix}>
                {tokenDetails?.symbol} Threshold
              </span>
            </span>
          }
        />
        <div className={styles.sub}>
          When a vote is cast the total token weight in that direction compares
          against the threshold. If that token weight is greater than the
          threshold, the proposal finalizes with a pass or fail.{' '}
        </div>
      </FieldWrapper>
      <FieldWrapper
        hidden
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
