export const YOKTO_NEAR = 1000000000000000000000000;

export const LIST_LIMIT_DEFAULT = 20;

export const DEFAULT_UPGRADE_DAO_PROPOSALS_GAS = 230;
export const DEFAULT_UPGRADE_DAO_VOTE_GAS = 300;
export const DEFAULT_PROPOSAL_GAS = 150;
export const DEFAULT_CREATE_DAO_GAS = 300;
export const DEFAULT_VOTE_GAS = 150;

export const MIN_GAS = 10;
export const MAX_GAS = 300;

export const API_MAPPERS = {
  MAP_DAO_DTO_TO_DAO: 'mapDaoDTOtoDao',
  MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEED: 'mapDaoFeedItemResponseToDaoFeed',
  MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEEDS: 'mapDaoFeedItemResponseToDaoFeeds',
  MAP_PROPOSAL_DTO_TO_PROPOSAL: 'mapProposalDTOToProposal',
  MAP_PROPOSAL_DTO_TO_PROPOSALS: 'mapProposalDTOToProposals',
  MAP_PROPOSAL_TO_PROPOSER: 'mapProposalToProposer',
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
  MAP_PROPOSALS_OVERTIME_TO_CHART_DATA: 'mapProposalsOvertimeToChartData',
  MAP_OVERTIME_TO_CHART_DATA: 'mapOvertimeToChartData',
  MAP_DRAFT_TO_PROPOSAL_DRAFT: 'mapDraftToProposalDraft',
  MAP_OPEN_SEARCH_RESULTS: 'mapOpenSearchResults',
  MAP_OPEN_SEARCH_RESPONSE_TO_DAOS: 'mapOpenSearchResponseToDaos',
  MAP_OPEN_SEARCH_RESPONSE_TO_BOUNTIES: 'mapOpenSearchResponseToBounties',
  MAP_OPEN_SEARCH_RESPONSE_TO_PROPOSALS: 'mapOpenSearchResponseToProposals',
};

export type ApiMappers = keyof typeof API_MAPPERS;

export const API_QUERIES = {
  GET_BOUNTIES_CONTEXT: 'getBountiesContext',
  GET_ACTIVE_PROPOSALS: 'getActiveProposals',
  GET_USER_PROPOSALS: 'getUserProposals',
  GET_USER_PROPOSALS_BY_PROPOSER: 'getUserProposalsByProposer',
  GET_PROPOSAL_BY_ID: 'getProposalById',
  FIND_POLICY_AFFECTS_PROPOSALS: 'findPolicyAffectsProposals',
  GET_FILTERED_PROPOSALS: 'getFilteredProposals',
  GET_POLLS: 'getPolls',
  GET_BOUNTY_CONTEXT_BY_ID: 'getBountyContextById',
  FIND_BOUNTY_CONTEXT: 'findBountyContext',
  GET_PROPOSALS_LIST: 'getProposalsList',
  GET_SHARED_PROPOSAL_TEMPLATES: 'getSharedProposalTemplates',
  GET_TEMPLATES_BY_SMART_CONTRACT: 'getTemplatesBySmartContract',
  GET_PROPOSALS_LIST_BY_ACCOUNT_ID: 'getProposalsListByAccountId',
  FIND_DAO_BY_NAME: 'findDaoByName',
  GET_JOINING_DAO_PROPOSALS: 'getJoiningDaoProposals',
  SEND_COMMENT: 'sendComment',
  DELETE_COMMENT: 'deleteComment',
  REPORT_COMMENT: 'reportComment',
  SEND_CONTACT: 'sendContact',
  SEND_VERIFICATION: 'sendVerification',
  VERIFY: 'verify',
  TOGGLE_BOUNTY_CONTEXTS: 'toggleBountyContexts',
  SHOW_BOUNTIES: 'showBounties',
  UPDATE_DAO_SETTINGS: 'updateDaoSettings',
  SAVE_PROPOSAL_TEMPLATE: 'saveProposalTemplate',
  CLONE_PROPOSAL_TEMPLATE: 'cloneProposalTemplate',
  UPDATE_PROPOSAL_TEMPLATE: 'updateProposalTemplate',
  DELETE_PROPOSAL_TEMPLATE: 'deleteProposalTemplate',
  UPDATE_ACCOUNT_SUBSCRIPTION: 'updateAccountSubscription',
  DELETE_ACCOUNT_SUBSCRIPTION: 'deleteAccountSubscription',
  UPDATE_NOTIFICATION: 'updateNotification',
  READ_ALL_NOTIFICATIONS: 'readAllNotifications',
  ARCHIVE_ALL_NOTIFICATIONS: 'archiveAllNotifications',
  UPDATE_NOTIFICATION_SETTINGS: 'updateNotificationsSettings',
  FIND_TRANSFER_PROPOSALS: 'findTransferProposals',
  ADD_AUTHORIZATION: 'addAuthorization',
  OPEN_SEARCH_AUTHORIZATION: 'openSearchAuthorization',
};

export type ApiQueries = keyof typeof API_QUERIES;
