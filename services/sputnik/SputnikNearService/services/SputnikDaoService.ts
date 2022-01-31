import BN from 'bn.js';
import { utils } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { FunctionCallOptions } from 'near-api-js/lib/account';

import { appConfig } from 'config';
import { formatGasValue } from 'utils/format';

import { CreateProposalParams } from 'types/proposal';

import { mapCreateDaoParamsToContractArgs } from 'services/sputnik/mappers';
import { ClaimBountyParams, CreateDaoParams } from 'services/sputnik/types';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';

import { SputnikWalletService } from './SputnikWalletService';

export const GAS_VALUE = new BN('300000000000000');
export const FINALIZE_PROPOSAL_GAS_VALUE = new BN('150000000000000');

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
      gas: formatGasValue(params.gas),
      attachedDeposit: amount,
    });
  }

  async addProposal(
    params: CreateProposalParams
  ): Promise<FinalExecutionOutcome> {
    const { daoId, description, kind, data, bond, gas } = params;

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
      gas: formatGasValue(gas ?? DEFAULT_PROPOSAL_GAS),
      attachedDeposit: new BN(bond),
    });
  }

  async registerToToken(
    tokenId: string,
    recipient: string
  ): Promise<FinalExecutionOutcome> {
    return this.functionCall({
      methodName: 'storage_deposit',
      contractId: tokenId,
      args: {
        account_id: recipient,
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
    action: 'VoteApprove' | 'VoteRemove' | 'VoteReject',
    gas?: string | number
  ): Promise<FinalExecutionOutcome> {
    return this.functionCall({
      methodName: 'act_proposal',
      contractId: daoId,
      args: {
        id: proposalId,
        action,
      },
      gas: gas ? formatGasValue(gas) : GAS_VALUE,
    });
  }

  public async finalize(
    daoId: string,
    proposalId: number
  ): Promise<FinalExecutionOutcome> {
    return this.functionCall({
      methodName: 'act_proposal',
      contractId: daoId,
      args: {
        id: proposalId,
        action: 'Finalize',
      },
      gas: FINALIZE_PROPOSAL_GAS_VALUE,
    });
  }

  public async claimBounty(
    params: ClaimBountyParams
  ): Promise<FinalExecutionOutcome> {
    const { daoId, bountyId: id, deadline, bountyBond, gas } = params;

    return this.functionCall({
      methodName: 'bounty_claim',
      contractId: daoId,
      args: {
        id,
        deadline,
      },
      gas: gas ? formatGasValue(gas) : GAS_VALUE,
      attachedDeposit: new BN(bountyBond),
    });
  }

  public unclaimBounty(
    daoId: string,
    bountyId: string,
    gas: string | number
  ): Promise<FinalExecutionOutcome> {
    return this.functionCall({
      methodName: 'bounty_giveup',
      contractId: daoId,
      args: {
        id: bountyId,
      },
      gas: gas ? formatGasValue(gas) : GAS_VALUE,
    });
  }
}
