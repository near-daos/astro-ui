import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { PaginationResponse } from 'types/api';
import {
  Notification,
  NotificationDTO,
  UpdateNotificationParams,
} from 'types/notification';

import { httpService } from 'services/HttpService';
import { SputnikNearService } from 'services/sputnik';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';

class NotificationsServiceClass {
  private readonly httpService = httpService;

  private readonly sputnikNearService = SputnikNearService;

  public async getNotifications(
    showArchived: boolean
  ): Promise<Notification[]> {
    // use vhorin-dev.testnet account id to 100% get data
    // const accountId = 'vhorin-dev.testnet';
    const accountId = this.sputnikNearService.getAccountId();

    if (!accountId) {
      return Promise.resolve([]);
    }

    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'accountId',
        operator: '$eq',
        value: accountId,
      })
      .setFilter({
        field: 'isArchived',
        operator: '$eq',
        value: showArchived,
      })
      .query();

    const response = await this.httpService.get<
      PaginationResponse<NotificationDTO[]>
    >(`/account-notifications?${queryString}`);

    return mapNotificationDtoToNotification(response.data.data);
  }

  public async updateNotification(
    id: string,
    params: UpdateNotificationParams
  ): Promise<NotificationDTO> {
    const response = await this.httpService.patch<
      UpdateNotificationParams,
      NotificationDTO
    >(`/account-notifications/${id}`, params);

    return response;
  }
}

export const NotificationsService = new NotificationsServiceClass();
