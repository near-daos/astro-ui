/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useFormContext } from 'react-hook-form';

import { DAO } from 'types/dao';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';

import CustomFunctionCallContent from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent';

jest.mock(
  'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/CustomContent',
  () => {
    return {
      CustomContent: () => <div>CustomContent</div>,
    };
  }
);

jest.mock(
  'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/BuyNftFromMintbaseContent',
  () => {
    return {
      BuyNftFromMintbaseContent: () => <div>BuyNftFromMintbaseContent</div>,
    };
  }
);

jest.mock(
  'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/SwapsOnRefContent',
  () => {
    return {
      SwapsOnRefContent: () => <div>SwapsOnRefContent</div>,
    };
  }
);

jest.mock(
  'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/BuyNftFromParasContent',
  () => {
    return {
      BuyNftFromParasContent: () => <div>BuyNftFromParasContent</div>,
    };
  }
);

jest.mock(
  'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/TransferNftFromMintbaseContent',
  () => {
    return {
      TransferNftFromMintbaseContent: () => (
        <div>TransferNftFromMintbaseContent</div>
      ),
    };
  }
);

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => ({})),
  };
});

describe('CustomFunctionCallContent', () => {
  it.each`
    type                                        | component
    ${'Unknown'}                                | ${'CustomContent'}
    ${FunctionCallType.Custom}                  | ${'CustomContent'}
    ${FunctionCallType.SwapsOnRef}              | ${'SwapsOnRefContent'}
    ${FunctionCallType.BuyNFTfromParas}         | ${'BuyNftFromParasContent'}
    ${FunctionCallType.BuyNFTfromMintbase}      | ${'BuyNftFromMintbaseContent'}
    ${FunctionCallType.TransferNFTfromMintbase} | ${'TransferNftFromMintbaseContent'}
  `(
    'Should render proper component for $type function call type',
    ({ type, component }) => {
      // @ts-ignore
      useFormContext.mockImplementation(() => ({
        watch: () => type,
      }));

      const { getByText } = render(
        <CustomFunctionCallContent dao={{} as unknown as DAO} />
      );

      expect(getByText(component)).toBeTruthy();
    }
  );
});
