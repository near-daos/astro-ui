import { DAO } from 'types/dao';

export const mapDraftToProposalDraft = (
  data: Record<string, unknown>,
  dao?: DAO
): Record<string, unknown> => {
  return {
    ...data,
    dao: dao || {},
    permissions: {},
    votes: {},
    proposalVariant: (data?.kind as Record<string, unknown>).proposalVariant,
  };
};
