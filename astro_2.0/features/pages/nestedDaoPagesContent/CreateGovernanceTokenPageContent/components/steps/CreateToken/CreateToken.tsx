// TODO verify component is used after "Create Token" flow is implemented

import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';

import { CREATE_GOV_TOKEN_PAGE_URL } from 'constants/routing';
import { STEPS } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/constants';

import { CreateProposal } from 'astro_2.0/features/CreateProposal';

import { WarningPanel } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/WarningPanel';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { CreationProgress } from './components/CreationProgress';

import styles from './CreateToken.module.scss';

interface CreateTokenProps {
  daoContext: DaoContext;
}

export const CreateToken: VFC<CreateTokenProps> = ({ daoContext }) => {
  const { dao, userPermissions } = daoContext;

  const translationBase = 'createGovernanceTokenPage.createToken';
  const { t } = useTranslation();

  const steps = [
    {
      label: t(`${translationBase}.progress.createToken`),
      isCurrent: true,
    },
    {
      label: t(`${translationBase}.progress.contractAcceptance`),
    },
    {
      label: t(`${translationBase}.progress.tokenDistribution`),
    },
    {
      label: t(`${translationBase}.progress.changeDaoPolicy`),
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
          proposalVariant={ProposalVariant.ProposeCreateToken}
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
                step: STEPS.CONTRACT_ACCEPTANCE,
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
