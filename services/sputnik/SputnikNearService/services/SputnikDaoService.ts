import BN from 'bn.js';
import { utils } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { FunctionCallOptions } from 'near-api-js/lib/account';

import { appConfig } from 'config';

import { CreateProposalParams } from 'types/proposal';

import { mapCreateDaoParamsToContractArgs } from 'services/sputnik/mappers';
import { ClaimBountyParams, CreateDaoParams } from 'services/sputnik/types';

import { SputnikWalletService } from './SputnikWalletService';

export const GAS_VALUE = new BN('300000000000000');

export class SputnikDaoService {
  private readonly sputnikWalletService: SputnikWalletService;

  private readonly factoryContractId: string;

  constructor(
    factoryContractId: string,
    sputnikWalletService: SputnikWalletService
  ) {
    this.factoryContractId = factoryContractId;
    this.sputnikWalletService = sputnikWalletService;
  }

  private functionCall(props: FunctionCallOptions) {
    const accountId = this.sputnikWalletService.getAccountId();

    return this.sputnikWalletService.getAccount().functionCall({
      ...props,
      walletCallbackUrl: appConfig.walledUseLocalRedirect
        ? `${window.origin}/callback/transaction`
        : `${window.origin}/api-server/v1/transactions/wallet/callback/${accountId}`,
    });
  }

  public async create(params: CreateDaoParams): Promise<void> {
    const args = mapCreateDaoParamsToContractArgs(params);

    const amount = new BN(
      utils.format.parseNearAmount(params.amountToTransfer) || '0'
    );

    await this.functionCall({
      contractId: this.factoryContractId,
      methodName: 'create',
      args: {
        name: params.name,
        args,
      },
      gas: GAS_VALUE,
      attachedDeposit: amount,
    });
  }

  async addProposal(
    params: CreateProposalParams
  ): Promise<FinalExecutionOutcome> {
    const { daoId, description, kind, data, bond } = params;

    const kindData = data
      ? {
          [kind]: data,
        }
      : kind;

    return this.functionCall({
      methodName: 'add_proposal',
      contractId: daoId,
      args: {
        proposal: {
          description,
          kind: kindData,
        },
      },
      gas: GAS_VALUE,
      attachedDeposit: new BN(bond),
    });
  }

  async registerToToken(tokenId: string): Promise<FinalExecutionOutcome> {
    return this.functionCall({
      methodName: 'storage_deposit',
      contractId: tokenId,
      args: {
        registration_only: true,
      },
      gas: GAS_VALUE,
      // 0.1 NEAR, minimal value
      attachedDeposit: new BN('100000000000000000000000'),
    });
  }

  public async vote(
    daoId: string,
    proposalId: number,
    action: 'VoteApprove' | 'VoteRemove' | 'VoteReject'
  ): Promise<FinalExecutionOutcome> {
    return this.functionCall({
      methodName: 'act_proposal',
      contractId: daoId,
      args: {
        id: proposalId,
        action,
      },
      gas: GAS_VALUE,
    });
  }

  public async finalize(
    daoId: string,
    proposalId: number
  ): Promise<FinalExecutionOutcome> {
    return this.functionCall({
      methodName: 'finalize',
      contractId: daoId,
      args: {
        id: proposalId,
      },
      gas: GAS_VALUE,
    });
  }

  public async claimBounty(
    params: ClaimBountyParams
  ): Promise<FinalExecutionOutcome> {
    const { daoId, bountyId: id, deadline, bountyBond } = params;

    return this.functionCall({
      methodName: 'bounty_claim',
      contractId: daoId,
      args: {
        id,
        deadline,
      },
      gas: GAS_VALUE,
      attachedDeposit: new BN(bountyBond),
    });
  }

  public unclaimBounty(
    daoId: string,
    bountyId: string
  ): Promise<FinalExecutionOutcome> {
    return this.functionCall({
      methodName: 'bounty_giveup',
      contractId: daoId,
      args: {
        id: bountyId,
      },
      gas: GAS_VALUE,
    });
  }
}
