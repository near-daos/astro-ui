import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpty, uniqBy } from 'lodash';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { DaoContext } from 'types/context';
import { NftToken } from 'types/token';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { DropdownMultiSelect } from 'components/inputs/selects/DropdownMultiSelect';
import { SputnikHttpService } from 'services/sputnik';

import { useDaoNfts } from 'services/ApiService/hooks/useDaoNfts';

import { NFTCard } from 'astro_2.0/features/pages/nft/NtfCard';

import styles from './NFTsPageContent.module.scss';

export interface NFTsPageContentProps {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const NFTsPageContent: FC<NFTsPageContentProps> = ({
  toggleCreateProposal,
}) => {
  const { useOpenSearchDataApi } = useFlags();
  const router = useRouter();
  const daoId = router.query.dao as string;
  const [nftsData, setNftsData] = useState<NftToken[] | null>(null);
  const { data } = useDaoNfts();
  const nfts = nftsData ?? data ?? [];

  useEffect(() => {
    if (useOpenSearchDataApi || useOpenSearchDataApi === undefined) {
      return;
    }

    SputnikHttpService.getAccountNFTs(daoId).then(d => {
      setNftsData(d);
    });
  }, [daoId, useOpenSearchDataApi]);

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
      const { uri, contractId, tokenId } = nft;

      return (
        <NFTCard
          image={uri}
          contractId={contractId}
          key={uri.toString()}
          tokenId={tokenId}
          toggleCreateProposal={toggleCreateProposal}
        />
      );
    });
  }

  return (
    <div>
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
