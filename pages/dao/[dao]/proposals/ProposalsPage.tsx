import React, { VFC } from 'react';

import {
  ALL_DAOS_URL,
  ALL_PROPOSALS_PAGE_URL,
  SINGLE_DAO_PAGE,
} from 'constants/routing';

import { Proposal } from 'types/proposal';
import { DaoContext } from 'types/context';
import { PaginationResponse } from 'types/api';

import { Feed } from 'astro_2.0/features/Feed';
import { NavLink } from 'astro_2.0/components/NavLink';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';

import styles from './ProposalsPage.module.scss';

interface ProposalsPageProps {
  daoContext: DaoContext;
  initialProposalsData: PaginationResponse<Proposal[]>;
}

const ProposalsPage: VFC<ProposalsPageProps> = props => {
  const {
    daoContext: { dao },
    initialProposalsData,
  } = props;

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href={ALL_DAOS_URL}>All DAOs</NavLink>
        <NavLink
          href={{
            pathname: SINGLE_DAO_PAGE,
            query: {
              dao: dao.id,
            },
          }}
        >
          {dao?.displayName || dao?.id}
        </NavLink>
        <NavLink
          href={{
            pathname: ALL_PROPOSALS_PAGE_URL,
            query: {
              dao: dao.id,
            },
          }}
        >
          Proposals
        </NavLink>
      </BreadCrumbs>

      <DaoDetailsMinimized dao={dao} className={styles.dao} />

      <Feed
        dao={dao}
        key={dao.id}
        showFlag={false}
        title="Proposals"
        initialProposals={initialProposalsData}
      />
    </div>
  );
};

export default ProposalsPage;
