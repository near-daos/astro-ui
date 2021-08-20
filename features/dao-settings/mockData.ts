// todo - fetch it from store?
import { Token } from 'features/types';

export const mockData = {
  accountName: 'meowzers.sputnikdao.near',
  name: 'meowzers',
  purpose:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis eleifend habitant laoreet ornare vitae consequat. Potenti ut urna, ultricies elit nam. Feugiat porta elit ultricies eu mollis. Faucibus mauris faucibus aliquam non. ',
  links: [],
  createProposalBond: 1.1,
  proposalExpireTime: 7,
  claimBountyBond: 2,
  unclaimBountyTime: 3,
  details: '',
  externalLink: ''
};

export const voteDetails = {
  voteDetails: [
    { value: '50%', label: 'MEW holders' },
    { value: '50%', label: 'cool group' },
    { value: '1 person', label: 'Ombudspeople' }
  ],
  bondDetail: {
    value: 0.3,
    token: 'NEAR' as Token
  }
};
