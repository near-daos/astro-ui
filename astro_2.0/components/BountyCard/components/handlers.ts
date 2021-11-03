import { SputnikNearService } from 'services/sputnik';

export const claimBountyHandler = (
  daoId: string,
  bountyId: string,
  deadline: string,
  bountyBond: string,
  onSuccess: () => void
) => (): void => {
  SputnikNearService.claimBounty(daoId, {
    bountyId: Number(bountyId),
    deadline,
    bountyBond,
  }).then(() => onSuccess());
};

export const unclaimBountyHandler = (
  daoId: string,
  bountyId: string,
  onSuccess: () => void
) => (): void => {
  SputnikNearService.unclaimBounty(daoId, bountyId).then(() => onSuccess());
};
