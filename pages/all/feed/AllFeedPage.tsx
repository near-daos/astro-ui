import React from 'react';
import { NextPage } from 'next';
import { Proposal } from 'types/proposal';
import { Bounty } from 'components/cards/bounty-card/types';
import { ProposalsFilter } from 'features/member-home/types';
import { Feed } from 'features/feed/feed';

interface HomeProps {
  proposals: Proposal[];
  bounties: Bounty[];
  filter: ProposalsFilter;
}

const AllFeedPage: NextPage<HomeProps> = props => {
  return <Feed title="All Activity Feed" {...props} />;
};

export default AllFeedPage;
