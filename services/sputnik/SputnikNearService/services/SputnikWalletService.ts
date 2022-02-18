import { ConnectedWalletAccount, Near } from 'near-api-js';
import { SputnikWalletConnection } from 'services/sputnik/SputnikNearService/overrides/SputnikWalletConnection';
import { configService } from 'services/ConfigService';

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

  public async login(contractId?: string): Promise<void> {
    const { nearConfig } = configService.get();

    const contractName = nearConfig?.contractName ?? '';

    await this.walletConnection.sputnikRequestSignIn(
      contractId || contractName,
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
