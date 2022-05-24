import React, { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { GroupedSelect } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';

import { getFormInitialValues } from 'astro_2.0/features/CreateProposal/helpers/initialValues';

import { useWalletContext } from 'context/WalletContext';

import { ProposalVariant } from 'types/proposal';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';

import { useProposalTemplates } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/hooks';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';
import { formatYoktoValue } from 'utils/format';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import styles from './FunctionCallTypeSelector.module.scss';

interface Props {
  daoId: string;
}

type Option = {
  title: string;
  disabled: boolean;
  options: {
    label: string;
    value: FunctionCallType | string;
    group: string;
  }[];
};

export const FunctionCallTypeSelector: FC<Props> = ({ daoId }) => {
  const { register, reset } = useFormContext();
  const { accountId } = useWalletContext();
  const { templates } = useProposalTemplates(daoId);
  const { tokens } = useCustomTokensContext();

  const options = useMemo(() => {
    const result: Option[] = [
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
          {
            label: 'Vote in Another DAO',
            value: FunctionCallType.VoteInAnotherDao,
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

    if (templates) {
      const filteredTemplates = templates.filter(item => item.isEnabled);

      if (filteredTemplates.length) {
        result.push({
          title: 'Custom Templates',
          disabled: false,
          options: filteredTemplates.map(item => ({
            label: item.name,
            value: item.id ?? '',
            group: 'Custom Templates',
          })),
        });
      }
    }

    return result;
  }, [templates]);

  return (
    <div className={styles.root}>
      <GroupedSelect
        caption="Type"
        inputStyles={{ fontSize: 16 }}
        defaultValue={FunctionCallType.Custom}
        options={options}
        {...register('functionCallType')}
        onChange={v => {
          let initialValues = {};
          const predefinedTypes = Object.values(FunctionCallType) as string[];

          if (v && !predefinedTypes.includes(v)) {
            const template = templates.find(item => item.id === v);

            if (template) {
              const { config } = template;

              const parsedJson = config.json
                ? decodeURIComponent(config.json as string)
                    .trim()
                    .replace(/\\/g, '')
                : '';

              const tokenData = config.token
                ? tokens[config.token]
                : tokens.NEAR;

              initialValues = {
                smartContractAddress: config.smartContractAddress,
                methodName: config.methodName,
                actionsGas: config.actionsGas
                  ? Number(config.actionsGas) / 10 ** 12
                  : DEFAULT_PROPOSAL_GAS,
                deposit: tokenData
                  ? formatYoktoValue(config.deposit, tokenData.decimals)
                  : config.deposit,
                token: config.token ?? 'NEAR',
                json: parsedJson,
                isActive: template.isEnabled,
                name: template.name,
              };
            }
          }

          const defaults = getFormInitialValues(
            ProposalVariant.ProposeCustomFunctionCall,
            accountId,
            initialValues
          );

          reset({ ...defaults, functionCallType: v });
        }}
      />
    </div>
  );
};
