/* eslint-disable @typescript-eslint/no-explicit-any */
import BN from 'bn.js';
import { utils } from 'near-api-js';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { CreateProposalParams } from 'types/proposal';
import { AnyObject } from 'yup/lib/types';
import { appConfig } from 'config';
import { mapCreateDaoParamsToContractArgs } from './mappers/dao';
import { SputnikWalletService } from './SputnikWalletService';
import { ClaimBountyParams, CreateDaoParams } from './types/dao';

const GAS_VALUE = new BN('300000000000000');

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
        : `${window.origin}/api-server/v1/transactions/wallet/callback/${accountId}`
    });
  }

  public async create(params: CreateDaoParams): Promise<void> {
    const args = mapCreateDaoParamsToContractArgs(params);

    const amount = new BN(
      utils.format.parseNearAmount(params.amountToTransfer) || '0'
    );

    try {
      await this.functionCall({
        contractId: this.factoryContractId,
        methodName: 'create',
        args: {
          name: params.name,
          args
        },
        gas: new BN('300000000000000'),
        attachedDeposit: amount
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async addProposal(params: CreateProposalParams): Promise<AnyObject> {
    const { daoId, description, kind, data, bond } = params;

    const kindData = data
      ? {
          [kind]: data
        }
      : kind;

    return this.functionCall({
      methodName: 'add_proposal',
      contractId: daoId,
      args: {
        proposal: {
          description,
          kind: kindData
        }
      },
      gas: GAS_VALUE,
      attachedDeposit: new BN(bond)
    });
  }

  public async vote(
    daoId: string,
    proposalId: number,
    action: 'VoteApprove' | 'VoteRemove' | 'VoteReject'
  ): Promise<any> {
    return this.functionCall({
      methodName: 'act_proposal',
      contractId: daoId,
      args: {
        id: proposalId,
        action
      }
    });
  }

  public async finalize(daoId: string, proposalId: number): Promise<any> {
    return this.functionCall({
      methodName: 'finalize',
      contractId: daoId,
      args: {
        id: proposalId
      }
    });
  }

  public async claimBounty(params: ClaimBountyParams): Promise<any> {
    const { daoId, bountyId: id, deadline, bountyBond } = params;

    return this.functionCall({
      methodName: 'bounty_claim',
      contractId: daoId,
      args: {
        id,
        deadline
      },
      gas: GAS_VALUE,
      attachedDeposit: new BN(bountyBond)
    });
  }

  public unclaimBounty(daoId: string, bountyId: string): Promise<any> {
    return this.functionCall({
      methodName: 'bounty_giveup',
      contractId: daoId,
      args: {
        id: bountyId
      },
      gas: GAS_VALUE
    });
  }
}
