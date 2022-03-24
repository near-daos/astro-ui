import { ConnectedWalletAccount } from 'near-api-js';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { KeyPairEd25519 } from 'near-api-js/lib/utils';
import { getSignature } from 'services/sputnik/SputnikNearService/services/helpers';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  SenderWalletInstance,
  WalletService,
  Transaction,
} from 'services/sputnik/SputnikNearService/services/types';
import { WalletType } from 'types/config';
import BN from 'bn.js';
import { ACCOUNT_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';
import { CookieService } from 'services/CookieService';
import { configService } from 'services/ConfigService';

export class SenderWalletService implements WalletService {
  private readonly walletInstance: SenderWalletInstance;

  private readonly walletType = WalletType.SENDER;

  private readonly appConfig;

  constructor(walletInstance: SenderWalletInstance) {
    this.walletInstance = walletInstance;
    this.appConfig = configService.get().appConfig;
  }

  isSignedIn(): boolean {
    return this.walletInstance.isSignedIn();
  }

  logout(): void {
    this.walletInstance.signOut();
  }

  async signIn(contractId: string): Promise<void> {
    await this.walletInstance.requestSignIn({
      contractId,
    });

    const accountCookieOptions = this.appConfig.APP_DOMAIN
      ? { ...DEFAULT_OPTIONS, domain: this.appConfig.APP_DOMAIN }
      : DEFAULT_OPTIONS;

    CookieService.set(
      ACCOUNT_COOKIE,
      this.getAccountId(),
      accountCookieOptions
    );
  }

  getAccount(): ConnectedWalletAccount {
    return this.walletInstance.account();
  }

  getAccountId(): string {
    return this.walletInstance.accountId;
  }

  async getPublicKey(): Promise<string | null> {
    if (!this.walletInstance.isSignedIn()) {
      return null;
    }

    return this.walletInstance.authData.accessKey.publicKey;
  }

  async getSignature(): Promise<string | null> {
    const privateKey = this.walletInstance.authData.accessKey.secretKey;
    const keyPair = new KeyPairEd25519(privateKey);

    return getSignature(keyPair);
  }

  sendTransactions(
    transactions: Transaction[]
  ): Promise<FinalExecutionOutcome[]> {
    return this.walletInstance.requestSignTransactions(transactions);
  }

  async functionCall(
    props: FunctionCallOptions
  ): Promise<FinalExecutionOutcome> {
    const tx = {
      receiverId: props.contractId,
      actions: [
        {
          methodName: props.methodName,
          args: { ...props.args },
          gas: props.gas?.toString(),
          deposit: props.attachedDeposit?.toString(),
        },
      ],
    };

    return this.walletInstance.signAndSendTransaction(tx);
  }

  getWalletType(): WalletType {
    return this.walletType;
  }

  sendMoney(receiverId: string, amount: BN): Promise<FinalExecutionOutcome> {
    return this.walletInstance.sendMoney(receiverId, amount.toString());
  }
}
