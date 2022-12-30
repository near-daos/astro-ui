import { SharedProposalTemplateIndex } from 'services/SearchService/types';
import { SharedProposalTemplate } from 'types/proposalTemplate';

export function mapSharedProposalTemplateIndexToSharedProposalTemplate(
  index: SharedProposalTemplateIndex,
  daosIds: string[]
): SharedProposalTemplate {
  return {
    id: index.id,
    name: index.name,
    description: index.description,
    createdBy: index.createdBy,
    config: index.config,
    createdAt: new Date(index.createdAt).toISOString(),
    updatedAt: new Date(index.updatedAt).toISOString(),
    daoCount: index.daoCount,
    daos: daosIds.map(item => ({ id: item })),
  };
}
