import React, { FC } from 'react';
import cn from 'classnames';
import Decimal from 'decimal.js';
import { useFormContext } from 'react-hook-form';

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

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.title}>Proposals</div>
        <div className={styles.inline}>
          <InputWrapper
            fieldName="createProposalBond"
            label="Bonds to create proposals"
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
            label="Time before proposals expire"
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
        <div className={styles.title}>Bounties</div>
        <div className={styles.inline}>
          <InputWrapper
            fieldName="claimBountyBond"
            label="Bonds to claim bounty"
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
            label="Time to unclaim a bounty without penalty"
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
        <InfoBlockWidget label="Target" value={dao.id} valueFontSize="S" />
      </div>
    </div>
  );
};
