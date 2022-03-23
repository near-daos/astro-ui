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
          return 'Number of Proposals';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.USERS_AND_ACTIVITY: {
      switch (view) {
        case UsersAndActivityTabs.ALL_USERS_ON_PLATFORM: {
          return 'Users';
        }
        case UsersAndActivityTabs.USERS_MEMBERS_OF_DAO: {
          return 'Members';
        }
        case UsersAndActivityTabs.NUMBER_OF_INTERACTIONS: {
          return 'Number of Interactions';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.GOVERNANCE: {
      switch (view) {
        case GovernanceTabs.NUMBER_OF_PROPOSALS: {
          return 'Number of Proposals';
        }
        case GovernanceTabs.VOTE_THROUGH_RATE: {
          return 'Vote through rate';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.FLOW: {
      switch (view) {
        case FlowTabs.TOTAL_IN: {
          return 'Total In';
        }
        case FlowTabs.TOTAL_OUT: {
          return 'Total Out';
        }
        case FlowTabs.INCOMING_TRANSACTIONS: {
          return 'Incoming Transactions';
        }
        case FlowTabs.OUTGOING_TRANSACTIONS: {
          return 'Outgoing Transactions';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.TVL: {
      switch (view) {
        case TvlTabs.PLATFORM_TVL: {
          return 'Platform TVL';
        }
        case TvlTabs.VL_IN_BOUNTIES: {
          return 'VL in Bounties/Grants';
        }
        default: {
          return '-';
        }
      }
    }
    case DaoStatsTopics.TOKENS: {
      switch (view) {
        case TokensTabs.NUMBER_OF_FTS: {
          return 'Number of FTs';
        }
        case TokensTabs.VL_OF_FTS: {
          return 'VL of FTs';
        }
        case TokensTabs.NUMBER_OF_NFTS: {
          return 'Number of NFTs';
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
