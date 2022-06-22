import { AxiosResponse } from 'axios';
import omit from 'lodash/omit';

import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
import { DraftProposal, DraftProposalFeedItem } from 'types/draftProposal';
import { PaginationResponse } from 'types/api';
import { AuthorizedRequest } from 'types/proposal';

import {
  DraftParams,
  DraftCommentParams,
  DraftComment,
  DraftBaseParams,
  CreateDraftCommentData,
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
    data: DraftProposal & AuthorizedRequest
  ): Promise<AxiosResponse<DraftProposal>> {
    const { accountId, publicKey, signature } = data;

    const buff = Buffer.from(`${accountId}|${publicKey}|${signature}`);

    const body = omit(data, ['accountId', 'publicKey', 'signature']);

    const headers = {
      'X-Authorization': `Bearer ${buff.toString('base64')}`,
    };

    body.hashtags = body.hashtags.map(hashtag =>
      typeof hashtag !== 'string' ? hashtag.value : hashtag
    );

    return this.httpService.post('/draft-proposals', body, { headers });
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
  ): Promise<AxiosResponse<PaginationResponse<DraftComment>>> {
    return this.httpService.get('/draft-comments', { params });
  }

  public async createDraftComment(
    data: CreateDraftCommentData
  ): Promise<AxiosResponse<DraftComment>> {
    return this.httpService.post('/draft-comments', data);
  }

  public async likeDraftComment(id: string): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(`/draft-comments/${id}/like`);
  }

  public async unlikeDraftComment(id: string): Promise<AxiosResponse<boolean>> {
    return this.httpService.post(`/draft-comments/${id}/unlike`);
  }

  // Drafts hashtags
  public async getDraftHashtags(
    params: DraftBaseParams
  ): Promise<AxiosResponse<string>> {
    return this.httpService.get('/draft-hashtags', { params });
  }
}
