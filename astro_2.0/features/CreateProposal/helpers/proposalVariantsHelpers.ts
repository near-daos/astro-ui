import { ProposalVariant } from 'types/proposal';

export function getNonEditableGasValue(
  variant: ProposalVariant,
  values: Record<string, unknown>
): { label: string; value: string } | undefined {
  switch (variant) {
    case ProposalVariant.ProposeUpgradeSelf:
    case ProposalVariant.ProposeGetUpgradeCode:
    case ProposalVariant.ProposeRemoveUpgradeCode: {
      return {
        label: 'Gas',
        value: values.gas as string,
      };
    }
    default: {
      return undefined;
    }
  }
}
