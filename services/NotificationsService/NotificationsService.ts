import { AxiosResponse } from 'axios';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import {
  Notification,
  NotificationDTO,
  UpdateNotificationParams,
  UpdateNotificationSettingsParams,
  UpdateNotificationsParams,
} from 'types/notification';
import { PaginationResponse } from 'types/api';
import { PkAndSignMethod } from 'context/AuthContext';

import { httpService } from 'services/HttpService';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';
import {
  UserContacts,
  NotificationSettingDTO,
} from 'services/NotificationsService/types';

import { logger } from 'utils/logger';

class NotificationsServiceClass {
  private readonly httpService = httpService;

  public async getUserContactConfig(accountId?: string): Promise<UserContacts> {
    if (accountId) {
      const result = await this.httpService.get<UserContacts>(
        `account/${accountId}`
      );

      return result.data;
    }

    return Promise.resolve({
      accountId: '',
      email: '',
      isEmailVerified: false,
      phoneNumber: '',
      isPhoneVerified: false,
    });
  }

  public async sendContact(
    accountId: string,
    contact: string,
    getPublicKeyAndSignature: PkAndSignMethod,
    isEmail: boolean
  ): Promise<boolean> {
    const { publicKey, signature } = await getPublicKeyAndSignature();

    try {
      const urlPart = isEmail ? 'email' : 'phone';

      await this.httpService.post(`account/${urlPart}`, {
        [isEmail ? 'email' : 'phoneNumber']: contact,
        accountId,
        publicKey,
        signature,
      });

      await this.httpService.post(`account/${urlPart}/send-verification`, {
        accountId,
        publicKey,
        signature,
      });
    } catch (e) {
      logger.error(e);

      return false;
    }

    return true;
  }

  public async verifyContact(
    accountId: string,
    code: string,
    getPublicKeyAndSignature: PkAndSignMethod,
    isEmail: boolean
  ) {
    const { publicKey, signature } = await getPublicKeyAndSignature();

    try {
      const urlPart = isEmail ? 'email' : 'phone';

      await this.httpService.post(`account/${urlPart}/verify`, {
        code,
        accountId,
        publicKey,
        signature,
      });

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }

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

  public async getNotificationsCount(
    accountId: string | undefined
  ): Promise<number> {
    const response = await this.httpService.get<{
      accountId: string;
      unreadCount: number;
    }>(`/account-notification-status/${accountId}`);

    return response.data.unreadCount;
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
