import { DAO } from 'types/dao';

import {
  CustomFunctionCallInput,
  getCustomFunctionCallProposal,
} from 'astro_2.0/features/CreateProposal/helpers/proposalObjectHelpers';

import { dao, data, tokens } from './mock';

describe('proposalObjectHelpers', () => {
  it('Should throw error if no token info provided', async () => {
    await expect(
      getCustomFunctionCallProposal(
        ({} as unknown) as DAO,
        ({} as unknown) as CustomFunctionCallInput,
        {}
      )
    ).rejects.toThrow();
  });

  it('Should return custom function call proposal', async () => {
    const result = await getCustomFunctionCallProposal(dao, data, tokens);

    expect(result).toEqual({
      daoId: 'legaldao.sputnikv2.testnet',
      description: 'asdfg$$$$',
      kind: 'FunctionCall',
      data: {
        receiver_id: 'some.testnet',
        actions: [
          {
            method_name: 'nft_buy',
            args: 'e30=',
            deposit: '0',
            gas: '0.15',
          },
        ],
      },
      bond: '100000000000000000000000',
    });
  });
});
