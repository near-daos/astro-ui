import React, { FC } from 'react';
import cn from 'classnames';
import Decimal from 'decimal.js';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import { DAO } from 'types/dao';
import { YOKTO_NEAR } from 'services/sputnik/constants';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';

import styles from './ChangeBondsContent.module.scss';

interface ChangeBondsContentProps {
  dao: DAO;
}

export const ChangeBondsContent: FC<ChangeBondsContentProps> = ({ dao }) => {
  const { register } = useFormContext();

  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.title}>{t('proposalCard.proposals')}</div>
        <div className={styles.inline}>
          <InputWrapper
            fieldName="createProposalBond"
            label={t('proposalCard.proposalBonds')}
          >
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              type="number"
              placeholder={new Decimal(dao.policy.proposalBond)
                .div(YOKTO_NEAR)
                .toString()}
              min={0}
              isBorderless
              size="block"
              {...register('createProposalBond')}
            />
          </InputWrapper>
          <InputWrapper
            fieldName="proposalExpireTime"
            label={t('proposalCard.proposalBondExpirationTime')}
          >
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              type="number"
              min={1}
              placeholder={new Decimal(dao.policy.proposalPeriod)
                .div('3.6e12')
                .toString()}
              isBorderless
              size="block"
              {...register('proposalExpireTime')}
            />
          </InputWrapper>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>{t('proposalCard.proposalBounties')}</div>
        <div className={styles.inline}>
          <InputWrapper
            fieldName="claimBountyBond"
            label={t('proposalCard.proposalClaimBounty')}
          >
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              type="number"
              min={0}
              placeholder={new Decimal(dao.policy.bountyBond)
                .div(YOKTO_NEAR)
                .toString()}
              isBorderless
              size="block"
              {...register('claimBountyBond')}
            />
          </InputWrapper>

          <InputWrapper
            fieldName="unclaimBountyTime"
            label={t('proposalCard.proposalBountyUnclaimTime')}
          >
            <Input
              className={cn(styles.inputWrapper, styles.narrow)}
              type="number"
              min={1}
              placeholder={new Decimal(dao.policy.bountyForgivenessPeriod)
                .div('3.6e12')
                .toString()}
              isBorderless
              size="block"
              {...register('unclaimBountyTime')}
            />
          </InputWrapper>
        </div>
      </div>

      <div className={styles.row}>
        <InfoBlockWidget
          label={t('proposalCard.proposalTarget')}
          value={dao.id}
          valueFontSize="S"
        />
      </div>
    </div>
  );
};
