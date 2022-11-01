import { DraftProposalIndex } from 'services/SearchService/types';
import { DraftProposal } from 'types/draftProposal';

export function mapDraftProposalIndexToDraftProposal(
  index: DraftProposalIndex | undefined,
  accountId?: string
): DraftProposal | undefined {
  if (!index) {
    return undefined;
  }

  return {
    ...index,
    proposalVariant: index.kind.proposalVariant,
    kind: index.kind,
    type: index.type,
    title: index.title,
    description: index.description,
    text: '',
    views: index.viewAccounts.length,
    replies: index.replies,
    saves: index.saveAccounts.length,
    createdAt: new Date(index.createTimestamp).toISOString(),
    updatedAt: new Date(index.updateTimestamp).toISOString(),
    isRead: accountId ? index.viewAccounts.includes(accountId) : false,
    isSaved: accountId ? index.saveAccounts.includes(accountId) : false,
    state: index.state,
    history: index.history
      ? index.history
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(item => {
            return {
              ...item,
              dao: index.dao
                ? (index.dao as unknown as DraftProposal['dao'])
                : null,
              proposalVariant: index.kind.proposalVariant,
              updatedAt: new Date(item.timestamp).toISOString(),
            };
          })
      : [],
    dao: index.dao ? (index.dao as unknown as DraftProposal['dao']) : null,
    votes: {},
    proposer: index.proposer,
    commentsCount: index.replies,
  } as unknown as DraftProposal;
}
