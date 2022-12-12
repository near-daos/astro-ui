import { DraftComment } from 'services/DraftsService/types';
import { DraftCommentIndex } from 'services/SearchService/types';

export function mapDraftCommentIndexToDraftComment(
  index: DraftCommentIndex
): DraftComment {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const createTime = index.creatingTimeStamp || index.createTimestamp;

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
    createdAt: createTime ? new Date(createTime).toISOString() : '',
    updatedAt: index.processingTimeStamp
      ? new Date(index.processingTimeStamp).toISOString()
      : '',
  };
}
