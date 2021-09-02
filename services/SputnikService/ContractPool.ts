import { Contract, Account } from 'near-api-js';

export class ContractPool {
  private account: Account;

  private pool: { [key: string]: Contract } = {};

  constructor(account: Account) {
    this.account = account;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(contractId: string): Contract & any {
    if (this.pool[contractId]) {
      return this.pool[contractId];
    }

    const contract = new Contract(this.account, contractId, {
      viewMethods: [
        'get_config',
        'get_policy',
        'get_staking_contract',
        'get_available_amount',
        'delegation_total_supply',
        'get_proposals',
        'get_last_proposal_id',
        'get_proposal',
        'get_bounty',
        'get_bounties',
        'get_last_bounty_id',
        'get_bounty_claims',
        'get_bounty_number_of_claims',
        'delegation_balance_of',
        'has_blob'
      ],
      changeMethods: ['add_proposal', 'act_proposal']
    });

    this.pool[contractId] = contract;

    return contract;
  }
}
