import { BountyClaim, BountyContext, BountyProposal } from 'types/bounties';
import {
  TimelineClaim,
  TimelineGranularity,
  TimelineGroup,
  TimelineMilestone,
} from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
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
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
} from 'date-fns';
import { toMillis } from 'utils/format';
import { generateHslaColors } from 'astro_2.0/features/Bounties/components/BountiesTimeline/utils';

const TOOLTIP_DATE_FORMAT = 'dd MMM, yyyy';

const COLORS = generateHslaColors(100, 40, 30, 12);

function getClaimMilestones(
  claim: BountyClaim,
  color: string,
  proposal?: BountyProposal
) {
  const { accountId, startTime } = claim;
  const milestones: TimelineMilestone[] = [];
  const claimStartTime = toMillis(startTime);
  // const deadline = toMillis(maxDeadline);
  const claimStart = new Date(claimStartTime);
  // const claimEnd = new Date(claimStartTime + deadline);

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
    }
  }

  return milestones;
}

function prepareClaims(context: BountyContext) {
  const claims: TimelineClaim[] = [];

  // Bounty claims
  if (context.bounty?.bountyClaims?.length > 0) {
    context.bounty.bountyClaims.forEach((claim, i) => {
      const { accountId } = claim;
      const proposal = context.bounty.bountyDoneProposals.find(
        _proposal =>
          _proposal.proposer === accountId && _proposal.status === 'InProgress'
      );

      const milestones = getClaimMilestones(claim, COLORS[i], proposal);

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
        color: COLORS[i],
        minDate,
        maxDate,
      });
    });
  }

  const completedProposals =
    context.bounty?.bountyDoneProposals.filter(
      _item => _item.status !== 'InProgress'
    ) ?? [];

  completedProposals.forEach((proposal, i) => {
    claims.push({
      id: proposal.id,
      milestones: [],
      title: proposal.proposer,
      color: COLORS[claims.length + i],
    });
  });

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
    const [description] = item.description.split(EXTERNAL_LINK_SEPARATOR);

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
  let dateFormat: string;

  switch (granularity) {
    case 'hour': {
      dateFormat = 'dd_MM_yyyy HH:mm';

      break;
    }
    case 'day': {
      dateFormat = 'dd_MM_yyyy HH';

      break;
    }
    default: {
      dateFormat = 'dd_MM_yyyy';

      break;
    }
  }

  const formattedDate = format(date, dateFormat);

  return (
    milestones?.filter(item => {
      const formattedItemDate = format(item.date, dateFormat);

      return formattedDate === formattedItemDate;
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
