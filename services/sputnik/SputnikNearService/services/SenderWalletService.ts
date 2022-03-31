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
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { httpService } from 'services/HttpService';

export class SenderWalletService implements WalletService {
  private readonly walletInstance: SenderWalletInstance;

  private readonly walletType = WalletType.SENDER;

  constructor(walletInstance: SenderWalletInstance) {
    this.walletInstance = walletInstance;
    window.localStorage.setItem('selectedWallet', WalletType.SENDER.toString());
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

  async sendTransactions(
    transactions: Transaction[]
  ): Promise<FinalExecutionOutcome[]> {
    const result = await this.walletInstance.requestSignTransactions(
      transactions
    );

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

    const transactionHashes = result.response[0].transaction.hash;
    const signerId = result.response[0].transaction.signer_id;

    try {
      await httpService.get(
        `/transactions/wallet/callback/${signerId}?transactionHashes=${transactionHashes}`
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

    return result.response;
  }
}
