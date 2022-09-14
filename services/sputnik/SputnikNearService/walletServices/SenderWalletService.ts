import { ConnectedWalletAccount, providers, Signer } from 'near-api-js';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import {
  getSignature,
  isError,
  isExtensionError,
} from 'services/sputnik/SputnikNearService/walletServices/helpers';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  SenderWalletInstance,
  Transaction,
  WalletMeta,
  WalletService,
} from 'services/sputnik/SputnikNearService/walletServices/types';
import { WalletType } from 'types/config';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { httpService } from 'services/HttpService';
import { KeyStore } from 'near-api-js/lib/key_stores';

import { RpcService } from 'services/sputnik/SputnikNearService/walletServices/RpcService';
import { NearConfig } from 'config/near';
import { AccountView } from 'near-api-js/lib/providers/provider';
import { PkAndSignature } from 'context/WalletContext/types';
import { configService } from 'services/ConfigService';

import { SENDER_WALLET_METADATA } from './constants';

export class SenderWalletService implements WalletService {
  private readonly walletInstance: SenderWalletInstance;

  private readonly walletType = WalletType.SENDER;

  private readonly rpcService: RpcService;

  constructor(walletInstance: SenderWalletInstance, nearConfig: NearConfig) {
    this.walletInstance = walletInstance;
    this.rpcService = new RpcService(
      new providers.JsonRpcProvider(nearConfig.nodeUrl)
    );
  }

  viewAccount(accountId: string): Promise<AccountView> {
    return this.rpcService.viewAccount(accountId);
  }

  contractCall<T>(
    accountId: string,
    methodName: string,
    argsAsBase64: string
  ): Promise<T> {
    return this.rpcService.contractCall(accountId, methodName, argsAsBase64);
  }

  isSignedIn(): Promise<boolean> {
    const wallet = this.walletInstance;
    const isSigned = wallet.isSignedIn() && !!wallet.authData.accessKey;

    return Promise.resolve(isSigned);
  }

  logout(): Promise<void> {
    return Promise.resolve(this.walletInstance.signOut());
  }

  async signIn(contractId: string): Promise<boolean> {
    const result = await this.walletInstance.requestSignIn({
      contractId,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (result.error) {
      return Promise.reject(new Error('sigh on rejected'));
    }

    return Promise.resolve(true);
  }

  getAccount(): ConnectedWalletAccount {
    return this.walletInstance.account();
  }

  getAccountId(): Promise<string> {
    return Promise.resolve(this.walletInstance.accountId);
  }

  async sendTransactions(
    transactions: Transaction[]
  ): Promise<FinalExecutionOutcome[]> {
    const result = await this.walletInstance.requestSignTransactions({
      transactions,
    });

    if (isExtensionError(result)) {
      throw new Error(result.error);
    }

    if (isError(result.response)) {
      throw new Error(result.response.error.kind.ExecutionError);
    }

    const transactionHashes = result.response[0].transaction.hash;
    const signerId = result.response[0].transaction.signer_id;

    try {
      await httpService.get(
        `/transactions/wallet/callback/${signerId}?transactionHashes=${transactionHashes}&noRedirect=true`
      );
    } catch (e) {
      console.error(e);
    }

    return result.response;
  }

  async functionCall(
    props: FunctionCallOptions
  ): Promise<FinalExecutionOutcome[]> {
    const tx = {
      receiverId: props.contractId,
      actions: [
        {
          methodName: props.methodName,
          args: { ...props.args },
          gas: props.gas?.toString(),
          deposit: props.attachedDeposit
            ? props.attachedDeposit?.toString()
            : '0',
        },
      ],
    };
    const result = await this.walletInstance.signAndSendTransaction(tx);

    if (isExtensionError(result)) {
      throw new Error(result.error);
    }

    if (isError(result.response)) {
      throw new Error(result.response.error.kind.ExecutionError);
    }

    const transactionHashes = result.response[0].transaction.hash;
    const signerId = result.response[0].transaction.signer_id;

    try {
      await httpService.get(
        `/transactions/wallet/callback/${signerId}?transactionHashes=${transactionHashes}&noRedirect=true`
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }

    return result.response;
  }

  getWalletType(): WalletType {
    return this.walletType;
  }

  async sendMoney(
    receiverId: string,
    amount: number
  ): Promise<FinalExecutionOutcome[]> {
    const parsedAmount = parseNearAmount(amount.toString());

    const result = await this.walletInstance.sendMoney({
      receiverId,
      amount: parsedAmount ?? '',
    });

    if (isError(result.response)) {
      throw new Error(result.response.error.kind.ExecutionError);
    }

    return result.response;
  }

  // eslint-disable-next-line class-methods-use-this
  getAvailableAccounts(): Promise<string[]> {
    return Promise.resolve([this.walletInstance.accountId]);
  }

  // eslint-disable-next-line class-methods-use-this
  walletMeta(): WalletMeta {
    return SENDER_WALLET_METADATA;
  }

  getKeyStore(): KeyStore {
    // eslint-disable-next-line no-underscore-dangle
    return this.getAccount().walletConnection._keyStore;
  }

  async getPkAndSignatureFromLocalKeyStore(): Promise<PkAndSignature | null> {
    const accountId = await this.getAccountId();

    const { nearConfig } = configService.get();

    const signer = window.near?.account()?.connection?.signer;

    if (!signer) {
      return null;
    }

    const { keyStore } = signer as { keyStore: KeyStore } & Signer;

    const keyPair = await keyStore.getKey(nearConfig.networkId, accountId);

    const publicKey = keyPair.getPublicKey();

    if (!publicKey) {
      return null;
    }

    return {
      publicKey: publicKey.toString(),
      signature: await getSignature(keyPair),
    };
  }

  getPkAndSignature(): Promise<PkAndSignature | null> {
    return this.getPkAndSignatureFromLocalKeyStore();
  }
}
