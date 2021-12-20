import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { PaginationResponse } from 'types/api';
import { Notification, NotificationDTO } from 'types/notification';

import { httpService } from 'services/HttpService';
import { SputnikNearService } from 'services/sputnik';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';

class NotificationsServiceClass {
  private readonly httpService = httpService;

  private readonly sputnikNearService = SputnikNearService;

  public async getNotifications(): Promise<Notification[]> {
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
        value: false,
      })
      .query();

    const response = await this.httpService.get<
      PaginationResponse<NotificationDTO[]>
    >(`/account-notifications?${queryString}`);

    return mapNotificationDtoToNotification(response.data.data);
  }
}

export const NotificationsService = new NotificationsServiceClass();
