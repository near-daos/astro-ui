import { GetServerSideProps } from 'next';

import { DAO, Member } from 'types/dao';
import { Proposal } from 'types/proposal';

import { SputnikHttpService } from 'services/sputnik';
import { extractMembersFromDao } from 'services/sputnik/mappers';

export const getServerSideProps: GetServerSideProps = async ({
  query,
}): Promise<{
  props: {
    dao: DAO | null;
    proposal: Proposal | null;
    members: Member[];
  };
}> => {
  const daoId = query.dao as string;
  const proposalId = query.proposal as string;

  const [dao, proposal] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getProposalById(proposalId),
  ]);

  const members = dao && proposal ? extractMembersFromDao(dao, [proposal]) : [];

  return {
    props: {
      dao,
      proposal,
      members,
    },
  };
};

export { default } from './ProposalPage';
