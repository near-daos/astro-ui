// TODO verify component is used after "Create Token" flow is implemented

import React, { FC } from 'react';
import { DaoContext } from 'types/context';
import { useTranslation } from 'next-i18next';

import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/steps/CreateToken/CreateToken.module.scss';
import { CreationProgress } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/steps/CreateToken/components/CreationProgress';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { WarningPanel } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/WarningPanel';

import { ProposalVariant } from 'types/proposal';

import { CREATE_GOV_TOKEN_PAGE_URL } from 'constants/routing';
import { STEPS } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/constants';

interface ChangeVotingPolicyProps {
  daoContext: DaoContext;
}

export const ChangeVotingPolicy: FC<ChangeVotingPolicyProps> = ({
  daoContext,
}) => {
  const { dao, userPermissions } = daoContext;

  const translationBase = 'createGovernanceTokenPage.createToken';
  const { t } = useTranslation();

  const steps = [
    {
      label: t(`${translationBase}.progress.createToken`),
      isComplete: true,
    },
    {
      label: t(`${translationBase}.progress.contractAcceptance`),
      isComplete: true,
    },
    {
      label: t(`${translationBase}.progress.tokenDistribution`),
      isComplete: true,
    },
    {
      label: t(`${translationBase}.progress.changeDaoPolicy`),
      isCurrent: true,
    },
  ];

  return (
    <div className={styles.root}>
      <div>
        <CreationProgress steps={steps} className={styles.progress} />
        <WarningPanel className={styles.warning} />
      </div>
      <div className={styles.createProposal}>
        <CreateProposal
          dao={dao}
          key={0}
          daoTokens={{}}
          userPermissions={userPermissions}
          proposalVariant={ProposalVariant.ProposeChangeVotingPolicy}
          showFlag={false}
          onClose={() => undefined}
          showClose={false}
          showInfo={false}
          canCreateTokenProposal
        />
        <div className={styles.nextStepContainer}>
          <Button
            capitalize
            variant="secondary"
            className={styles.nextStepButton}
            href={{
              pathname: CREATE_GOV_TOKEN_PAGE_URL,
              query: {
                dao: dao.id,
                step: STEPS.CHANGE_VOTING_POLICY,
              },
            }}
          >
            {t('createGovernanceTokenPage.selectToken.nextStep')}
            <Icon className={styles.buttonIcon} name="buttonArrowRight" />
          </Button>
        </div>
      </div>
    </div>
  );
};
