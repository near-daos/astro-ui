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

export class SenderWalletService implements WalletService {
  private readonly walletInstance: SenderWalletInstance;

  private readonly walletType = WalletType.SENDER;

  constructor(walletInstance: SenderWalletInstance) {
    this.walletInstance = walletInstance;
  }

  isSignedIn(): boolean {
    return this.walletInstance.isSignedIn();
  }

  logout(): void {
    this.walletInstance.signOut();
  }

  login(contractId: string): Promise<void> {
    return this.walletInstance.requestSignIn({
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
