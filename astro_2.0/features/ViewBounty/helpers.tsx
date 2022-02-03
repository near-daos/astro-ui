import { CardContent } from 'astro_2.0/features/ViewBounty/components/CardContent';
import { Bounty } from 'types/bounties';
import { ReactNode } from 'react';
import { nanosToDays } from 'astro_2.0/features/DaoGovernance/helper';

export function getContentNode(bounty: Bounty): ReactNode {
  const deadline = nanosToDays(bounty.maxDeadline);

  return (
    <CardContent
      amount={bounty.amount}
      deadlineThreshold={deadline.join(' ')}
      token={bounty.token}
    />
  );
}
