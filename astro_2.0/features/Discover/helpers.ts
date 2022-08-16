/* istanbul ignore file */

import {
  DaoStatsTopics,
  FlowTabs,
  GeneralInfoTabs,
  GovernanceTabs,
  TokensTabs,
  TvlTabs,
  UsersAndActivityTabs,
} from 'astro_2.0/features/Discover/constants';

export function getValueLabel(topic: string, view: string): string {
  switch (topic) {
    case DaoStatsTopics.GENERAL_INFO: {
      switch (view) {
        case GeneralInfoTabs.ACTIVE_DAOS: {
          return 'numberOfProposals';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.USERS_AND_ACTIVITY: {
      switch (view) {
        case UsersAndActivityTabs.ALL_USERS_ON_PLATFORM: {
          return 'users';
        }
        case UsersAndActivityTabs.USERS_MEMBERS_OF_DAO: {
          return 'members';
        }
        case UsersAndActivityTabs.NUMBER_OF_INTERACTIONS: {
          return 'numberOfInteractions';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.GOVERNANCE: {
      switch (view) {
        case GovernanceTabs.NUMBER_OF_PROPOSALS: {
          return 'numberOfProposals';
        }
        case GovernanceTabs.VOTE_THROUGH_RATE: {
          return 'voteThroughRate';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.FLOW: {
      switch (view) {
        case FlowTabs.TOTAL_IN: {
          return 'totalIn';
        }
        case FlowTabs.TOTAL_OUT: {
          return 'totalOut';
        }
        case FlowTabs.INCOMING_TRANSACTIONS: {
          return 'incomingTransactions';
        }
        case FlowTabs.OUTGOING_TRANSACTIONS: {
          return 'outgoingTransactions';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.TVL: {
      switch (view) {
        case TvlTabs.PLATFORM_TVL: {
          return 'platformTvl';
        }
        case TvlTabs.VL_IN_BOUNTIES: {
          return 'vlInBountiesGrants';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.TOKENS: {
      switch (view) {
        case TokensTabs.NUMBER_OF_FTS: {
          return 'numberOfFts';
        }
        case TokensTabs.VL_OF_FTS: {
          return 'vlOfFts';
        }
        case TokensTabs.NUMBER_OF_NFTS: {
          return 'numberOfNfts';
        }
        default: {
          return '-';
        }
      }
    }
    default: {
      return '-';
    }
  }
}
