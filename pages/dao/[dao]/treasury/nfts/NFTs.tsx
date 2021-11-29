import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { NFTCard } from 'features/nft/ntf-card/NFTCard';

import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { NavLink } from 'astro_2.0/components/NavLink';

import { ProposalVariant } from 'types/proposal';
import { NftToken } from 'types/token';

import { DaoContext } from 'types/context';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { NoResultsView } from 'features/no-results-view';

import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

import styles from './nfts.module.scss';

export interface NFTsPageProps {
  nfts: NftToken[];
  daoContext: DaoContext;
}

const NFTs: NextPage<NFTsPageProps> = ({
  nfts = [],
  daoContext: {
    dao,
    userPermissions: { isCanCreateProposals },
    policyAffectsProposals,
  },
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink>NFTs</NavLink>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          onCreateProposalClick={toggleCreateProposal}
          disableNewProposal={!isCanCreateProposals}
        />
        <CreateProposal
          className={styles.createProposal}
          proposalVariant={ProposalVariant.ProposeTransfer}
          dao={dao}
          showFlag={false}
          onClose={toggleCreateProposal}
        />
        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>

      {nfts.length === 0 ? (
        <NoResultsView title="No NFTs available" />
      ) : (
        <>
          <div className={styles.header}>
            <h1>All NFTs</h1>
          </div>
          <div className={styles.content}>
            {nfts.map(nft => (
              <div className={styles.card} key={nft.uri}>
                <NFTCard
                  name={nft.title}
                  image={{
                    src: `${nft.uri}`,
                    width: 296,
                    height: 424,
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NFTs;
