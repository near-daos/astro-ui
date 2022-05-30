import React, { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

import { UserPermissions } from 'types/context';
import { DAO } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { Button } from 'components/button/Button';

import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';
import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';
import { configService } from 'services/ConfigService';

import { useDaoSettings } from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning/hooks';

import {
  extractNewDaoName,
  isActiveUserCouncil,
} from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning/helpers';

import styles from './CloneDaoWarning.module.scss';

interface Props {
  dao: DAO;
  userPermissions: UserPermissions;
  className?: string;
  onCreateProposal: (
    initialVariant: ProposalVariant,
    initialValues: Record<string, unknown>,
    onCreateCb: (proposalId: number) => void
  ) => void;
}

const AnimatedContent: FC = ({ children }) => {
  return (
    <motion.div
      className={styles.notificationCardWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export const CloneDaoWarning: FC<Props> = ({
  dao,
  userPermissions,
  className,
  onCreateProposal,
}) => {
  const router = useRouter();
  const { daoVersion } = dao;
  const { accountId } = useWalletContext();
  const { nearConfig } = configService.get();
  const { settings, update, loading } = useDaoSettings(dao.id);
  const cloneState = settings ? settings.cloneState : null;
  const cloningProposalId = cloneState?.proposalId;

  const [daoName, setDaoName] = useState('');
  const [activeProposalLink, setActiveProposalLink] = useState('');
  const [isCloneCompleted, setIsCloneCompleted] = useState(false);
  const [isCloneFailed, setIsCloneFailed] = useState(false);

  const onCreate = useCallback(
    async proposalId => {
      await update({ cloneState: { proposalId } });
    },
    [update]
  );

  const onCreateTransfer = useCallback(
    async res => {
      if (res) {
        await update({ cloneState: { isFlowCompleted: true } });
      }
    },
    [update]
  );

  const isCouncil = isActiveUserCouncil(dao, accountId);
  const canActOnFlow = isCouncil && userPermissions.isCanCreateProposals;
  const isCloneAvailable =
    (daoVersion?.version[0] === 2 || !daoVersion) &&
    canActOnFlow &&
    !cloneState &&
    !loading;
  const isCloneInProgress = !!activeProposalLink;
  const isFlowCompleted = cloneState?.isFlowCompleted;

  useEffect(() => {
    (async () => {
      if (cloningProposalId) {
        const proposalId = `${dao.id}-${cloningProposalId}`;
        const res = await SputnikHttpService.getProposalById(
          proposalId,
          accountId
        );

        const url = SINGLE_PROPOSAL_PAGE_URL.replace('[dao]', dao.id).replace(
          '[proposal]',
          proposalId
        );

        switch (res?.status) {
          case 'InProgress': {
            setActiveProposalLink(url);

            break;
          }
          case 'Approved': {
            const newDaoName = extractNewDaoName(res);

            setDaoName(newDaoName);
            setIsCloneCompleted(true);

            break;
          }
          case 'Rejected':
          case 'Expired':
          case 'Moved':
          case 'Removed': {
            setIsCloneFailed(true);

            break;
          }
          default: {
            break;
          }
        }
      }
    })();
  }, [accountId, cloningProposalId, dao.id]);

  function renderResetFlowButton() {
    if (canActOnFlow) {
      return (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          onClick={() => update({ cloneState: null })}
          className={styles.resetFlowBtn}
        />
      );
    }

    return null;
  }

  function renderContent() {
    if (isFlowCompleted && canActOnFlow) {
      return null;
    }

    if (isCloneAvailable) {
      return (
        <AnimatedContent>
          <DaoWarning
            rootClassName={styles.infoRoot}
            statusClassName={styles.infoStatus}
            iconClassName={styles.infoIcon}
            icon="proposalSendFunds"
            content={
              <>
                <div className={styles.title}>Let&apos;s migrate your DAO</div>
                <div className={styles.text}>[PLACEHOLDER] - description!</div>
              </>
            }
            control={
              <Button
                className={styles.upgradeDaoButton}
                variant="primary"
                onClick={() =>
                  onCreateProposal(
                    ProposalVariant.ProposeCreateDao,
                    {
                      displayName: `${dao.displayName}-v3`,
                    },
                    onCreate
                  )
                }
              >
                Migrate DAO
              </Button>
            }
            className={className}
          />
        </AnimatedContent>
      );
    }

    if (isCloneInProgress) {
      return (
        <AnimatedContent>
          <DaoWarning
            rootClassName={styles.progressRoot}
            statusClassName={styles.progressStatus}
            iconClassName={styles.progressIcon}
            icon="proposalSendFunds"
            content={
              <>
                <div className={styles.title}>
                  DAO is the process of migration. View proposal and vote to
                  make a decision
                </div>
                <div className={styles.text}>[PLACEHOLDER] - description!.</div>
              </>
            }
            control={
              <Button
                className={styles.upgradeDaoButton}
                variant="primary"
                onClick={() => router.push(activeProposalLink)}
              >
                View proposal
              </Button>
            }
            className={className}
          />
        </AnimatedContent>
      );
    }

    if (isCloneCompleted && canActOnFlow) {
      return (
        <AnimatedContent>
          <DaoWarning
            rootClassName={styles.successRoot}
            statusClassName={styles.successStatus}
            iconClassName={styles.successIcon}
            icon="proposalSendFunds"
            content={
              <>
                <div className={styles.title}>
                  Proposal migrate DAO was successfully approved
                </div>
                <div className={styles.text}>
                  [PLACEHOLDER] - description! Now you can create proposals to
                  transfer your DAO&apos;s funds
                </div>
              </>
            }
            control={
              <Button
                className={styles.upgradeDaoButton}
                variant="primary"
                onClick={() => {
                  onCreateProposal(
                    ProposalVariant.ProposeTransferFunds,
                    {
                      target: `${daoName}.${nearConfig.contractName}`,
                      // tokens:
                    },
                    onCreateTransfer
                  );
                }}
              >
                Transfer funds
              </Button>
            }
            className={className}
          />
        </AnimatedContent>
      );
    }

    if (isCloneFailed && canActOnFlow) {
      return (
        <AnimatedContent>
          <DaoWarning
            rootClassName={styles.failRoot}
            statusClassName={styles.failStatus}
            iconClassName={styles.failIcon}
            icon="proposalSendFunds"
            content={
              <>
                <div className={styles.title}>
                  Proposal migrate DAO was rejected
                </div>
                <div className={styles.text}>
                  [PLACEHOLDER] - description! Would you like to try again?
                </div>
              </>
            }
            control={
              <>
                <Button
                  className={styles.upgradeDaoButton}
                  variant="primary"
                  onClick={() => {
                    onCreateProposal(
                      ProposalVariant.ProposeCreateDao,
                      {
                        displayName: `${dao.displayName}-v3`,
                      },
                      onCreate
                    );
                  }}
                >
                  Try migrate again
                </Button>
              </>
            }
            className={className}
          />
        </AnimatedContent>
      );
    }

    return null;
  }

  return (
    <>
      {renderResetFlowButton()}
      <AnimatePresence>{renderContent()}</AnimatePresence>
    </>
  );
};
