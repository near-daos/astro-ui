import { AxiosResponse } from 'axios';

import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
import { DraftProposal, DraftProposalFeedItem } from 'types/draftProposal';
import { PaginationResponse } from 'types/api';

import { API_QUERIES } from 'services/sputnik/constants';
import { Authorization } from 'types/auth';

import {
  DraftParams,
  DraftCommentParams,
  DraftComment,
  DraftBaseParams,
  CreateDraftCommentData,
  EditDraftCommentData,
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
    params: DraftParams & {
      daoId: string;
      accountId: string;
      searchInput?: string;
    }
  ): Promise<PaginationResponse<DraftProposalFeedItem[]>> {
    const { data } = await this.httpService.get<
      PaginationResponse<DraftProposalFeedItem[]>
    >('/draft-proposals', { params });

    return data;
  }

  public async createDraft(
    data: DraftProposal
  ): Promise<AxiosResponse<DraftProposal>> {
    return this.httpService.post('/draft-proposals', data);
  }

  public async getDraft(
    id: string,
    accountId?: string
  ): Promise<AxiosResponse<DraftProposal>> {
    const { data } = await this.httpService.get(`/draft-proposals/${id}`, {
      params: {
        accountId,
      },
    });

    return data;
  }

  public async patchDraft(data: DraftProposal): Promise<AxiosResponse<string>> {
    return this.httpService.patch(`/draft-proposals/${data.id}`, data);
  }

  public async deleteDraft(id: string): Promise<AxiosResponse<boolean>> {
    return this.httpService.delete(`/draft-proposals/${id}`);
  }

  public async updateDraftView(id: string): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(`/draft-proposals/${id}/view`);
  }

  public async updateDraftSave(id: string): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(`/draft-proposals/${id}/save`);
  }

  public async updateDraftClose(id: string): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(`/draft-proposals/${id}/close`);
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
