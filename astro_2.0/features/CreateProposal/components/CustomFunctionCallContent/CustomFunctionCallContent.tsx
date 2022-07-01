import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

import { DAO } from 'types/dao';

import { FunctionCallType } from './types';

import { CustomContent } from './components/CustomContent';
import { VoteInOtherDao } from './components/VoteInOtherDao';
import { SwapsOnRefContent } from './components/SwapsOnRefContent';
import { CreateRoketoStream } from './components/CreateRoketoStream';
import { BuyNftFromParasContent } from './components/BuyNftFromParasContent';
import { BuyNftFromMintbaseContent } from './components/BuyNftFromMintbaseContent';
import { TransferNftFromMintbaseContent } from './components/TransferNftFromMintbaseContent';

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/'
);

interface CustomFunctionCallContentProps {
  dao: DAO;
}

const CustomFunctionCallContent: FC<CustomFunctionCallContentProps> = ({
  dao,
}) => {
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
    case FunctionCallType.CreateRoketoStream: {
      return <CreateRoketoStream dao={dao} />;
    }
    case FunctionCallType.BuyNFTfromMintbase: {
      return <BuyNftFromMintbaseContent />;
    }
    case FunctionCallType.VoteInAnotherDao: {
      return <VoteInOtherDao dao={dao} />;
    }
    case FunctionCallType.RemoveUpgradeCode: {
      return null;
    }
    case FunctionCallType.Custom:
    default: {
      return <CustomContent />;
    }
  }
};

export default CustomFunctionCallContent;
