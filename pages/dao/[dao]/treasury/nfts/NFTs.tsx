import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { ALL_DAOS_URL } from 'constants/routing';

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
import { DropdownMultiSelect } from 'components/inputs/selects/DropdownMultiSelect';
import uniqBy from 'lodash/uniqBy';
import isEmpty from 'lodash/isEmpty';

import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import styles from './nfts.module.scss';

export interface NFTsPageProps {
  daoContext: DaoContext;
}

const NFTs: NextPage<NFTsPageProps> = ({
  daoContext: { dao, userPermissions, policyAffectsProposals },
}) => {
  const { tokens } = useDaoCustomTokens();
  const router = useRouter();
  const daoId = router.query.dao as string;
  const [nfts, setNfts] = useState<NftToken[]>([]);

  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  useEffect(() => {
    SputnikHttpService.getAccountNFTs(daoId).then(data => {
      setNfts(data);
    });
  }, [daoId]);

  const [currentContractIds, setCurrentContractIds] = useState<string[]>([]);
  const nftsByUniqueContractId = uniqBy(nfts, 'contractId');

  const uniqueContracts = nftsByUniqueContractId.map(nft => {
    const { contractId } = nft;
    const contractNameComponent = <div>{nft.contractName}</div>;

    return {
      label: contractId,
      component: contractNameComponent,
    };
  });

  function renderNfts() {
    const nftsToRender = isEmpty(currentContractIds)
      ? nfts
      : nfts.filter(nft => currentContractIds.includes(nft.contractId));

    return nftsToRender.map(nft => {
      const { uri, contractId } = nft;

      return (
        <NFTCard image={uri} contractId={contractId} key={uri.toString()} />
      );
    });
  }

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href={ALL_DAOS_URL}>All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink>NFTs</NavLink>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          onCreateProposalClick={toggleCreateProposal}
          userPermissions={userPermissions}
        />
        <CreateProposal
          className={styles.createProposal}
          proposalVariant={ProposalVariant.ProposeTransfer}
          dao={dao}
          userPermissions={userPermissions}
          key={Object.keys(tokens).length}
          daoTokens={tokens}
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
            <h1>NFTs</h1>
            <div className={styles.selectors}>
              <div className={styles.contracts}>
                <DropdownMultiSelect
                  onChange={v => setCurrentContractIds(v)}
                  defaultValue={currentContractIds}
                  label="Smart contract"
                  options={uniqueContracts}
                  simple
                />
              </div>
            </div>
          </div>
          <div className={styles.content}>{renderNfts()}</div>
        </>
      )}
    </div>
  );
};

export default NFTs;
