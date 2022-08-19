import { DAO } from 'types/dao';

import { CreateTokenInput } from 'astro_2.0/features/CreateProposal/types';
import { CreateTransferInput } from 'astro_2.0/features/CreateProposal/components/types';

import {
  BuyNftFromParasInput,
  BuyNftFromMintbaseInput,
  CustomFunctionCallInput,
  getTransferProposal,
  getSwapsOnRefProposal,
  getUpgradeSelfProposal,
  getUpgradeCodeProposal,
  getCreateTokenProposal,
  getChangeConfigProposal,
  getBuyNftFromParasProposal,
  getRemoveUpgradeCodeProposal,
  getBuyNftFromMintbaseProposal,
  getCustomFunctionCallProposal,
  getTransferMintbaseNFTProposal,
} from 'astro_2.0/features/CreateProposal/helpers/proposalObjectHelpers';

import {
  dao,
  tokens,
  nftFromMintbaseData,
  swapsOnRefInputData,
  customFunctionCallData,
  buyNftFromParasInputData,
  transferMintbaseNFTInputData,
} from './mock';

describe('proposalObjectHelpers', () => {
  describe('getCustomFunctionCallProposal', () => {
    it('Should throw error if no token info provided', async () => {
      await expect(
        getCustomFunctionCallProposal(
          {} as unknown as DAO,
          {} as unknown as CustomFunctionCallInput,
          {}
        )
      ).rejects.toThrow();
    });

    it('Should return custom function call proposal', async () => {
      const result = await getCustomFunctionCallProposal(
        dao,
        customFunctionCallData,
        tokens
      );

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
              gas: '150000000000',
            },
          ],
        },
        bond: '100000000000000000000000',
      });
    });
  });

  describe('getBuyNftFromMintbaseProposal', () => {
    it('Should throw error if no token info', async () => {
      await expect(
        getBuyNftFromMintbaseProposal(
          {} as unknown as DAO,
          {} as unknown as BuyNftFromMintbaseInput,
          {}
        )
      ).rejects.toThrow();
    });

    it('Should return proposal', async () => {
      const result = await getBuyNftFromMintbaseProposal(
        dao,
        nftFromMintbaseData,
        tokens
      );

      expect(result).toEqual({
        bond: '100000000000000000000000',
        daoId: 'legaldao.sputnikv2.testnet',
        data: {
          actions: [
            {
              args: 'eyJ0b2tlbl9rZXkiOlsidG9rZW5LZXkiXSwicHJpY2UiOlsiMjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJdLCJ0aW1lb3V0IjpbeyJob3VycyI6IjEwMCJ9XX0=',
              deposit: '2000000000000000000000000',
              gas: '5000000000000',
              method_name: 'make_offer',
            },
          ],
          receiver_id: 'market.mintbase1.near',
        },
        description: 'some details$$$$external url',
        kind: 'FunctionCall',
      });
    });
  });

  describe('getTransferMintbaseNFTProposal', () => {
    it('Should return proposal', async () => {
      const result = await getTransferMintbaseNFTProposal(
        dao,
        transferMintbaseNFTInputData
      );

      expect(result).toEqual({
        bond: '100000000000000000000000',
        daoId: 'legaldao.sputnikv2.testnet',
        data: {
          actions: [
            {
              args: 'eyJ0b2tlbl9pZHMiOltbIjEyMyIsInRhcmdldCJdXX0=',
              deposit: '1',
              gas: '5000000000000',
              method_name: 'nft_batch_transfer',
            },
          ],
          receiver_id: 'mint.near',
        },
        description: 'some details$$$$external url',
        kind: 'FunctionCall',
      });
    });
  });

  describe('getBuyNftFromParasProposal', () => {
    it('Should throw error if no token info', async () => {
      await expect(
        getBuyNftFromParasProposal(
          {} as unknown as DAO,
          {} as unknown as BuyNftFromParasInput,
          {}
        )
      ).rejects.toThrow();
    });

    it('Should return proposal', async () => {
      const result = await getBuyNftFromParasProposal(
        dao,
        buyNftFromParasInputData,
        tokens
      );

      expect(result).toEqual({
        bond: '100000000000000000000000',
        daoId: 'legaldao.sputnikv2.testnet',
        data: {
          actions: [
            {
              args: 'eyJ0b2tlbl9zZXJpZXNfaWQiOiJORUFSIiwicmVjZWl2ZXJfaWQiOiJ0YXJnZXQifQ==',
              deposit: '10000000000000000000000000',
              gas: '5000000000000',
              method_name: 'nft_buy',
            },
          ],
          receiver_id: 'x.paras.near',
        },
        description: 'some details$$$$external url',
        kind: 'FunctionCall',
      });
    });
  });

  describe('getSwapsOnRefProposal', () => {
    it('Should return proposal', async () => {
      const result = await getSwapsOnRefProposal(dao, swapsOnRefInputData);

      expect(result).toEqual({
        bond: '100000000000000000000000',
        daoId: 'legaldao.sputnikv2.testnet',
        data: {
          actions: [
            {
              args: 'eyJhY3Rpb25zIjpbeyJwb29sX2lkIjoicG9vbElkIiwidG9rZW5faW4iOiJUMSIsInRva2VuX291dCI6IlQyIiwiYW1vdW50X2luIjoxMCwibWluX2Ftb3VudF9vdXQiOjEwMH1dfQ==',
              deposit: '1000000000000000000000000',
              gas: '5000000000000',
              method_name: 'ft_transfer_call',
            },
          ],
          receiver_id: 'v2.ref-finance.near',
        },
        description: 'some details$$$$external url',
        kind: 'FunctionCall',
      });
    });
  });

  describe('getUpgradeCodeProposal', () => {
    it('Should return proposal', () => {
      const data = {
        versionHash: 'versionHash',
        details: 'details',
        externalUrl: 'externalUrl',
      };

      const result = getUpgradeCodeProposal(dao, data);

      expect(result).toEqual({
        daoId: 'legaldao.sputnikv2.testnet',
        description: 'details$$$$externalUrl',
        kind: 'FunctionCall',
        data: {
          receiver_id: 'sputnikv2.testnet',
          actions: [
            {
              method_name: 'store_contract_self',
              args: 'eyJjb2RlX2hhc2giOiJ2ZXJzaW9uSGFzaCJ9',
              deposit: '6000000000000000000000000',
              gas: '220000000000000',
            },
          ],
        },
        bond: '100000000000000000000000',
      });
    });
  });

  describe('getRemoveUpgradeCodeProposal', () => {
    it('Should return proposal', () => {
      const data = {
        versionHash: 'versionHash',
        details: 'details',
        externalUrl: 'externalUrl',
      };

      const result = getRemoveUpgradeCodeProposal(dao, data);

      expect(result).toEqual({
        variant: 'ProposeRemoveUpgradeCode',
        daoId: 'legaldao.sputnikv2.testnet',
        description: 'details$$$$externalUrl',
        kind: 'FunctionCall',
        data: {
          receiver_id: 'sputnikv2.testnet',
          actions: [
            {
              method_name: 'remove_contract_self',
              args: 'eyJjb2RlX2hhc2giOiJ2ZXJzaW9uSGFzaCJ9',
              deposit: '0',
              gas: '220000000000000',
            },
          ],
        },
        bond: '100000000000000000000000',
      });
    });
  });

  describe('getUpgradeSelfProposal', () => {
    it('Should return proposal', () => {
      const data = {
        versionHash: 'versionHash',
        details: 'details',
        externalUrl: 'externalUrl',
      };

      const result = getUpgradeSelfProposal(dao, data);

      expect(result).toEqual({
        daoId: 'legaldao.sputnikv2.testnet',
        description: 'details$$$$externalUrl',
        kind: 'UpgradeSelf',
        data: { hash: 'versionHash' },
        bond: '100000000000000000000000',
      });
    });
  });

  describe('getCreateTokenProposal', () => {
    it('Should return proposal', async () => {
      const data = {
        details: 'details',
        externalUrl: 'externalUrl',
      } as CreateTokenInput;

      const result = await getCreateTokenProposal(dao, data);

      expect(result).toEqual({
        daoId: 'legaldao.sputnikv2.testnet',
        description: 'details$$$$externalUrl',
        kind: 'FunctionCall',
        data: {
          receiver_id: 'legaldao.sputnikv2.testnet',
          actions: [
            {
              args: 'e30=',
              deposit: '6000000000000000000000000',
              gas: '220000000000000',
              method_name: 'store_contract_self',
            },
          ],
        },
        bond: '100000000000000000000000',
      });
    });
  });

  describe('getTransferProposal', () => {
    it('Should throw error if no token info provided', async () => {
      await expect(
        getTransferProposal(
          {} as unknown as DAO,
          {} as unknown as CreateTransferInput,
          {}
        )
      ).rejects.toThrow();
    });

    it('Should return proposal', async () => {
      const data = {
        token: 'NEAR',
        details: 'details',
        externalUrl: 'externalUrl',
        target: 'target',
        amount: 10,
      } as CreateTransferInput;

      const result = await getTransferProposal(dao, data, tokens);

      expect(result).toEqual({
        daoId: 'legaldao.sputnikv2.testnet',
        description: 'details$$$$externalUrl',
        kind: 'Transfer',
        bond: '100000000000000000000000',
        data: {
          token_id: '',
          receiver_id: 'target',
          amount: '10000000000000000000000000',
        },
      });
    });
  });

  describe('getChangeConfigProposal', () => {
    it('Should return proposal', () => {
      const config = {
        name: 'MyName',
        purpose: 'MyPurpose',
        metadata: 'SomeMeta',
      };

      const result = getChangeConfigProposal(
        'daoId',
        config,
        'Some reason to live',
        'Bond'
      );

      expect(result).toEqual({
        kind: 'ChangeConfig',
        daoId: 'daoId',
        data: {
          config: {
            metadata: 'SomeMeta',
            name: 'MyName',
            purpose: 'MyPurpose',
          },
        },
        description: 'Some reason to live',
        bond: 'Bond',
      });
    });
  });
});
