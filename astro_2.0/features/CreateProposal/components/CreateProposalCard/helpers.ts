import {
  DEFAULT_PROPOSAL_GAS,
  DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
} from 'services/sputnik/constants';
import { formatYoktoValue } from 'utils/format';
import { ProposalTemplate } from 'types/proposalTemplate';
import { Tokens } from 'types/token';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';
import { getFormInitialValues } from 'astro_2.0/features/CreateProposal/helpers/initialValues';
import { ProposalVariant } from 'types/proposal';
import { Settings } from 'types/settings';
import { TFunction } from 'i18next';

export function getCustomTemplatesInitialValues(
  templates: ProposalTemplate[],
  tokens: Tokens,
  templateId: string
): Record<string, unknown> {
  let initialValues = {};
  const template = templates.find(item => item.id === templateId);

  if (template) {
    const { config } = template;

    const parsedJson = config.json
      ? decodeURIComponent(config.json as string)
          .trim()
          .replace(/\\/g, '')
      : '';

    const tokenData = config.token ? tokens[config.token] : tokens.NEAR;

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

  return initialValues;
}

export function getCustomTemplatesDefaults(
  fcType: FunctionCallType,
  templates: ProposalTemplate[],
  tokens: Tokens,
  settings: Settings | null | undefined,
  t: TFunction,
  accountId: string,
  templateId: string,
  isDraft?: boolean,
  draftValues?: Record<string, unknown>
): Record<string, unknown> {
  let initialValues = {};
  const predefinedTypes = Object.values(FunctionCallType) as string[];

  if (!predefinedTypes.includes(fcType)) {
    const customTemplatesInitialValues = getCustomTemplatesInitialValues(
      templates,
      tokens,
      templateId
    );

    initialValues = isDraft
      ? { ...customTemplatesInitialValues, ...draftValues }
      : customTemplatesInitialValues;
  }

  if (fcType === FunctionCallType.RemoveUpgradeCode) {
    const hash = settings?.daoUpgrade?.versionHash;

    if (hash) {
      initialValues = {
        details: `This proposal is to delete the upgrade code which you retrieved from the factory. Deleting that code saves NEAR for your DAO. It's safe to delete that code because smart contracts always store a copy of the code they're running.`,
        externalUrl: '',
        gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
        versionHash: hash,
      };
    }
  }

  return getFormInitialValues(
    t,
    ProposalVariant.ProposeCustomFunctionCall,
    accountId,
    initialValues,
    undefined,
    isDraft
  );
}
