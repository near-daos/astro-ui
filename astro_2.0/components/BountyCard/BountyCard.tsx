import React, { useCallback } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { Proposal } from 'types/proposal';
import { BountyStatus } from 'types/bounties';
import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';
import { DAO } from 'types/dao';

import { Icon } from 'components/Icon';
import { TokenWidget } from 'astro_2.0/components/TokenWidget';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { ProposalDescription } from 'astro_2.0/components/ProposalDescription';
import { CardFooter } from 'astro_2.0/components/BountyCard/components/CardFooter';
import { BountyActionsBar } from 'astro_2.0/components/BountyCard/components/BountyActionsBar';
import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import { gasValidation } from 'astro_2.0/features/CreateProposal/helpers';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { SputnikNearService } from 'services/sputnik';

import {
  DEFAULT_PROPOSAL_GAS,
  DEFAULT_VOTE_GAS,
} from 'services/sputnik/constants';

import styles from './BountyCard.module.scss';

const schema = yup.object().shape({
  gas: gasValidation,
});

export interface BountyCardProps {
  bountyId: string;
  deadlineThreshold: string;
  content: BountyCardContent;
  showActionBar: boolean;
  canClaim: boolean;
  dao: DAO;
  relatedProposal?: Proposal;
  completeHandler: () => void;
}

export const BountyCard: React.FC<BountyCardProps> = ({
  bountyId,
  deadlineThreshold,
  content,
  showActionBar,
  canClaim,
  dao,
  completeHandler,
  relatedProposal,
}) => {
  const {
    status,
    description,
    timeToComplete,
    forgivenessPeriod,
    externalUrl,
    token,
    amount,
    bountyBond,
    type,
  } = content;
  const router = useRouter();
  const { t } = useTranslation();
  const daoId = router.query.dao as string;
  const methods = useForm<DAOFormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      gas: DEFAULT_VOTE_GAS,
    },
    resolver: yupResolver(schema),
  });

  const onSuccessHandler = useCallback(async () => {
    await router.replace(router.asPath);
    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      lifetime: 20000,
      description: t('bountiesPage.successClaimBountyNotification'),
    });
  }, [t, router]);

  const handleClaim = useCallback(
    async data => {
      await SputnikNearService.claimBounty(daoId, {
        bountyId: Number(bountyId),
        deadline: deadlineThreshold,
        bountyBond: dao.policy.bountyBond,
        gas: data.gas,
      });

      onSuccessHandler();
    },
    [
      bountyId,
      dao.policy.bountyBond,
      daoId,
      deadlineThreshold,
      onSuccessHandler,
    ]
  );

  const handleUnclaim = useCallback(
    async data => {
      await SputnikNearService.unclaimBounty(daoId, bountyId, data.gas);
      onSuccessHandler();
    },
    [bountyId, daoId, onSuccessHandler]
  );

  const currentGasValue = methods.watch('gas').toString();

  function getInputWidth() {
    if (currentGasValue?.length > 6 && currentGasValue?.length <= 10) {
      return `${currentGasValue?.length}ch`;
    }

    if (currentGasValue?.length > 10) {
      return '10ch';
    }

    return '6ch';
  }

  function renderActionBar() {
    if (showActionBar) {
      if (status === BountyStatus.PendingApproval && relatedProposal) {
        const { id } = relatedProposal;

        return (
          <CardFooter>
            <div>
              <div className={styles.footerLabel}>Completion Proposal</div>
              <div>
                <Link
                  href={{
                    pathname: SINGLE_PROPOSAL_PAGE_URL,
                    query: {
                      dao: daoId,
                      proposal: id,
                    },
                  }}
                >
                  <a className={styles.proposalLink}>
                    <Icon name="buttonExternal" className={styles.icon} />
                    Link to Proposal
                  </a>
                </Link>
              </div>
            </div>
          </CardFooter>
        );
      }

      return (
        <BountyActionsBar
          canClaim={canClaim}
          bountyBond={bountyBond}
          forgivenessPeriod={forgivenessPeriod}
          bountyStatus={status}
          unclaimHandler={handleUnclaim}
          completeHandler={completeHandler}
        />
      );
    }

    return null;
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleClaim)}
        className={styles.root}
      >
        <div className={styles.bountyGrid}>
          <InfoBlockWidget
            label="Type"
            value={type}
            valueFontSize="L"
            className={styles.proposalType}
          />
          <div className={styles.completeDate}>
            {status === BountyStatus.Available
              ? `Complete in ${timeToComplete}`
              : `Due on ${timeToComplete}`}
          </div>
          <InfoBlockWidget
            label="Status"
            value={
              <div
                className={cn({
                  [styles.statusAvailable]: status === BountyStatus.Available,
                  [styles.statusInProgress]: status === BountyStatus.InProgress,
                  [styles.statusExpired]: status === BountyStatus.Expired,
                  [styles.pendingApproval]:
                    status === BountyStatus.PendingApproval,
                })}
              >
                {status}
              </div>
            }
            valueFontSize="L"
            className={styles.status}
          />
          <ProposalDescription
            description={description}
            link={externalUrl}
            className={styles.description}
          />
          <div className={styles.content}>
            {token ? (
              <InfoBlockWidget
                label="Amount"
                labelClassName={styles.infoLabel}
                value={
                  <TokenWidget
                    icon={token.icon}
                    noIcon
                    symbol={token.symbol}
                    amount={amount}
                    decimals={token.decimals}
                  />
                }
              />
            ) : (
              <div className={styles.loaderWrapper}>
                <LoadingIndicator />
              </div>
            )}

            <InputWrapper
              className={styles.detailsItem}
              labelClassName={styles.inputLabel}
              fieldName="gas"
              label="TGas"
            >
              <div className={styles.row}>
                <Input
                  className={cn(styles.inputWrapper, styles.detailsInput, {
                    [styles.error]: methods.formState.errors?.gas,
                  })}
                  inputStyles={{
                    width: getInputWidth(),
                  }}
                  onClick={e => e.stopPropagation()}
                  type="number"
                  min={0.1}
                  step={0.01}
                  max={0.3}
                  isBorderless
                  size="block"
                  placeholder={`${DEFAULT_PROPOSAL_GAS}`}
                  {...methods.register('gas')}
                />
              </div>
            </InputWrapper>

            {status === BountyStatus.InProgress ||
            status === BountyStatus.Expired ||
            status === BountyStatus.PendingApproval ? (
              <InfoBlockWidget
                labelClassName={styles.infoLabel}
                label="Claimed by"
                value={content.accountId}
              />
            ) : (
              <InfoBlockWidget
                label="Claims"
                labelClassName={styles.infoLabel}
                value={
                  <div>
                    <span>{content.slots}</span>
                    <span className={styles.slotsTotal}>
                      /{content.slotsTotal}
                    </span>
                  </div>
                }
              />
            )}
          </div>
        </div>
        {renderActionBar()}
      </form>
    </FormProvider>
  );
};
