import { ProposalCategories, ProposalStatuses } from 'types/proposal';
import {
  ProposalFilterOptions,
  ProposalFilterStatusOptions,
} from 'features/member-home/types';
import { BaseParams } from './api';
import { DaosParams } from './dao';

export type ProposalsQueries = {
  status?: ProposalStatuses;
  category?: ProposalCategories;
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
} & ProposalsQueries &
  DaosParams &
  BaseParams;
