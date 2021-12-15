import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { PaginationResponse } from 'types/api';
import { NotificationDTO } from 'types/notification';

import { httpService } from 'services/HttpService';
import { SputnikNearService } from 'services/sputnik';

class NotificationsServiceClass {
  private readonly httpService = httpService;

  private readonly sputnikNearService = SputnikNearService;

  public async getNotifications(): Promise<
    PaginationResponse<NotificationDTO[]>
  > {
    // use vhorin-dev.testnet account id to 100% get data
    // const accountId = 'vhorin-dev.testnet';
    const accountId = this.sputnikNearService.getAccountId();

    if (!accountId) {
      return Promise.resolve({
        count: 0,
        total: 0,
        page: 0,
        pageCount: 0,
        data: [],
      });
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

    return response.data;
  }
}

export const NotificationsService = new NotificationsServiceClass();
