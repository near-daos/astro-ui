import isEmpty from 'lodash/isEmpty';

import { ProposalsByEndTime } from 'types/proposal';

export function isProposalsByEndTimeEmpty(data: ProposalsByEndTime): boolean {
  const {
    lessThanHourProposals,
    lessThanDayProposals,
    lessThanWeekProposals,
    moreThanWeekProposals,
    otherProposals
  } = data;

  return (
    isEmpty(data) ||
    (isEmpty(lessThanHourProposals) &&
      isEmpty(lessThanDayProposals) &&
      isEmpty(lessThanWeekProposals) &&
      isEmpty(moreThanWeekProposals) &&
      isEmpty(otherProposals))
  );
}
