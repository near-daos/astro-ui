import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/inputs/input/Input';
import { ProposalBanner } from 'features/dao-settings/components/proposal-banner';
import {
  navigateToDaoPage,
  BondsAndDeadlinesData,
  getChangeBondDeadlinesProposal
} from 'features/dao-settings/helpers';
import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useToggle } from 'react-use';
import { SputnikNearService } from 'services/sputnik';
import * as yup from 'yup';
import { EditButton } from 'features/dao-settings/components/edit-button/EditButton';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import cn from 'classnames';

import styles from './bonds-and-deadlines-tab.module.scss';

export interface BondsAndDeadlinesTabProps {
  accountName: string;
  createProposalBond: number;
  proposalExpireTime: number;
  claimBountyBond: number;
  unclaimBountyTime: number;
  proposalBond: string;
}

export const schema = yup.object().shape({
  createProposalBond: yup.number().min(0).required(),
  proposalExpireTime: yup.number().integer().min(1).required(),
  claimBountyBond: yup.number().min(0).required(),
  unclaimBountyTime: yup.number().integer().min(1).required()
});

export const BondsAndDeadlines: FC<BondsAndDeadlinesTabProps> = props => {
  const {
    createProposalBond,
    proposalExpireTime,
    claimBountyBond,
    unclaimBountyTime,
    proposalBond
  } = props;

  const [viewMode, setViewMode] = useToggle(true);

  const router = useRouter();
  const daoId = router.query.dao as string;
  const dao = useDao(daoId);

  const methods = useForm<BondsAndDeadlinesData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      createProposalBond,
      proposalExpireTime,
      claimBountyBond,
      unclaimBountyTime
    },
    resolver: yupResolver(schema)
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, touchedFields, isDirty, isValid }
  } = methods;

  const onCancel = useCallback(() => {
    setViewMode(true);
    reset({
      createProposalBond,
      proposalExpireTime,
      claimBountyBond,
      unclaimBountyTime
    });
  }, [
    claimBountyBond,
    createProposalBond,
    proposalExpireTime,
    reset,
    setViewMode,
    unclaimBountyTime
  ]);

  const onSubmit = useCallback(
    async (data: BondsAndDeadlinesData) => {
      if (dao != null) {
        const proposal = getChangeBondDeadlinesProposal(
          dao,
          data,
          props,
          proposalBond
        );

        await SputnikNearService.createProposal(proposal);

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
          lifetime: 20000
        });
        setViewMode(true);

        navigateToDaoPage(router);
      }
    },
    [dao, proposalBond, setViewMode, props, router]
  );

  return (
    <>
      <FormProvider {...methods}>
        {!viewMode && (
          <ProposalBanner
            scope="policy"
            title="Bonds & Deadlines"
            form="bonds-deadlines"
            disable={!isValid || !isDirty}
            onEdit={setViewMode}
            viewMode={viewMode}
            onCancel={onCancel}
          />
        )}
      </FormProvider>
      <form
        id="bonds-deadlines"
        onSubmit={handleSubmit(onSubmit)}
        className={styles.root}
      >
        <div className={styles.subtitle}>
          Proposals
          {viewMode && <EditButton onClick={setViewMode} />}
        </div>
        <div
          className={cn(styles.row, {
            [styles.viewMode]: viewMode
          })}
        >
          <div>
            <div className={styles.label}>Bond to create proposal</div>
            <>
              {viewMode ? (
                <span className={styles.title}>{createProposalBond}</span>
              ) : (
                <Input
                  {...register('createProposalBond', {
                    valueAsNumber: true,
                    required: true
                  })}
                  isValid={
                    touchedFields.createProposalBond &&
                    !errors.createProposalBond?.message
                  }
                  className={styles.input}
                  size="small"
                  textAlign="left"
                />
              )}
              <span className={styles.ml8}>NEAR</span>
            </>
          </div>
          <div>
            <div className={styles.label}>Time before proposal expire</div>
            <>
              {viewMode ? (
                <span>{proposalExpireTime}</span>
              ) : (
                <Input
                  {...register('proposalExpireTime', {
                    valueAsNumber: true,
                    required: true
                  })}
                  isValid={
                    touchedFields.proposalExpireTime &&
                    !errors.proposalExpireTime?.message
                  }
                  className={styles.input}
                  size="small"
                  textAlign="left"
                />
              )}
              <span className={styles.ml8}>hours</span>
            </>
          </div>
        </div>
        <div className={styles.subtitle}>Bounties</div>
        <div
          className={cn(styles.row, {
            [styles.viewMode]: viewMode
          })}
        >
          <div>
            <div className={styles.label}>Bond to claim a bounty</div>
            <>
              {viewMode ? (
                <span className={styles.title}>{claimBountyBond}</span>
              ) : (
                <Input
                  {...register('claimBountyBond', {
                    valueAsNumber: true,
                    required: true
                  })}
                  isValid={
                    touchedFields.claimBountyBond &&
                    !errors.claimBountyBond?.message
                  }
                  className={styles.input}
                  size="small"
                  textAlign="left"
                />
              )}
              <span className={styles.ml8}>NEAR</span>
            </>
          </div>
          <div>
            <div className={styles.label}>
              Time to unclaim a bounty without penalty
            </div>
            <>
              {viewMode ? (
                <span>{unclaimBountyTime}</span>
              ) : (
                <Input
                  {...register('unclaimBountyTime', {
                    valueAsNumber: true,
                    required: true
                  })}
                  isValid={
                    touchedFields.unclaimBountyTime &&
                    !errors.unclaimBountyTime?.message
                  }
                  className={styles.input}
                  size="small"
                  textAlign="left"
                />
              )}
              <span className={styles.ml8}>hours</span>
            </>
          </div>
        </div>
      </form>
    </>
  );
};
