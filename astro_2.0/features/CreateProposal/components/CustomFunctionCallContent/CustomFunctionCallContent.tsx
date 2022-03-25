import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

import { CustomContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/CustomContent';
import { BuyNftFromMintbaseContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/BuyNftFromMintbaseContent';
import { TransferNftFromMintbaseContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/TransferNftFromMintbaseContent';
import { BuyNftFromParasContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/BuyNftFromParasContent';
import { SwapsOnRefContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/SwapsOnRefContent';

import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/'
);

const CustomFunctionCallContent: FC = () => {
  const { watch } = useFormContext();
  const type = watch('functionCallType');

  switch (type) {
    case FunctionCallType.SwapsOnRef: {
      return <SwapsOnRefContent />;
    }
    case FunctionCallType.BuyNFTfromParas: {
      return <BuyNftFromParasContent />;
    }
    case FunctionCallType.TransferNFTfromMintbase: {
      return <TransferNftFromMintbaseContent />;
    }
    case FunctionCallType.BuyNFTfromMintbase: {
      return <BuyNftFromMintbaseContent />;
    }
    case FunctionCallType.Custom:
    default: {
      return <CustomContent />;
    }
  }
};

export default CustomFunctionCallContent;
