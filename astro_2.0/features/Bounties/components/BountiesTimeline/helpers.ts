import { BountyClaim, BountyContext, BountyProposal } from 'types/bounties';
import {
  TimelineClaim,
  TimelineGranularity,
  TimelineGroup,
  TimelineMilestone,
} from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';
import { DATA_SEPARATOR } from 'constants/common';
import {
  addDays,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  eachMonthOfInterval,
  endOfDay,
  endOfHour,
  endOfMonth,
  format,
  getDaysInMonth,
  isLastDayOfMonth,
  isSameDay,
  isSameHour,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
} from 'date-fns';
import { toMillis } from 'utils/format';

const TOOLTIP_DATE_FORMAT = 'dd MMM, yyyy';

const COLORS = [
  '#DC88F5',
  '#89B1F9',
  '#51BAD1',
  '#EF7F31',
  '#E43AE3',
  '#57B99D',
  '#D32C1F',
  '#89B1F9',
  '#A87F3D',
  '#76140C',
  '#D65B26',
  '#B6BCC1',
  '#EC5281',
  '#EF87AA',
  '#925EB1',
  '#8060D9',
  '#0038DF',
  '#4581B2',
  '#46A8EE',
  '#65C978',
  '#697683',
];

function getColor(index: number) {
  return COLORS[index % COLORS.length];
}

function getClaimMilestones(
  claim: BountyClaim,
  color: string,
  proposal?: BountyProposal
) {
  const { accountId, startTime } = claim;
  const milestones: TimelineMilestone[] = [];
  const claimStartTime = toMillis(startTime);
  const claimStart = new Date(claimStartTime);

  if (claimStart) {
    milestones.push({
      type: 'Claim',
      date: claimStart,
      tooltip: `Claimed by ${accountId}`,
      color,
    });
  }

  if (proposal) {
    const proposalStatus = proposal.status;

    if (proposalStatus === 'InProgress') {
      milestones.push({
        type: 'Pending Approval',
        date: new Date(proposal.createdAt),
        tooltip: 'Pending Approval',
        color,
      });
    } else if (proposalStatus === 'Approved') {
      milestones.push({
        type: 'Complete Claim',
        date: new Date(proposal.createdAt),
        tooltip: `Claim completed by ${proposal.proposer}`,
        color,
      });
    }
    // todo - how cna we handle rejected/not approved claims?
  }

  if (claimStart && claim.deadline) {
    const hasApprovedProposal = !!milestones.find(
      prp => prp.type === 'Complete Claim'
    );

    if (!hasApprovedProposal) {
      const deadline = toMillis(claim.deadline);
      const claimEnd = new Date(claimStartTime + deadline);

      milestones.push({
        type: 'Claim Deadline',
        date: claimEnd,
        tooltip: `Deadline to complete ${accountId} claim ${format(
          claimEnd,
          TOOLTIP_DATE_FORMAT
        )}`,
        color,
      });
    }
  }

  return milestones;
}

function prepareClaims(context: BountyContext) {
  const claims: TimelineClaim[] = [];

  // Bounty claims
  if (context.bounty?.bountyClaims?.length > 0) {
    context.bounty.bountyClaims.forEach((claim, i) => {
      const { id } = claim;
      const proposal = context.bounty.bountyDoneProposals.find(
        _proposal => _proposal.bountyClaimId === id
      );

      const milestones = getClaimMilestones(claim, getColor(i), proposal);

      const sortedMilestones = milestones.slice().sort((a, b) => {
        if (a.date > b.date) {
          return 1;
        }

        if (a.date < b.date) {
          return -1;
        }

        return 0;
      });

      const minDate = sortedMilestones[0]?.date;
      const maxDate = sortedMilestones[sortedMilestones.length - 1]?.date;

      claims.push({
        id: claim.id,
        milestones,
        title: claim.accountId,
        color: getColor(i),
        minDate,
        maxDate,
      });
    });
  }

  return claims;
}

function accumulateClaimsMilestones(
  milestones: TimelineMilestone[],
  claims: TimelineClaim[]
) {
  return claims.reduce(
    (res, item) => {
      res.push(...item.milestones);

      return res;
    },
    [...milestones]
  );
}

