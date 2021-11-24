import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { NFTsPageProps } from './NFTs';

export { default } from 'pages/dao/[dao]/treasury/nfts/NFTs';

export const getServerSideProps: GetServerSideProps<NFTsPageProps> = async ({
  query,
}) => {
  const daoId = query.dao as string;

  const [dao, nfts, policyAffectsProposals] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getAccountNFTs(daoId),
    SputnikHttpService.findPolicyAffectsProposals(daoId),
  ]);

  if (!dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      nfts,
      dao,
      policyAffectsProposals,
    },
  };
};
