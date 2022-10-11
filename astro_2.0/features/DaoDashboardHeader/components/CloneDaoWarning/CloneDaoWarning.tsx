import React, { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import cn from 'classnames';

import { DAO } from 'types/dao';
import { ProposalFeedItem, ProposalVariant } from 'types/proposal';
import { WarningRenderer } from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning/components/WarningRenderer';
import { Button } from 'components/button/Button';

import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';
import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';
import { configService } from 'services/ConfigService';
import { useDaoSettings } from 'context/DaoSettingsContext';

import {
  extractNewDaoName,
  hasAvailableFunds,
  isActiveUserCouncil,
} from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning/helpers';

import { useDaoCustomTokens } from 'context/DaoTokensContext';

import styles from './CloneDaoWarning.module.scss';

interface Props {
  dao: DAO;
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
  className,
  onCreateProposal,
}) => {
  const router = useRouter();
  const { daoVersion } = dao;
  const { accountId } = useWalletContext();
  const { tokens } = useDaoCustomTokens();
  const { nearConfig } = configService.get();
  const { settings, update, loading } = useDaoSettings();
  const cloneState = settings ? settings.cloneState : null;
  const cloningProposalId = cloneState?.proposalId;

  const [daoName, setDaoName] = useState('');
  const [activeProposalLink, setActiveProposalLink] = useState('');
  const [transferProposals, setTransferProposals] = useState<
    ProposalFeedItem[]
  >([]);
  const [isCloneCompleted, setIsCloneCompleted] = useState(false);
  const [isCloneFailed, setIsCloneFailed] = useState(false);

  const onCreate = useCallback(
    async proposalId => {
      await update({ cloneState: { proposalId } });
    },
    [update]
  );

  const onDismiss = useCallback(async () => {
    await update({
      cloneState: { isFlowCompleted: true },
    });
  }, [update]);

  const onCreateTransfer = useCallback(
    async res => {
      const target = `${daoName}.${nearConfig.contractName}`;

      if (res && cloneState) {
        await update({
          cloneState: { ...cloneState, target, transferDone: true },
        });
      }
    },
    [cloneState, daoName, nearConfig.contractName, update]
  );

  const canActOnFlow = isActiveUserCouncil(dao, accountId);

  const isCloneAvailable =
    (daoVersion?.version[0] === 2 || !daoVersion) &&
    canActOnFlow &&
    !cloneState &&
    !loading;
  const isCloneInProgress = !!activeProposalLink;
  const isFlowCompleted = cloneState?.isFlowCompleted;
  const isTransferDone = cloneState?.transferDone && !hasAvailableFunds(tokens);

  useEffect(() => {
    (async () => {
      if (cloningProposalId || cloningProposalId === 0) {
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

  useEffect(() => {
    (async () => {
      if (cloneState?.transferDone && cloneState?.target) {
        const res = await SputnikHttpService.findTransferProposals(
          dao,
          cloneState.target
        );

        if (res?.data) {
          setTransferProposals(res?.data);
        }
      }
    })();
  }, [cloneState, dao]);

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
    if (isFlowCompleted) {
      return null;
    }

    if (cloneState?.transferDone && transferProposals.length) {
      return (
        <AnimatedContent>
          <WarningRenderer
            onDismiss={onDismiss}
            variant="progress"
            title="Transfer assets still requires votes"
            daoId={dao.id}
          >
            <div className={cn(styles.text, styles.list)}>
              {transferProposals.slice(0, 5).map(proposal => {
                return (
                  <Link
                    key={proposal.id}
                    href={`/dao/${dao.id}/proposals/${proposal.id}`}
                  >
                    <a className={styles.linkProposal}>{proposal.id}</a>
                  </Link>
                );
              })}
              {transferProposals.length > 5 ? (
                <Link href={`/dao/${dao.id}/proposals/`}>
                  <a className={styles.linkButton}>Show all</a>
                </Link>
              ) : null}
            </div>
          </WarningRenderer>
        </AnimatedContent>
      );
    }

    if (isCloneAvailable) {
      return (
        <AnimatedContent>
          <WarningRenderer
            onDismiss={onDismiss}
            className={className}
            variant="info"
            title="Migrate your DAO from V2 to V3"
            daoId={dao.id}
            control={
              <Button
                size="small"
                className={styles.upgradeDaoButton}
                variant="primary"
                onClick={() =>
                  onCreateProposal(
                    ProposalVariant.ProposeCreateDao,
                    {
                      displayName: `${dao.displayName}-plus`,
                    },
                    onCreate
                  )
                }
              >
                Migrate DAO
              </Button>
            }
          >
            <div className={styles.text}>
              Be ready for future fixes and upgrades by migrating your
              configuration and assets to V3.
            </div>
          </WarningRenderer>
        </AnimatedContent>
      );
    }

    if (isCloneInProgress) {
      return (
        <AnimatedContent>
          <WarningRenderer
            onDismiss={onDismiss}
            className={className}
            variant="progress"
            title="DAO migration to V3 still requires votes"
            daoId={dao.id}
            control={
              <Button
                size="small"
                className={styles.upgradeDaoButton}
                variant="primary"
                onClick={() => router.push(activeProposalLink)}
              >
                View proposal
              </Button>
            }
          >
            <div className={styles.text}>
              Complete the migration by gathering votes from your council
              members.
            </div>
          </WarningRenderer>
        </AnimatedContent>
      );
    }

    if (isCloneCompleted && canActOnFlow && !isTransferDone) {
      return (
        <AnimatedContent>
          <WarningRenderer
            onDismiss={onDismiss}
            className={className}
            variant="success"
            title="Your new DAO has been created, config and assets have been migrated to V3"
            daoId={dao.id}
            control={
              <Button
                size="small"
                className={styles.upgradeDaoButton}
                variant="primary"
                onClick={async () => {
                  const target = `${daoName}.${nearConfig.contractName}`;

                  await update({
                    cloneState: { proposalId: cloningProposalId, target },
                  });

                  onCreateProposal(
                    ProposalVariant.ProposeTransferFunds,
                    {
                      target,
                      // tokens:
                    },
                    onCreateTransfer
                  );
                }}
              >
                Transfer Assets
              </Button>
            }
          >
            <div className={styles.text}>
              The next step is to transfer your assets from this DAO to your V3
              DAO.
            </div>
          </WarningRenderer>
        </AnimatedContent>
      );
    }

    if (isCloneFailed && canActOnFlow) {
      return (
        <AnimatedContent>
          <WarningRenderer
            onDismiss={onDismiss}
            className={className}
            variant="fail"
            title="Your DAO migration proposal was rejected"
            daoId={dao.id}
            control={
              <>
                <Button
                  size="small"
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
          >
            <div className={styles.text}>
              Continue using your V2 DAO or restart the V3 migration process
              after discussing with your council members.
            </div>
          </WarningRenderer>
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
