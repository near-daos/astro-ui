export type Token = 'NEAR';

export type CreatePayoutInput = {
  token: Token;
  amount: number;
  recipient: string;
  payoutDetail: string;
  externalUrl: string;
  voteDetails: string;
};
