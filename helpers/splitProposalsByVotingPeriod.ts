import { Proposal, ProposalsByEndTime } from 'types/proposal';

import { HOURS_IN_DAY, HOURS_IN_WEEK, ONE_HOUR } from 'constants/timeConstants';

export function splitProposalsByVotingPeriod(
  data: Proposal[]
): ProposalsByEndTime {
  return data.reduce(
    (res, item) => {
      // Split items by groups (less than hour, day, week)
      const votingEndsAt = new Date(item.votePeriodEnd).getTime();
      const now = new Date().getTime();
      const hoursLeft = votingEndsAt - now;

      if (hoursLeft < 0 || item.status !== 'InProgress') {
        res.otherProposals.push(item);
      } else if (hoursLeft < ONE_HOUR * 3.6e6) {
        res.lessThanHourProposals.push(item);
      } else if (hoursLeft < HOURS_IN_DAY * 3.6e6) {
        res.lessThanDayProposals.push(item);
      } else if (hoursLeft < HOURS_IN_WEEK * 3.6e6) {
        res.lessThanWeekProposals.push(item);
      } else {
        res.moreThanWeekProposals.push(item);
      }

      return res;
    },
    {
      lessThanHourProposals: [] as Proposal[],
      lessThanDayProposals: [] as Proposal[],
      lessThanWeekProposals: [] as Proposal[],
      moreThanWeekProposals: [] as Proposal[],
      otherProposals: [] as Proposal[]
    }
  );
}
