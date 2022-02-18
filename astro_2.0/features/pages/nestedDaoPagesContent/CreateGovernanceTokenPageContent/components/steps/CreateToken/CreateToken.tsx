import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';

import { CreateProposal } from 'astro_2.0/features/CreateProposal';

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
      <CreationProgress steps={steps} className={styles.progress} />
      <CreateProposal
        className={styles.createProposal}
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
    </div>
  );
};
