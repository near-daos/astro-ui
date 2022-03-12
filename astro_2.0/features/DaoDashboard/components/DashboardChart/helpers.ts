import { TFunction } from 'next-i18next';
import {
  FlowTabs,
  GeneralInfoTabs,
  GovernanceTabs,
  TokensTabs,
  TvlTabs,
  UsersAndActivityTabs,
} from 'astro_2.0/features/Discover/constants';

export function getChartTitles(
  activeView: string | undefined,
  t: TFunction
): string[] {
  switch (activeView) {
    case 'BOUNTIES': {
      return [t('daoDashboard.bounties')];
    }
    case 'DAO_FUNDS': {
      return [t('daoDashboard.daoFunds')];
    }
    case 'NFTS': {
      return [t('daoDashboard.nfts')];
    }
    case 'PROPOSALS': {
      return [
        t('daoDashboard.activeProposals'),
        t('daoDashboard.proposalsInTotal'),
      ];
    }
    case GeneralInfoTabs.ACTIVE_DAOS: {
      return [t('discover.activeDaos')];
    }
    case UsersAndActivityTabs.NUMBER_OF_INTERACTIONS: {
      return [t('discover.numberOfInteractions')];
    }
    case UsersAndActivityTabs.USERS_MEMBERS_OF_DAO: {
      return [t('discover.usersMembersOfDao')];
    }
    case UsersAndActivityTabs.ALL_USERS_ON_PLATFORM: {
      return [t('discover.allUsersOnAPlatform')];
    }
    case UsersAndActivityTabs.ALL_USERS_PER_DAO: {
      return [t('discover.allUsersPerDao')];
    }
    case UsersAndActivityTabs.AVERAGE_NUMBER_OF_USERS_PER_DAO: {
      return [t('discover.averageNumberOfUsersPerDao')];
    }
    case UsersAndActivityTabs.AVERAGE_NUMBER_OF_INTERACTIONS_PER_DAO: {
      return [t('discover.averageNumberOfInteractionsPerDao')];
    }
    case GovernanceTabs.VOTE_THROUGH_RATE: {
      return [t('discover.voteThroughRate')];
    }
    case GovernanceTabs.NUMBER_OF_PROPOSALS: {
      return [t('discover.numberOfProposals')];
    }
    case FlowTabs.TOTAL_IN: {
      return [t('discover.totalIn')];
    }
    case FlowTabs.TOTAL_OUT: {
      return [t('discover.totalOut')];
    }
    case FlowTabs.INCOMING_TRANSACTIONS: {
      return [t('discover.incomingTransactions')];
    }
    case FlowTabs.OUTGOING_TRANSACTIONS: {
      return [t('discover.outgoingTransactions')];
    }
    case TvlTabs.PLATFORM_TVL: {
      return [t('discover.platformTvl')];
    }
    case TvlTabs.VL_IN_BOUNTIES: {
      return [t('discover.vlInBounties')];
    }
    case TvlTabs.VL_OF_BOUNTIES: {
      return [t('discover.vlOfBounties')];
    }
    case TvlTabs.NUMBER_OF_BOUNTIES: {
      return [t('discover.numberOfBounties')];
    }
    case TvlTabs.TVL: {
      return [t('discover.tvl')];
    }
    case TokensTabs.NUMBER_OF_FTS: {
      return [t('discover.numberOfFts')];
    }
    case TokensTabs.VL_OF_FTS: {
      return [t('discover.vlOfFts')];
    }
    case TokensTabs.NUMBER_OF_NFTS: {
      return [t('discover.numberOfNfts')];
    }
    default: {
      return [t('activity')];
    }
  }
}
