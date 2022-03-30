import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { AxiosResponse } from 'axios';

import { PaginationResponse } from 'types/api';
import {
  Notification,
  NotificationDTO,
  UpdateNotificationParams,
  UpdateNotificationSettingsParams,
  UpdateNotificationsParams,
} from 'types/notification';

import { httpService } from 'services/HttpService';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';
import { NotificationSettingDTO } from 'services/NotificationsService/types';

class NotificationsServiceClass {
  private readonly httpService = httpService;

  public async getNotifications(
    showArchived: boolean,
    accountId: string | undefined,
    {
      offset = 0,
      limit = 3000,
      sort = 'createdAt,DESC',
      daoIds,
    }: {
      offset: number;
      limit: number;
      sort: string;
      daoIds: string[] | null;
    }
  ): Promise<PaginationResponse<Notification[]>> {
    if (!accountId) {
      return Promise.resolve({
        data: [],
        page: 0,
        count: 0,
        pageCount: 0,
        total: 0,
      });
    }

    const queryBuilder = RequestQueryBuilder.create();

    queryBuilder
      .setFilter({
        field: 'accountId',
        operator: '$eq',
        value: accountId,
      })
      .setFilter({
        field: 'isArchived',
        operator: '$eq',
        value: showArchived,
      });

    if (daoIds) {
      queryBuilder.setFilter({
        field: 'notification.daoId',
        operator: '$in',
        value: daoIds,
      });
    }

    const queryString = queryBuilder.query();

    const response = await this.httpService.get<
      PaginationResponse<NotificationDTO[]>
    >(`/account-notifications?${queryString}`, {
      params: {
        offset,
        limit,
        sort,
      },
    });

    return {
      page: response.data.page,
      count: response.data.count,
      pageCount: response.data.pageCount,
      total: response.data.total,
      data: mapNotificationDtoToNotification(response.data.data),
    };
  }

  public async updateNotification(
    id: string,
    params: UpdateNotificationParams
  ): Promise<Notification> {
    const response = await this.httpService.patch<
      UpdateNotificationParams,
      AxiosResponse<NotificationDTO>
    >(`/account-notifications/${id}`, params);

    return mapNotificationDtoToNotification([response.data])[0];
  }

  public async readAllNotifications(
    params: UpdateNotificationsParams
  ): Promise<string> {
    return this.httpService.patch<UpdateNotificationsParams, string>(
      '/account-notifications/read-all',
      params
    );
  }

  public async archiveAllNotifications(
    params: UpdateNotificationsParams
  ): Promise<string> {
    return this.httpService.patch<UpdateNotificationsParams, string>(
      '/account-notifications/archive-all',
      params
    );
  }

  public async getNotificationsSettings(
    accountId: string,
    daosIds?: string[]
  ): Promise<NotificationSettingDTO[]> {
    if (daosIds && daosIds.length === 0) {
      return [];
    }

    const offset = 0;
    const limit = 1000;
    const sort = 'createdAt,DESC';

    const query = RequestQueryBuilder.create().setFilter({
      field: 'accountId',
      operator: '$eq',
      value: accountId,
    });

    if (!daosIds) {
      query.setFilter({
        field: 'daoId',
        operator: '$isnull',
      });
    }

    const queryString = query.query();

    const response = await this.httpService.get<
      PaginationResponse<NotificationSettingDTO[]>
    >(`/notification-settings?${queryString}`, {
      params: {
        offset,
        limit,
        sort,
      },
    });

    return response.data.data;
  }

  public async updateNotificationSettings(
    params: UpdateNotificationSettingsParams
  ): Promise<NotificationSettingDTO> {
    return this.httpService.post<
      UpdateNotificationSettingsParams,
      NotificationSettingDTO
    >(`/notification-settings`, params);
  }
}

export const NotificationsService = new NotificationsServiceClass();
