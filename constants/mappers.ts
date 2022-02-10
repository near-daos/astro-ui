export const API_MAPPERS = {
  MAP_DAO_DTO_TO_DAO: 'mapDaoDTOtoDao',
  MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEED: 'mapDaoFeedItemResponseToDaoFeed',
  MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEEDS: 'mapDaoFeedItemResponseToDaoFeeds',
  MAP_PROPOSAL_DTO_TO_PROPOSAL: 'mapProposalDTOToProposal',
  MAP_PROPOSAL_DTO_TO_PROPOSALS: 'mapProposalDTOToProposals',
  MAP_TOKENS_DTO_TO_TOKEN: 'mapTokensDTOToToken',
  MAP_TOKENS_DTO_TO_TOKENS: 'mapTokensDTOToTokens',
  MAP_SEARCH_RESULTS_DTO_TO_DATA_OBJECT: 'mapSearchResultsDTOToDataObject',
  MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM:
    'mapProposalFeedItemResponseToProposalFeedItem',
  MAP_SUBSCRIPTIONS_DTOS_TO_DAO_SUBSCRIPTIONS:
    'mapSubscriptionsDTOsToDaoSubscriptions',
  MAP_NFT_TOKEN_RESPONSE_TO_NFT_TOKEN: 'mapNftTokenResponseToNftToken',
  MAP_RECEIPTS_BY_TOKEN_RESPONSE: 'mapReceiptsByTokenResponse',
  MAP_RECEIPTS_RESPONSE: 'mapReceiptsResponse',
};

export type ApiMappers = keyof typeof API_MAPPERS;
