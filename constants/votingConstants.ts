import { HOURS_IN_DAY, HOURS_IN_WEEK, ONE_HOUR } from './timeConstants';

export const VOTE_ACTION_SOURCE_PAGE = 'astro-vote-action-source';

export type VotePeriodKey =
  | 'lessThanHourProposals'
  | 'lessThanDayProposals'
  | 'lessThanWeekProposals'
  | 'moreThanWeekProposals'
  | 'otherProposals';

export interface VoteByPeriodInterface {
  title: string;
  key: VotePeriodKey;
  subHours: number;
}

export const VOTE_BY_PERIOD: VoteByPeriodInterface[] = [
  {
    title: 'less than 1 hour',
    key: 'lessThanHourProposals',
    subHours: ONE_HOUR,
  },
  {
    title: 'less than a day',
    key: 'lessThanDayProposals',
    subHours: HOURS_IN_DAY,
  },
  {
    title: 'less than a week',
    key: 'lessThanWeekProposals',
    subHours: HOURS_IN_WEEK,
  },
  {
    title: 'more than a week',
    key: 'moreThanWeekProposals',
    subHours: HOURS_IN_WEEK,
  },
  {
    title: 'other proposals',
    key: 'otherProposals',
    subHours: 0,
  },
];
