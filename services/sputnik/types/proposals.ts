import { ProposalCategories, ProposalsFeedStatuses } from 'types/proposal';
import {
  ProposalFilterOptions,
  ProposalFilterStatusOptions,
} from 'types/memberHome';
import { BaseParams } from './api';
import { DaosParams } from './dao';

export type ProposalsQueries = {
  status?: ProposalsFeedStatuses;
  category?: ProposalCategories;
  proposers?: string;
};

export type ActiveProposalsParams = {
  daoIds: string[];
} & BaseParams;

export type FilteredProposalsParams = {
  proposalFilter?: ProposalFilterOptions;
  status?: ProposalFilterStatusOptions;
} & DaosParams;

export type ProposalsListParams = {
  accountId?: string;
  ids?: string[];
} & ProposalsQueries &
  DaosParams &
  BaseParams;
