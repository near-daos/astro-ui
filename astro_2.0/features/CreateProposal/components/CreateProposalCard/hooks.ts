import { useTranslation } from 'next-i18next';
import { useProposalTemplates } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/hooks';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { UserPermissions } from 'types/context';
import { ProposalType, ProposalVariant } from 'types/proposal';
import { Option } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';
import { useCallback, useMemo } from 'react';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';
import { useDaoSettings } from 'context/DaoSettingsContext';

type DropdownOption = {
  title: string;
  options: Option[];
  disabled: boolean;
};

export function useProposalTypeOptions(
  daoId: string,
  userPermissions: UserPermissions,
  canCreateTokenProposal: boolean
): DropdownOption[] {
  const { t } = useTranslation();

  const { isCanCreatePolicyProposals, allowedProposalsToCreate } =
    userPermissions;

  const getTitle = (key: string) => t(`createProposal.header.${key}`);
  const getLabel = useCallback(
    (key: string) => t(`proposalCard.proposalTypes.${key}`),
    [t]
  );

  const changeConfigTitle = getLabel('groupChangeConfig');
  const fcLabel = getLabel('groupFunctionCall');

  const { templates } = useProposalTemplates(daoId);
  const { settings } = useDaoSettings();

  const { roketoStreaming } = useFlags();

  const customFunctionCallsOptions = useMemo<DropdownOption[]>(() => {
    const templateOptions = [
      {
        label: 'Buy NFT from Mintbase',
        value: ProposalVariant.ProposeCustomFunctionCall.toString(),
        group: fcLabel,
        opt: FunctionCallType.BuyNFTfromMintbase.toString(),
      },
      {
        label: 'Transfer NFT from DAO',
        value: ProposalVariant.ProposeCustomFunctionCall,
        group: fcLabel,
        opt: FunctionCallType.TransferNFTfromMintbase,
      },
      {
        label: 'Buy NFT from Paras',
        value: ProposalVariant.ProposeCustomFunctionCall,
        group: fcLabel,
        opt: FunctionCallType.BuyNFTfromParas,
      },
    ];

    if (roketoStreaming) {
      templateOptions.push({
        label: 'Create Roketo Stream',
        value: ProposalVariant.ProposeCustomFunctionCall,
        group: fcLabel,
        opt: FunctionCallType.CreateRoketoStream,
      });
    }

    if (settings?.daoUpgrade?.versionHash) {
      templateOptions.push({
        label: 'Remove upgrade code',
        value: ProposalVariant.ProposeCustomFunctionCall,
        group: fcLabel,
        opt: FunctionCallType.RemoveUpgradeCode,
      });
    }

    templateOptions.push({
      label: 'Vote in Another DAO',
      value: ProposalVariant.ProposeCustomFunctionCall,
      group: fcLabel,
      opt: FunctionCallType.VoteInAnotherDao,
    });

    const result = [
      {
        title: fcLabel,
        disabled: !allowedProposalsToCreate[ProposalType.FunctionCall],
        options: [
          {
            label: fcLabel,
            value: ProposalVariant.ProposeCustomFunctionCall,
            group: fcLabel,
          },
          ...templateOptions,
        ],
      },
    ];

    if (templates) {
      const filteredTemplates = templates.filter(item => item.isEnabled);

      if (filteredTemplates.length) {
        result.push({
          title: 'Custom Templates',
          disabled: !allowedProposalsToCreate[ProposalType.FunctionCall],
          options: filteredTemplates.map(item => ({
            label: item.name,
            value: item.id ?? '',
            group: 'Custom Templates',
            opt: '',
          })),
        });
      }
    }

    return result;
  }, [
    fcLabel,
    roketoStreaming,
    settings?.daoUpgrade?.versionHash,
    allowedProposalsToCreate,
    templates,
  ]);

  const config = useMemo<DropdownOption[]>(() => {
    return [
      {
        title: getLabel('groupTransferAddBounty'),
        disabled:
          !allowedProposalsToCreate[ProposalType.Transfer] &&
          !allowedProposalsToCreate[ProposalType.AddBounty],
        options: [
          {
            label: getLabel('proposeTransfer'),
            value: ProposalVariant.ProposeTransfer,
            group: getLabel('groupTransferAddBounty'),
            disabled: !allowedProposalsToCreate[ProposalType.Transfer],
          },
          {
            label: getLabel('proposeBounty'),
            value: ProposalVariant.ProposeCreateBounty,
            group: getLabel('groupTransferAddBounty'),
            disabled: !allowedProposalsToCreate[ProposalType.AddBounty],
          },
        ],
      },
      {
        title: changeConfigTitle,
        disabled:
          !isCanCreatePolicyProposals ||
          !allowedProposalsToCreate[ProposalType.ChangeConfig],
        options: [
          {
            label: getLabel('proposeDAOName'),
            value: ProposalVariant.ProposeChangeDaoName,
            group: getLabel('groupChangeConfig'),
          },
          {
            label: getLabel('proposeDAOPurpose'),
            value: ProposalVariant.ProposeChangeDaoPurpose,
            group: getLabel('groupChangeConfig'),
          },
          {
            label: getLabel('proposeDAOLinks'),
            value: ProposalVariant.ProposeChangeDaoLinks,
            group: getLabel('groupChangeConfig'),
          },
          {
            label: getLabel('proposeDAOFlagAndLogo'),
            value: ProposalVariant.ProposeChangeDaoFlag,
            group: getLabel('groupChangeConfig'),
          },
          {
            label: getLabel('proposeLegalStatusAndDoc'),
            value: ProposalVariant.ProposeChangeDaoLegalInfo,
            group: getLabel('groupChangeConfig'),
          },
        ],
      },
      {
        title: getLabel('groupChangePolicy'),
        disabled:
          !allowedProposalsToCreate[ProposalType.ChangePolicy] ||
          !isCanCreatePolicyProposals,
        options: [
          /*  {
            label: getLabel('proposeChangePolicy'),
            value: ProposalVariant.ProposeChangeVotingPolicy,
            group: getLabel('groupChangePolicy'),
          }, */
          {
            label: getLabel('proposeBondsAndDeadlines'),
            value: ProposalVariant.ProposeChangeBonds,
            group: getLabel('groupChangePolicy'),
          },
          {
            label: getLabel('proposeGroup'),
            value: ProposalVariant.ProposeCreateGroup,
            group: getLabel('groupChangePolicy'),
          },
        ],
      },
      {
        title: getLabel('groupChangeMembers'),
        disabled:
          !allowedProposalsToCreate[ProposalType.AddMemberToRole] &&
          !allowedProposalsToCreate[ProposalType.RemoveMemberFromRole],
        options: [
          {
            label: getLabel('proposeAddMember'),
            value: ProposalVariant.ProposeAddMember,
            group: getLabel('groupChangeMembers'),
            disabled: !allowedProposalsToCreate[ProposalType.AddMemberToRole],
          },
          {
            label: getLabel('proposeRemoveMember'),
            value: ProposalVariant.ProposeRemoveMember,
            group: getLabel('groupChangeMembers'),
            disabled:
              !allowedProposalsToCreate[ProposalType.RemoveMemberFromRole],
          },
        ],
      },
      {
        title: getLabel('groupVote'),
        disabled: !allowedProposalsToCreate[ProposalType.Vote],
        options: [
          {
            label: getLabel('proposePoll'),
            value: ProposalVariant.ProposePoll,
            group: getLabel('groupVote'),
            disabled: !allowedProposalsToCreate[ProposalType.Vote],
          },
        ],
      },
      ...customFunctionCallsOptions,
    ];
  }, [
    allowedProposalsToCreate,
    changeConfigTitle,
    customFunctionCallsOptions,
    getLabel,
    isCanCreatePolicyProposals,
  ]);

  if (canCreateTokenProposal) {
    const changeConfigGroup = config.find(
      ({ title }) => title === changeConfigTitle
    );

    changeConfigGroup?.options.push({
      label: getLabel('createToken'),
      value: ProposalVariant.ProposeCreateToken,
      group: getLabel('groupChangeConfig'),
      disabled: false,
    });

    config.push({
      title: getTitle('customFunction'),
      disabled: false,
      options: [
        {
          label: getTitle('distributionOfTokens'),
          value: ProposalVariant.ProposeTokenDistribution,
          group: getTitle('customFunction'),
        } as Option,
      ],
    });
  }

  return useMemo(() => {
    return config.reduce<DropdownOption[]>((res, item) => {
      if (!item.disabled) {
        res.push({
          ...item,
          options: item.options.filter(option => !option.disabled),
        });
      }

      return res;
    }, []);
  }, [config]);
}
