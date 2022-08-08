import React, { FC, useCallback } from 'react';
import omit from 'lodash/omit';
import { useRouter } from 'next/router';

import { useDaoCustomTokens } from 'context/DaoTokensContext';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';

import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

import styles from './DaoCreateProposal.module.scss';

interface Props {
  daoContext: DaoContext;
  defaultProposalType?: ProposalVariant;
  CreateProposal: React.ComponentType<CreateProposalProps>;
  toggleCreateProposal: (
    props?: Partial<CreateProposalProps> | undefined
  ) => void;
}

export const DaoCreateProposal: FC<Props> = ({
  daoContext,
  CreateProposal,
  toggleCreateProposal,
  defaultProposalType,
}) => {
  const router = useRouter();
  const { tokens } = useDaoCustomTokens();
  const { dao, userPermissions } = daoContext;

  const handleProposalDone = useCallback(async () => {
    toggleCreateProposal();

    await router.replace(
      {
        pathname: router.pathname,
        query: {
          ...omit(router.query, ['action', 'variant', 'params']),
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  }, [router, toggleCreateProposal]);

  return (
    <CreateProposal
      className={styles.createProposal}
      dao={dao}
      key={Object.keys(tokens).length}
      daoTokens={tokens}
      userPermissions={userPermissions}
      proposalVariant={defaultProposalType}
      showFlag={false}
      onCreate={handleProposalDone}
      onClose={handleProposalDone}
    />
  );
};
