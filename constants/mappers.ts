export const API_MAPPERS = {
  mapDaoDTOtoDao: 'mapDaoDTOtoDao',
  mapDaoFeedItemResponseToDaoFeedItemList:
    'mapDaoFeedItemResponseToDaoFeedItemList',
  mapProposalDTOToProposal: 'mapProposalDTOToProposal',
  mapSearchResultsDTOToDataObject: 'mapSearchResultsDTOToDataObject',
  mapProposalFeedItemResponseToProposalFeedItem:
    'mapProposalFeedItemResponseToProposalFeedItem',
  mapSubscriptionsDTOsToDaoSubscriptions:
    'mapSubscriptionsDTOsToDaoSubscriptions',
  mapTokensDTOToTokens: 'mapTokensDTOToTokens',
  mapNftTokenResponseToNftToken: 'mapNftTokenResponseToNftToken',
  mapReceiptsByTokenResponse: 'mapReceiptsByTokenResponse',
  mapReceiptsResponse: 'mapReceiptsResponse',
};

export type ApiMappers = keyof typeof API_MAPPERS;
