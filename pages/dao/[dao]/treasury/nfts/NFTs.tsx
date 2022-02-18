import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import uniqBy from 'lodash/uniqBy';
import isEmpty from 'lodash/isEmpty';

import { NFTCard } from 'astro_2.0/features/pages/nft/NtfCard';

import { ProposalVariant } from 'types/proposal';
import { NftToken } from 'types/token';

import { SputnikHttpService } from 'services/sputnik';

import { DaoContext } from 'types/context';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { DropdownMultiSelect } from 'components/inputs/selects/DropdownMultiSelect';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import styles from './nfts.module.scss';

export interface NFTsPageProps {
  daoContext: DaoContext;
}

const NFTs: NextPage<NFTsPageProps> = ({ daoContext }) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const [nfts, setNfts] = useState<NftToken[]>([]);

  useEffect(() => {
    SputnikHttpService.getAccountNFTs(daoId).then(data => {
      setNfts(data);
    });
  }, [daoId]);

  const [currentContractIds, setCurrentContractIds] = useState<string[]>([]);
  const nftsByUniqueContractId = uniqBy(nfts, 'contractId');

  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName
  );

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.NFTS,
    ];
  }, [breadcrumbsConfig]);

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
      const { uri, contractId, tokenId } = nft;

      return (
        <NFTCard
          image={uri}
          contractId={contractId}
          key={uri.toString()}
          tokenId={tokenId}
        />
      );
    });
  }

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeCreateBounty}
    >
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
    </NestedDaoPageWrapper>
  );
};

export default NFTs;
