import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useState } from 'react';

import { DaoDetails } from 'astro_2.0/components/DaoDetails';
import { Button } from 'components/button/Button';

import { CREATE_DAO_URL } from 'constants/routing';

import { useAuthContext } from 'context/AuthContext';

import { NoResultsView } from 'features/no-results-view';

import { CreateProposal } from 'astro_2.0/features/CreateProposal';

import { ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';

import { useNearPrice } from 'hooks/useNearPrice';

import styles from './MyDaosPage.module.scss';

interface MyDaosPageProps {
  accountDaos: DAO[];
}

const MyDaosPage: FC<MyDaosPageProps> = ({ accountDaos }) => {
  const router = useRouter();
  const { accountId, login } = useAuthContext();
  const nearPrice = useNearPrice();

  const [createProposalForDao, setCreateProposalForDao] = useState<DAO | null>(
    null
  );

  const handleCreateProposal = useCallback(
    id => (accountId ? setCreateProposalForDao(id) : login()),
    [accountId, login]
  );

  function renderDaos() {
    if (isEmpty(accountDaos)) {
      return (
        <NoResultsView
          title={
            <span>
              You have no DAOs, but you can{' '}
              <Link passHref href={CREATE_DAO_URL}>
                <span className={styles.createDaoLink}>create</span>
              </Link>{' '}
              one
            </span>
          }
        />
      );
    }

    const daoEls = accountDaos.map(dao => {
      const { id, activeProposalsCount, totalProposalsCount } = dao;

      return (
        <DaoDetails
          nearPrice={nearPrice}
          key={id}
          dao={dao}
          accountId={accountId}
          onCreateProposalClick={handleCreateProposal}
          activeProposals={activeProposalsCount}
          totalProposals={totalProposalsCount}
        />
      );
    });

    return <>{daoEls}</>;
  }

  const handleCreateDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login()),
    [login, router, accountId]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>MY DAOs</h1>
        <Button variant="black" size="small" onClick={handleCreateDao}>
          Create new DAO
        </Button>
      </div>
      <div className={styles.content}>
        {createProposalForDao && (
          <CreateProposal
            key={createProposalForDao?.id}
            dao={createProposalForDao}
            proposalVariant={ProposalVariant.ProposeTransfer}
            onCreate={isSuccess => {
              if (isSuccess) {
                setCreateProposalForDao(null);
              }
            }}
            onClose={() => {
              setCreateProposalForDao(null);
            }}
          />
        )}
        {renderDaos()}
      </div>
    </div>
  );
};

export default MyDaosPage;
