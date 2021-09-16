export type Token = 'NEAR';

export type Vote = 'Yes' | 'No' | 'Trash';

export type VoteDetail = {
  limit: string;
  label: string;
  data?: VoteValue[];
};

export type VoteValue = {
  vote: Vote;
  percent: number;
};

export type VoterDetail = {
  name: string;
  vote: Vote;
};

export type BondDetail = {
  value: number;
  token: Token;
};
