import { AxiosResponse } from 'axios';

import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
import { DraftProposal, DraftProposalFeedItem } from 'types/draftProposal';
import { PaginationResponse } from 'types/api';

import { API_MAPPERS, API_QUERIES } from 'services/sputnik/constants';
import { Authorization } from 'types/auth';
import { DAO } from 'types/dao';

import {
  DraftParams,
  DraftCommentParams,
  DraftComment,
  CreateDraftCommentData,
  EditDraftCommentData,
  CreateDraftParams,
} from './types';

export class DraftsService {
  private httpService = new HttpService({
    baseURL: `${
      process.browser
        ? window.APP_CONFIG.DRAFTS_API_URL
        : appConfig.DRAFTS_API_URL
    }/api/v1/`,
  });

  private useDraftsApiRelatedToDao = false;

  private useDraftCommentsApiRelatedToDao = false;

  constructor(
    httpService?: HttpService,
    useDraftsApiRelatedToDao?: boolean,
    useDraftCommentsApiRelatedToDao?: boolean
  ) {
    if (httpService) {
      this.httpService = httpService;
    }

    if (useDraftsApiRelatedToDao) {
      this.useDraftsApiRelatedToDao = true;
    }

    if (useDraftCommentsApiRelatedToDao) {
      this.useDraftCommentsApiRelatedToDao = true;
    }
  }

  // Draft
  public async getDrafts(
    params: DraftParams
  ): Promise<PaginationResponse<DraftProposalFeedItem[]>> {
    const { data } = await this.httpService.get<
      PaginationResponse<DraftProposalFeedItem[]>
    >('/draft-proposals', { params });

    return data;
  }

  public async createDraft(
    params: CreateDraftParams
  ): Promise<AxiosResponse<string>> {
    return this.httpService.post('/draft-proposals', params, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async getDraft(
    id: string,
    dao?: DAO,
    accountIdParams?: string
  ): Promise<DraftProposal | null> {
    try {
      const { data } = await this.httpService.get(`/draft-proposals/${id}`, {
        responseMapper: {
          name: API_MAPPERS.MAP_DRAFT_TO_PROPOSAL_DRAFT,
          params: {
            dao,
          },
        },
        params: {
          accountId: accountIdParams,
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async patchDraft(
    params: { id: string } & CreateDraftParams
  ): Promise<AxiosResponse<string>> {
    return this.httpService.patch(
      this.useDraftsApiRelatedToDao
        ? `/draft-proposals/${params.daoId}/${params.id}`
        : `/draft-proposals/${params.id}`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async deleteDraft(
    params: {
      id: string;
      daoId: string;
    } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.delete(
      this.useDraftsApiRelatedToDao
        ? `/draft-proposals/${params.daoId}/${params.id}`
        : `/draft-proposals/${params.id}`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async updateDraftView(
    params: { id: string; daoId: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(
      this.useDraftsApiRelatedToDao
        ? `/draft-proposals/${params.daoId}/${params.id}/view`
        : `/draft-proposals/${params.id}/view`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async updateDraftSave(
    params: {
      id: string;
      daoId: string;
      accountId: string;
    } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(
      this.useDraftsApiRelatedToDao
        ? `/draft-proposals/${params.daoId}/${params.id}/save`
        : `/draft-proposals/${params.id}/save`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async deleteDraftSave(
    params: {
      id: string;
      daoId: string;
      accountId: string;
    } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.delete(
      this.useDraftsApiRelatedToDao
        ? `/draft-proposals/${params.daoId}/${params.id}/save`
        : `/draft-proposals/${params.id}/save`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async updateDraftClose(
    params: {
      id: string;
      daoId: string;
      proposalId: string;
    } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(
      this.useDraftsApiRelatedToDao
        ? `/draft-proposals/${params.daoId}/${params.id}/close`
        : `/draft-proposals/${params.id}/close`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  // Draft comment
  public async getDraftComments(
    params: DraftCommentParams
  ): Promise<DraftComment[]> {
    const { data } = await this.httpService.get<AxiosResponse<DraftComment[]>>(
      '/draft-comments',
      { params }
    );

    return data.data;
  }

  public async createDraftComment(
    data: CreateDraftCommentData & { daoId: string } & Authorization
  ): Promise<AxiosResponse<DraftComment>> {
    return this.httpService.post('/draft-comments', data, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async editDraftComment(
    data: EditDraftCommentData & {
      daoId: string;
      draftId: string;
    } & Authorization
  ): Promise<AxiosResponse<DraftComment>> {
    return this.httpService.patch(
      this.useDraftCommentsApiRelatedToDao
        ? `/draft-comments/${data.daoId}/${data.draftId}/${data.id}`
        : `/draft-comments/${data.id}`,
      data,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async deleteDraftComment(
    params: { id: string; daoId: string; draftId: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.delete(
      this.useDraftCommentsApiRelatedToDao
        ? `/draft-comments/${params.daoId}/${params.draftId}/${params.id}`
        : `/draft-comments/${params.id}`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async likeDraftComment(
    params: { id: string; daoId: string; draftId: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(
      this.useDraftCommentsApiRelatedToDao
        ? `/draft-comments/${params.daoId}/${params.draftId}/${params.id}/like`
        : `/draft-comments/${params.id}/like`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async removeLikeDraftComment(
    params: { id: string; daoId: string; draftId: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(
      this.useDraftCommentsApiRelatedToDao
        ? `/draft-comments/${params.daoId}/${params.draftId}/${params.id}/remove-like`
        : `/draft-comments/${params.id}/remove-like`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async dislikeDraftComment(
    params: { id: string; daoId: string; draftId: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(
      this.useDraftCommentsApiRelatedToDao
        ? `/draft-comments/${params.daoId}/${params.draftId}/${params.id}/dislike`
        : `/draft-comments/${params.id}/dislike`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  public async removeDislikeDraftComment(
    params: { id: string; daoId: string; draftId: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(
      this.useDraftCommentsApiRelatedToDao
        ? `/draft-comments/${params.daoId}/${params.draftId}/${params.id}/remove-dislike`
        : `/draft-comments/${params.id}/remove-dislike`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }
}
