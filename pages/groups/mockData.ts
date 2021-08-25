import { Token } from 'components/cards/member-card/MemberCard';
import { GroupFormType } from 'features/groups/types';

type Member = {
  id: string;
  name: string;
  groups: string[];
  tokens: Token;
  votes: number;
} & { [key: string]: string | string[] | Token | number };

export const members: Member[] = [
  {
    id: '1',
    name: 'atos.near',
    groups: ['MEW holders', 'Ombudspeople', 'NEAR holders'],
    tokens: {
      type: 'NEAR',
      value: 18,
      percent: 14
    },
    votes: 12
  },
  {
    id: '2',
    name: 'portos.near',
    groups: ['MEW holders', 'Ombudspeople'],
    tokens: {
      type: 'NEAR',
      value: 24,
      percent: 30
    },
    votes: 7
  },
  {
    id: '3',
    name: 'aramis.near',
    groups: ['Ombudspeople', 'NEAR holders'],
    tokens: {
      type: 'MEW',
      value: 345,
      percent: 39
    },
    votes: 44
  },
  {
    id: '4',
    name: 'dartagnan.near',
    groups: ['MEW holders', 'NEAR holders'],
    tokens: {
      type: 'MEW',
      value: 56,
      percent: 34
    },
    votes: 78
  },
  {
    id: '5',
    name: 'roshfor.near',
    groups: ['MEW holders'],
    tokens: {
      type: 'MEW',
      value: 33,
      percent: 35
    },
    votes: 134
  },
  {
    id: '6',
    name: 'detreville.near',
    groups: ['MEW holders', 'NEAR holders', 'Ombudspeople'],
    tokens: {
      type: 'MEW',
      value: 6,
      percent: 34
    },
    votes: 12
  },
  {
    id: '7',
    name: 'rishellie.near',
    groups: ['MEW holders', 'NEAR holders', 'Ombudspeople'],
    tokens: {
      type: 'MEW',
      value: 98,
      percent: 39
    },
    votes: 118
  }
];

export const groupColor = {
  'MEW holders': 'violet',
  'NEAR holders': 'turqoise',
  Ombudspeople: 'orange'
} as { [key: string]: string };

export const groupPopupData = {
  initialValues: {
    groupType: GroupFormType.REMOVE_FROM_GROUP,
    groups: [],
    voteDetails: [
      { value: '50%', label: 'MEW holders' },
      { value: '50%', label: 'cool group' },
      { value: '1 person', label: 'Ombudspeople' }
    ],
    bondDetail: {
      value: 0.3,
      token: 'NEAR'
    }
  }
};
