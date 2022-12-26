import { ProposalTemplate } from 'types/proposalTemplate';
import { ProposalTemplateIndex } from 'services/SearchService/types';

export function mapProposalTemplateIndexToProposalTemplate(
  index: ProposalTemplateIndex
): ProposalTemplate {
  return {
    id: index.id,
    daoId: index.daoId,
    // dao: DAO;
    name: index.name,
    description: index.description,
    isEnabled: true,
    config: index.config,
    updatedAt: new Date(index.updatedAt).toISOString(),
  };
}
