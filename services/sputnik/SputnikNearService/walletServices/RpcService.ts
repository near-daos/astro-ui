import { AccountView } from 'near-api-js/lib/providers/provider';
import { Provider } from 'near-api-js/lib/providers';
import { RpcCallResult } from 'services/sputnik/SputnikNearService/walletServices/types';

export class RpcService {
  private provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  viewAccount(accountId: string): Promise<AccountView> {
    return this.provider.query<AccountView>({
      request_type: 'view_account',
      account_id: accountId,
      finality: 'final',
    });
  }

  async contractCall<T>(
    accountId: string,
    methodName: string,
    argsAsBase64: string
  ): Promise<T> {
    try {
      const { result } = await this.provider.query<RpcCallResult>({
        request_type: 'call_function',
        account_id: accountId,
        method_name: methodName,
        args_base64: argsAsBase64,
        finality: 'final',
      });

      return JSON.parse(Buffer.from(result).toString()) as T;
    } catch (e) {
      return Promise.reject();
    }
  }
}
