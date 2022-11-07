import { HttpService } from 'services/HttpService';
import {
  OpenSearchResponse,
  SearchParams,
  SearchResponseIndex,
} from 'services/SearchService/types';
import { SearchResultsData } from 'types/search';
import { configService } from 'services/ConfigService';
import { AxiosResponse, CancelToken } from 'axios';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { DaoFeedItem } from 'types/dao';
import { ProposalComment, ProposalFeedItem } from 'types/proposal';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { mapIndexToResultKey } from 'services/SearchService/helpers';

export class SearchService {
  private readonly httpService;

  constructor() {
    const { appConfig } = configService.get();

    this.httpService = new HttpService({
      baseURL: appConfig.SEARCH_API_URL,
    });
  }

  async fetchResultsByIndex(
    query: string,
    index: SearchResponseIndex,
    size: number | undefined,
    field: string | undefined,
    cancelToken: CancelToken | undefined,
    from = 0
  ): Promise<AxiosResponse<OpenSearchResponse | null>> {
    return this.httpService.post<
      unknown,
      AxiosResponse<OpenSearchResponse | null>
    >(
      `/${index}/_search`,
      {
        query: {
          simple_query_string: {
            query,
            fields: field ? [field] : [],
          },
        },
        size,
        from,
      },
      {
        cancelToken,
      }
    );
  }

  public async search(params: SearchParams): Promise<SearchResultsData | null> {
    if (!this.httpService) {
      return null;
    }

    try {
      if (params.index) {
        const resRaw = await this.fetchResultsByIndex(
          params.query,
          params.index as SearchResponseIndex,
          params.size,
          params.field,
          params.cancelToken
        );

        const res = mapOpenSearchResponseToSearchResult(
          params.query,
          params.index as SearchResponseIndex,
          resRaw.data
        );

        const resultKey = mapIndexToResultKey(
          params.index as SearchResponseIndex
        );

        return {
          query: params.query,
          daos: [],
          proposals: [],
          drafts: [],
          comments: [],
          members: [],
          bounties: [],
          nfts: [],
          draftProposalComments: [],
          [resultKey]: res.data,
          totals: {
            daos: 0,
            proposals: 0,
            drafts: 0,
            comments: 0,
            nfts: 0,
            draftProposalComments: 0,
            [resultKey]: res.total,
          },
          opts: {
            query: params.query,
            field: params.field,
            index: params.index,
          },
        };
      }

      const [daos, proposals, drafts, comments] = await Promise.all([
        this.fetchResultsByIndex(
          params.query,
          SearchResponseIndex.DAO,
          params.size,
          params.field,
          params.cancelToken
        ),
        this.fetchResultsByIndex(
          params.query,
          SearchResponseIndex.PROPOSAL,
          params.size,
          params.field,
          params.cancelToken
        ),
        this.fetchResultsByIndex(
          params.query,
          SearchResponseIndex.DRAFT_PROPOSAL,
          params.size,
          params.field,
          params.cancelToken
        ),
        this.fetchResultsByIndex(
          params.query,
          SearchResponseIndex.COMMENT,
          params.size,
          params.field,
          params.cancelToken
        ),
      ]);

      const daosRes = mapOpenSearchResponseToSearchResult(
        params.query,
        SearchResponseIndex.DAO,
        daos.data
      );

      const proposalsRes = mapOpenSearchResponseToSearchResult(
        params.query,
        SearchResponseIndex.PROPOSAL,
        proposals.data
      );

      const draftsRes = mapOpenSearchResponseToSearchResult(
        params.query,
        SearchResponseIndex.DRAFT_PROPOSAL,
        drafts.data
      );

      const commentsRes = mapOpenSearchResponseToSearchResult(
        params.query,
        SearchResponseIndex.COMMENT,
        comments.data
      );

      return {
        query: params.query,
        daos: daosRes.data as DaoFeedItem[],
        proposals: proposalsRes.data as ProposalFeedItem[],
        drafts: draftsRes.data as DraftProposalFeedItem[],
        comments: commentsRes.data as ProposalComment[],
        bounties: [],
        members: [],
        nfts: [],
        draftProposalComments: [],
        totals: {
          daos: daosRes.total,
          proposals: proposalsRes.total,
          drafts: draftsRes.total,
          comments: commentsRes.total,
          nfts: 0,
          draftProposalComments: 0,
        },
        opts: {
          query: params.query,
          field: params.field,
          index: params.index,
        },
      };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async searchPaginated(
    params: SearchParams & { from: number }
  ): Promise<AxiosResponse<OpenSearchResponse | null> | null> {
    if (!this.httpService) {
      return null;
    }

    try {
      return await this.fetchResultsByIndex(
        params.query,
        params.index as SearchResponseIndex,
        params.size,
        params.field,
        params.cancelToken,
        params.from
      );
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
