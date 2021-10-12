import { nearConfig } from 'config';
import { ConnectedWalletAccount, Near } from 'near-api-js';
import { SputnikWalletConnection } from './overrides/SputnikWalletConnection';

export class SputnikWalletService {
  private readonly near: Near;

  private walletConnection!: SputnikWalletConnection;

  public readonly successUrl: string = `${window.origin}/callback/auth`;

  public readonly failureUrl: string = `${window.origin}/callback/auth`;

  constructor(near: Near) {
    this.near = near;
  }

  public init(): void {
    this.walletConnection = new SputnikWalletConnection(this.near, 'sputnik');
  }

  public async login(
    contractId: string = nearConfig.contractName
  ): Promise<void> {
    await this.walletConnection.sputnikRequestSignIn(
      contractId,
      this.successUrl,
      this.failureUrl
    );

    this.init();
  }

  public logout(): void {
    this.walletConnection.signOut();
  }

  public getAccount(): ConnectedWalletAccount {
    return this.walletConnection.account();
  }

  public getAccountId(): string {
    return this.walletConnection.getAccountId();
  }
}
