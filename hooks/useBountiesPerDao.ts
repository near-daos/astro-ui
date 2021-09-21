import { useSelectedDAO } from 'hooks/useSelectedDao';
import { useEffect, useState } from 'react';
import { Bounty } from 'components/cards/bounty-card/types';
import { SputnikService } from 'services/SputnikService';
import { BountyResponse } from 'types/bounties';

export const useBountiesPerDao = (): Bounty[] => {
  const selectedDao = useSelectedDAO();
  const [bounties, setBounties] = useState<Bounty[]>([]);

  useEffect(() => {
    if (!selectedDao) {
      return;
    }

    SputnikService.getBountiesByDaoId(selectedDao.id).then(result => {
      const data: Bounty[] = result.map(
        (response: BountyResponse): Bounty => {
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
            token: 'NEAR',
            description: response.description
          };
        }
      );

      setBounties(data);
    });
  }, [selectedDao]);

  return bounties;
};
