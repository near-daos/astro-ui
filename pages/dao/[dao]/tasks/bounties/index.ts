import Bounties from 'pages/dao/[dao]/tasks/bounties/BountiesPage';
import { GetServerSideProps } from 'next';
import { DAO } from 'types/dao';
import { SputnikService } from 'services/SputnikService';
import { BountyDoneProposalType } from 'types/proposal';
import { Bounty } from 'components/cards/bounty-card/types';
import { BountyResponse } from 'types/bounties';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { Token } from 'types/token';

export const getServerSideProps: GetServerSideProps = async ({
  query
}): Promise<{
  props: {
    dao: DAO | null;
    bountiesDone: BountyDoneProposalType[];
    bounties: Bounty[];
    tokens: Token[];
  };
}> => {
  const dao = await SputnikService.getDaoById(query.dao as string);
  const daoTokens = await SputnikService.getAccountTokens(query.dao as string);

  const bountiesDone = await SputnikService.getBountiesDone(
    query.dao as string
  ).then(bountyDoneProposals => {
    return bountyDoneProposals.map(proposal => {
      return {
        ...(proposal.kind as BountyDoneProposalType),
        completedDate: proposal.createdAt
      };
    });
  });

  const bounties = await SputnikService.getBountiesByDaoId(
    query.dao as string
  ).then(result => {
    return result.map(
      (response: BountyResponse): Bounty => {
        const [description, url] = response.description.split(
          EXTERNAL_LINK_SEPARATOR
        );

        return {
          amount: response.amount,
          forgivenessPeriod: response.dao.policy.bountyForgivenessPeriod,
          claimedBy: response.bountyClaims.map(claim => ({
            deadline: claim.deadline,
            accountId: claim.accountId,
            starTime: claim.startTime
          })),
          deadlineThreshold: response.maxDeadline,
          slots: Number(response.times),
          id: response.bountyId,
          token: response.token,
          description,
          externalUrl: url || ''
        };
      }
    );
  });

  return {
    props: {
      dao,
      bountiesDone,
      bounties,
      tokens: daoTokens
    }
  };
};

export default Bounties;
