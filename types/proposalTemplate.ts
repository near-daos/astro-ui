import { DAO } from 'types/dao';
import { CustomFcTemplatePayload } from 'types/proposal';

export type ProposalTemplateInput = {
  accountId: string;
  publicKey: string;
  signature: string;
  name: string;
  description: string;
  isEnabled: boolean;
  config: CustomFcTemplatePayload;
};

export type TemplateUpdatePayload = Pick<
  ProposalTemplate,
  'daoId' | 'config' | 'isEnabled' | 'name' | 'description'
>;

export type ProposalTemplate = {
  id?: string;
  daoId: string;
  dao: DAO;
  name: string;
  description?: string;
  isEnabled: boolean;
  config: CustomFcTemplatePayload;
  updatedAt?: string;
};

export type SharedProposalTemplate = {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  config: CustomFcTemplatePayload;
  createdAt: string;
  updatedAt: string;
  daoCount: number;
  daos?: { id: string }[];
};
