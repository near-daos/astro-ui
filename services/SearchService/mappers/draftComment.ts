import { DraftComment } from 'services/DraftsService/types';
import { DraftCommentIndex } from 'services/SearchService/types';

export function mapDraftCommentIndexToDraftComment(
  index: DraftCommentIndex
): DraftComment {
  return {
    id: index.id,
    contextId: index.contextId,
    contextType: index.contextType,
    author: index.author,
    message: index.message,
    replyTo: index.replyTo,
    replies:
      index.replies?.map(item => mapDraftCommentIndexToDraftComment(item)) ??
      [],
    likeAccounts: index.likeAccounts ?? [],
    dislikeAccounts: index.dislikeAccounts ?? [],
    createdAt: index.createTimestamp
      ? new Date(index.createTimestamp).toISOString()
      : '',
    updatedAt: index.processingTimeStamp
      ? new Date(index.processingTimeStamp).toISOString()
      : '',
  };
}
