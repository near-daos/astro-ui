import {
  Bounty,
  BountyStatus,
  BountyType,
  DeadlineUnit
} from 'components/cards/bounty-card/types';
import { CreateBountyInput } from 'features/bounty/dialogs/create-bounty-dialog/types';
import { TokenName } from 'components/cards/token-card';

const generateBounty = (
  claimedByMe = false,
  status: BountyStatus = 'In progress',
  amount = 100,
  group = 'Create a meme',
  slots = 3,
  claimed = 0,
  deadlineThreshold = 30,
  name = 'gatorade4.near'
) => ({
  type: 'Passed' as BountyType,
  token: TokenName.NEAR,
  status,
  amount,
  group,
  externalUrl: '',
  slots,
  claimed,
  claimedBy: [
    {
      name,
      datetime: '2021-09-04'
    }
  ],
  claimedByMe,
  deadlineThreshold,
  deadlineUnit: 'day' as DeadlineUnit,
  voteDetails: [
    { value: '50%', label: 'MEW holders' },
    { value: '50%', label: 'cool group' },
    { value: '1 person', label: 'Ombudspeople' }
  ],
  bondDetail: {
    value: 0.3,
    token: TokenName.NEAR
  }
});

const generateBounties = () => {
  const bounties: Bounty[] = [];
  const groups = [
    'Create a new set of illustration for our project',
    'Refactor the homepage code',
    'Curating our homepage with latest updates',
    'Create a meme',
    'Lorem ipsum'
  ];
  const statuses: BountyStatus[] = ['Open', 'In progress', 'Completed'];
  const names = ['anne', 'jonas', 'vicky', 'gatorade4'];

  for (let i = 1; i < 150; i += 1) {
    const slots = Math.floor(Math.random() * 10) + 5;
    const divider = Math.floor(Math.random() * 12) + 1;
    let claimed = slots % divider;

    if (claimed === slots) {
      claimed -= 1;
    }

    const amount = Math.floor(Math.random() * 300);
    const deadlineThreshold = Math.floor(Math.random() * 90) + 5;
    const status = statuses[(amount * 11) % 3];
    const group = groups[(amount * 7) % 4];
    const name = `${names[(slots * 13) % 4]}.near`;
    const bountyItem: Bounty = generateBounty(
      false,
      status,
      amount,
      group,
      slots,
      claimed,
      deadlineThreshold,
      name
    );

    bounties.push(bountyItem);
  }

  bounties.push(generateBounty(true));

  return bounties;
};

export const BOUNTIES_DATA = generateBounties();

export const CREATE_BOUNTY_INITIAL: CreateBountyInput = {
  token: 'NEAR',
  slots: 3,
  amount: 0,
  deadlineThreshold: 3,
  deadlineUnit: 'day',
  externalUrl: '',
  group: '',
  voteDetails: [
    { value: '50%', label: 'MEW holders' },
    { value: '50%', label: 'cool group' },
    { value: '1 person', label: 'Ombudspeople' }
  ],
  bondDetail: {
    value: 0.3,
    token: 'NEAR'
  }
};
