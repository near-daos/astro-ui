import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { NFTCard } from 'astro_2.0/features/pages/nft/NtfCard';

import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { NavLink } from 'astro_2.0/components/NavLink';

import { ProposalVariant } from 'types/proposal';
import { NftToken } from 'types/token';

import { SputnikHttpService } from 'services/sputnik';

import { DaoContext } from 'types/context';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

import styles from './nfts.module.scss';

export interface NFTsPageProps {
  daoContext: DaoContext;
}

const NFTs: NextPage<NFTsPageProps> = ({
  daoContext: {
    dao,
    userPermissions: { isCanCreateProposals },
    policyAffectsProposals,
  },
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const [nfts, setNfts] = useState<NftToken[]>([]);

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  useEffect(() => {
    SputnikHttpService.getAccountNFTs(daoId).then(data => {
      setNfts(data);
    });
  }, [daoId]);

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
            {nfts.map((nft, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className={styles.card} key={`${nft.uri}_${i}`}>
                <NFTCard
                  name={nft.title}
                  image={{
                    src: `${nft.uri}`,
                    width: 296,
                    height: 424,
                  }}
                  isExternalReference={nft.isExternalReference}
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
