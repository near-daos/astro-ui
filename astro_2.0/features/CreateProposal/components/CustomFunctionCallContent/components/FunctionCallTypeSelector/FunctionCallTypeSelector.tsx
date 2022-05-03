import React, { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { GroupedSelect } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';

import { getFormInitialValues } from 'astro_2.0/features/CreateProposal/helpers/initialValues';
import { useWalletContext } from 'context/WalletContext';
import { ProposalVariant } from 'types/proposal';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';

import styles from './FunctionCallTypeSelector.module.scss';

export const FunctionCallTypeSelector: FC = () => {
  const { register, reset } = useFormContext();
  const { accountId } = useWalletContext();

  const options = useMemo(() => {
    return [
      {
        title: '',
        disabled: false,
        options: [
          {
            label: 'Custom',
            value: FunctionCallType.Custom,
            group: '',
          },
        ],
      },
      {
        title: 'Templates',
        disabled: false,
        options: [
          {
            label: 'Buy NFT from Mintbase',
            value: FunctionCallType.BuyNFTfromMintbase,
            group: 'Templates',
          },
          {
            label: 'Transfer NFT from DAO',
            value: FunctionCallType.TransferNFTfromMintbase,
            group: 'Templates',
          },
          {
            label: 'Buy NFT from Paras',
            value: FunctionCallType.BuyNFTfromParas,
            group: 'Templates',
          },
          // Temp disable - we want to implement integration with SC to fetch required data
          // {
          //   label: 'Swaps on Ref',
          //   value: FunctionCallType.SwapsOnRef,
          //   group: 'Templates',
          // },
        ],
      },
    ];
  }, []);

  return (
    <div className={styles.root}>
      <GroupedSelect
        caption="Type"
        inputStyles={{ fontSize: 16 }}
        defaultValue={FunctionCallType.Custom}
        options={options}
        {...register('functionCallType')}
        onChange={v => {
          const defaults = getFormInitialValues(
            ProposalVariant.ProposeCustomFunctionCall,
            accountId
          );

          reset({ ...defaults, functionCallType: v });
        }}
      />
    </div>
  );
};
