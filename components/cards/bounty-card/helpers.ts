import { DeadlineUnit } from 'components/cards/bounty-card/types';
import { addDays, addMonths, addWeeks } from 'date-fns';

export function getDeadlineDate(
  startDate: Date,
  deadlineThreshold: number,
  deadlineUnit: DeadlineUnit
): Date {
  switch (deadlineUnit) {
    case 'day': {
      return addDays(startDate, deadlineThreshold);
    }
    case 'week': {
      return addWeeks(startDate, deadlineThreshold);
    }
    default:
    case 'month': {
      return addMonths(startDate, deadlineThreshold);
    }
  }
}