export function prepareTimelineDataset(data: BountyContext[]): TimelineGroup[] {
  return data.map(context => {
    const item = context.bounty || context.proposal;
    let milestones: TimelineMilestone[] = [];
    const [description] = item.description.split(DATA_SEPARATOR);

    if (context.proposal) {
      // Create proposal milestone
      const proposalCreated = new Date(context.proposal.createdAt);

      milestones.push({
        type: 'Proposal Created',
        date: proposalCreated,
        tooltip: `Proposal Created ${format(
          proposalCreated,
          TOOLTIP_DATE_FORMAT
        )}`,
      });
    }

    if (context.bounty) {
      // Create bounty milestone
      const bountyCreated = new Date(context.bounty.createdAt);

      milestones.push({
        type: 'Bounty Created',
        date: bountyCreated,
        tooltip: `Bounty Created ${format(bountyCreated, TOOLTIP_DATE_FORMAT)}`,
      });
    }

    if (Number(context.bounty?.times) === 0) {
      // Complete bounty milestone
      let latestDate: Date | null = null;

      context.bounty.bountyDoneProposals
        .filter(_proposal => _proposal.status === 'Approved')
        .forEach(_proposal => {
          const updatedAt = new Date(_proposal.updatedAt);

          if (!latestDate || latestDate < updatedAt) {
            latestDate = updatedAt;
          }
        });

      if (latestDate) {
        milestones.push({
          type: 'Complete Bounty',
          date: latestDate,
          tooltip: `Bounty Completed ${format(
            latestDate,
            TOOLTIP_DATE_FORMAT
          )}`,
        });
      }
    }

    const claims = prepareClaims(context);

    milestones = accumulateClaimsMilestones(milestones, claims);

    const sortedMilestones = milestones.slice().sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      }

      if (a.date < b.date) {
        return -1;
      }

      return 0;
    });

    const groupMinDate = sortedMilestones[0]?.date;
    const groupMaxDate = sortedMilestones[sortedMilestones.length - 1]?.date;

    return {
      id: context.id,
      isOpen: false,
      name: description || '',
      milestones,
      claims,
      minDate: groupMinDate,
      maxDate: groupMaxDate,
    };
  });
}

export function getTimelineRange(dataset: TimelineGroup[]): [Date, Date] {
  let min: Date | null = null; // new Date();
  let max: Date | null = null; // addMonths(min, 1);

  dataset.forEach(group => {
    group.milestones.forEach(milestone => {
      if (!min || min > milestone.date) {
        min = milestone.date;
      }

      if (!max || max < milestone.date) {
        max = milestone.date;
      }
    });
  });

  if (!min) {
    min = new Date();
  }

  if (!max) {
    max = addDays(min, 2);
  }

  return [min, max];
}

export function getTopColumns(
  start: Date,
  end: Date,
  granularity: TimelineGranularity
): Date[] {
  switch (granularity) {
    case 'hour': {
      return eachHourOfInterval({ start, end });
    }
    case 'day': {
      return eachDayOfInterval({ start, end });
    }
    default: {
      return eachMonthOfInterval({ start, end });
    }
  }
}

export function getColumns(
  start: Date,
  end: Date,
  granularity: TimelineGranularity
): Date[] {
  switch (granularity) {
    case 'hour': {
      return eachMinuteOfInterval({ start, end });
    }
    case 'day': {
      return eachHourOfInterval({ start, end });
    }
    default: {
      return eachDayOfInterval({ start, end });
    }
  }
}

export function formatColumnLabel(
  date: Date,
  granularity: TimelineGranularity
): string {
  switch (granularity) {
    case 'hour': {
      return format(date, 'mm');
    }
    case 'day': {
      return format(date, 'H');
    }
    default: {
      return format(date, 'd');
    }
  }
}

export function getTopColumnsWidth(
  date: Date,
  granularity: TimelineGranularity
): number {
  switch (granularity) {
    case 'hour': {
      return 60 * 32;
    }
    case 'day': {
      return 24 * 32;
    }
    default: {
      return getDaysInMonth(date) * 32;
    }
  }
}

export function getRangeColumns(
  date: Date,
  granularity: TimelineGranularity
): Date[] {
  switch (granularity) {
    case 'hour': {
      return eachMinuteOfInterval({
        start: startOfHour(date),
        end: endOfHour(date),
      });
    }
    case 'day': {
      return eachHourOfInterval({
        start: startOfDay(date),
        end: endOfDay(date),
      });
    }
    default: {
      return eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date),
      });
    }
  }
}

export function getMilestonesForDate(
  milestones: TimelineMilestone[],
  date: Date,
  granularity: TimelineGranularity
): TimelineMilestone[] {
  let compareFn = isSameDay;

  switch (granularity) {
    case 'day': {
      compareFn = isSameHour;

      break;
    }
    default: {
      compareFn = isSameDay;

      break;
    }
  }

  return (
    milestones?.filter(item => {
      return compareFn(date, item.date);
    }) ?? []
  );
}

export function getGroupDateStart(
  date: Date | undefined,
  granularity: TimelineGranularity
): Date | null {
  if (!date) {
    return null;
  }

  switch (granularity) {
    case 'hour': {
      return startOfMinute(date);
    }
    case 'day': {
      return startOfHour(date);
    }
    default: {
      return startOfDay(date);
    }
  }
}

export function isEndOfGranularityPeriod(
  date: Date,
  granularity: TimelineGranularity
): boolean {
  switch (granularity) {
    case 'hour': {
      return date.getMinutes() === 59;
    }
    case 'day': {
      return date.getHours() === 23;
    }
    default: {
      return isLastDayOfMonth(date);
    }
  }
}
