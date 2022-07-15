import { nanoid } from 'nanoid';
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
    hashtags: (data?.hashtags as string[])?.map(hashtag => ({
      id: nanoid(),
      value: hashtag,
    })),
    proposalVariant: (data?.kind as Record<string, unknown>).proposalVariant,
  };
};
