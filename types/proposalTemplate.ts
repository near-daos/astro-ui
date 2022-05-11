import { DAO } from 'types/dao';
import { CustomFcTemplatePayload } from 'types/proposal';

export type ProposalTemplateInput = {
  accountId: string;
  publicKey: string;
  signature: string;
  name: string;
  isEnabled: boolean;
  config: CustomFcTemplatePayload;
};

export type TemplateUpdatePayload = Pick<
  ProposalTemplate,
  'daoId' | 'config' | 'isEnabled' | 'name'
>;

export type ProposalTemplate = {
  id?: string;
  daoId: string;
  dao: DAO;
  name: string;
  isEnabled: boolean;
  config: CustomFcTemplatePayload;
  updatedAt?: string;
};
