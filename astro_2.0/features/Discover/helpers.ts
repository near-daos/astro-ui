export const CONTRACT = 'astro';

export enum DaoStatsTopics {
  GENERAL_INFO = 'generalInfo',
  USERS_AND_ACTIVITY = 'usersAndActivity',
}

export enum GeneralInfoTabs {
  NUMBER_OF_DAOS = 'numberOfDaos',
  GROUPS = 'groups',
  AVERAGE_GROUP_DAOS = 'avgGroupDaos',
  ACTIVE_DAOS = 'activeDaos',
}

export enum UsersAndActivityTabs {
  ALL_USERS_ON_PLATFORM = 'allUsersOnPlatform',
  USERS_MEMBERS_OF_DAO = 'usersMembersOfDao',
  AVERAGE_NUMBER_OF_USERS_PER_DAO = 'averageNumberOfUsersPerDao',
  NUMBER_OF_INTERACTIONS = 'numberOfInteractions',
  AVERAGE_NUMBER_OF_INTERACTIONS_PER_DAO = 'averageNumberOfInteractionsPerDao',
}

export function getValueLabel(topic: string, view: string): string {
  switch (topic) {
    case 'generalInfo': {
      switch (view) {
        case 'activeDaos': {
          return 'DAOs activity';
        }
        case 'groups': {
          return 'Groups';
        }
        default: {
          return '-';
        }
      }
    }
    case 'usersAndActivity': {
      switch (view) {
        case 'allUsersOnPlatform': {
          return 'Users';
        }
        case 'usersMembersOfDao': {
          return 'Members';
        }
        case 'numberOfInteractions': {
          return 'Number of Interactions';
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
