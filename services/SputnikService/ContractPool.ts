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
        'get_council',
        'get_bond',
        'get_proposal',
        'get_num_proposals',
        'get_proposals',
        'get_vote_period',
        'get_purpose'
      ],
      changeMethods: ['vote', 'add_proposal', 'finalize']
    });

    this.pool[contractId] = contract;

    return contract;
  }
}
