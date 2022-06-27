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
  DraftBaseParams,
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

  constructor(httpService?: HttpService) {
    if (httpService) {
      this.httpService = httpService;
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
    data: CreateDraftParams
  ): Promise<AxiosResponse<string>> {
    return this.httpService.post('/draft-proposals', data, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async getDraft(
    id: string,
    dao?: DAO,
    accountId?: string
  ): Promise<DraftProposal> {
    const { data } = await this.httpService.get(`/draft-proposals/${id}`, {
      responseMapper: {
        name: API_MAPPERS.MAP_DRAFT_TO_PROPOSAL_DRAFT,
        params: {
          dao,
        },
      },
      params: {
        accountId,
      },
    });

    return data;
  }

  public async patchDraft(
    params: { id: string } & CreateDraftParams
  ): Promise<AxiosResponse<string>> {
    return this.httpService.patch(`/draft-proposals/${params.id}`, params, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async deleteDraft(
    params: {
      id: string;
    } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.delete(`/draft-proposals/${params.id}`, params, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async updateDraftView(
    params: { id: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(`/draft-proposals/${params.id}/view`, params, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async updateDraftSave(
    params: {
      id: string;
    } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(`/draft-proposals/${params.id}/save`, params, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async updateDraftClose(
    params: {
      id: string;
    } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(
      `/draft-proposals/${params.id}/close`,
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

    return data.data.filter(item => !item.replyTo);
  }

  public async createDraftComment(
    data: CreateDraftCommentData & Authorization
  ): Promise<AxiosResponse<DraftComment>> {
    return this.httpService.post('/draft-comments', data, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async editDraftComment(
    data: EditDraftCommentData & Authorization
  ): Promise<AxiosResponse<DraftComment>> {
    return this.httpService.patch(`/draft-comments/${data.id}`, data, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async deleteDraftComment(
    params: { id: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.delete(`/draft-comments/${params.id}`, params, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async likeDraftComment(
    params: { id: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(`/draft-comments/${params.id}/like`, params, {
      queryRequest: {
        name: API_QUERIES.ADD_AUTHORIZATION,
      },
    });
  }

  public async unlikeDraftComment(
    params: { id: string } & Authorization
  ): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(
      `/draft-comments/${params.id}/unlike`,
      params,
      {
        queryRequest: {
          name: API_QUERIES.ADD_AUTHORIZATION,
        },
      }
    );
  }

  // Drafts hashtags
  public async getDraftHashtags(
    params: DraftBaseParams
  ): Promise<AxiosResponse<string>> {
    return this.httpService.get('/draft-hashtags', { params });
  }
}
