import { useMemo } from 'react';
import findLastIndex from 'lodash/findLastIndex';
import findLast from 'lodash/findLast';

import { ProposalActionData, ProposalFeedItem } from 'types/proposal';
import { toMillis } from 'utils/format';
import { POINT } from 'features/proposal/components/VoteTimeline/constants';

type VoteActionItem = {
  action: ProposalActionData | null;
  left: number;
};

const DEFAULT_ACTION_ITEM = {
  action: null,
  left: 0,
};

export const useTimelineData = (
  proposal: ProposalFeedItem | undefined,
  total: number
): {
  extraActions: ProposalActionData[];
  lastVote: VoteActionItem;
  voteActions: VoteActionItem[];
} => {
  return useMemo(() => {
    if (total === 0 || !proposal) {
      return {
        extraActions: [],
        lastVote: DEFAULT_ACTION_ITEM,
        voteActions: [],
      };
    }

    const voteActions: VoteActionItem[] = Array.from(new Array(total)).map(
      () => DEFAULT_ACTION_ITEM
    );
    const extraActions: ProposalActionData[] = [];
    const actions: ProposalActionData[] = proposal.actions
      .sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return 1;
        }

        if (a.timestamp < b.timestamp) {
          return -1;
        }

        return 0;
      })
      .slice(1);

    const startTimestamp = new Date(proposal.createdAt).getTime();
    const diff = new Date(proposal.votePeriodEnd).getTime() - startTimestamp;
    const step = Math.floor(diff / total);

    voteActions.forEach((_, voteActionsIndex) => {
      const from = startTimestamp + step * voteActionsIndex;
      const to = startTimestamp + step * (voteActionsIndex + 1);

      actions.forEach(action => {
        const timestamp = toMillis(action.timestamp);

        if (!(timestamp >= from && timestamp <= to)) {
          return;
        }

        for (let i = voteActionsIndex; i < voteActions.length; i += 1) {
          if (total - 1 === i) {
            const lastFreeCell = findLastIndex(
              voteActions,
              voteAction => !voteAction.action
            );

            if (lastFreeCell === -1) {
              if (voteActions[0].action) {
                extraActions.push(voteActions[0].action);
              }

              voteActions.shift();
            } else {
              voteActions.splice(lastFreeCell, 1);
            }

            voteActions.push({ action, left: 0 });
            break;
          }

          if (!voteActions[i].action) {
            voteActions[i] = { action, left: 0 };
            break;
          }
        }
      });
    });

    if (extraActions.length > 0 && voteActions[0].action) {
      extraActions.push(voteActions[0].action);
    }

    if (proposal.status === 'Rejected' || proposal.status === 'Approved') {
      const lastIndex = findLastIndex(voteActions, voteAction =>
        Boolean(voteAction.action)
      );

      if (lastIndex !== -1) {
        const { action } = voteActions[lastIndex];

        voteActions[lastIndex] = { action: null, left: 0 };
        voteActions[voteActions.length - 1] = { action, left: 0 };
      }
    }

    const result = voteActions.map((voteAction, index) => ({
      ...voteAction,
      left: index * POINT,
    }));

    const lastVote = findLast(result, voteAction => Boolean(voteAction.action));

    return {
      extraActions,
      lastVote: lastVote || DEFAULT_ACTION_ITEM,
      voteActions: result,
    };
  }, [total, proposal]);
};
