export const CONTRACT = { contract: 'astro' };

export enum DaoStatsTopics {
  GENERAL_INFO = 'generalInfo',
  USERS_AND_ACTIVITY = 'usersAndActivity',
  GOVERNANCE = 'governance',
  FLOW = 'flow',
  TVL = 'tvl',
  TOKENS = 'tokens',
}

export enum GeneralInfoTabs {
  ACTIVITY = 'activity',
  ACTIVE_DAOS = 'activeDaos',
}

export enum UsersAndActivityTabs {
  ALL_USERS_ON_PLATFORM = 'allUsersOnPlatform',
  USERS_MEMBERS_OF_DAO = 'usersMembersOfDao',
  AVERAGE_NUMBER_OF_USERS_PER_DAO = 'averageNumberOfUsersPerDao',
  NUMBER_OF_INTERACTIONS = 'numberOfInteractions',
  AVERAGE_NUMBER_OF_INTERACTIONS_PER_DAO = 'averageNumberOfInteractionsPerDao',
  ALL_USERS_PER_DAO = 'allUsersPerDao',
}

export enum GovernanceTabs {
  NUMBER_OF_PROPOSALS = 'numberOfProposals',
  VOTE_THROUGH_RATE = 'voteThroughRate',
}

export enum FlowTabs {
  TOTAL_IN = 'totalIn',
  TOTAL_OUT = 'totalOut',
  INCOMING_TRANSACTIONS = 'incomingTransactions',
  OUTGOING_TRANSACTIONS = 'outgoingTransactions',
}

export enum TvlTabs {
  PLATFORM_TVL = 'platformTvl',
  VL_IN_BOUNTIES = 'vlInBounties',
  NUMBER_OF_BOUNTIES = 'numberOfBounties',
  VL_OF_BOUNTIES = 'vlOfBounties',
  TVL = 'tvl',
}

export enum TokensTabs {
  NUMBER_OF_FTS = 'numberOfFts',
  VL_OF_FTS = 'vlOfFts',
  NUMBER_OF_NFTS = 'numberOfNfts',
}
