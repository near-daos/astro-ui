import { SearchResponseIndex } from 'services/SearchService/types';

export function mapIndexToResultKey(index: SearchResponseIndex): string {
  switch (index) {
    case SearchResponseIndex.DAO: {
      return 'daos';
    }
    case SearchResponseIndex.PROPOSAL: {
      return 'proposals';
    }
    case SearchResponseIndex.DRAFT_PROPOSAL: {
      return 'drafts';
    }

    case SearchResponseIndex.COMMENT:
    default: {
      return 'comments';
    }
  }
}
