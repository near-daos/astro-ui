import { getValidationSchema } from 'astro_2.0/features/CreateProposal/helpers/rootHelper';
import { ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { SputnikNearService } from 'services/sputnik';
import { TFunction } from 'next-i18next';

export const resolver =
  (
    dao: DAO,
    nearService: SputnikNearService | null,
    t: TFunction,
    isDraft?: boolean
  ) =>
  async (
    data: Record<string, unknown>,
    context: { selectedProposalVariant: ProposalVariant } | undefined
  ): Promise<{
    values: Record<string, unknown>;
    errors: Record<string, unknown>;
  }> => {
    const schema = getValidationSchema(
      t,
      context?.selectedProposalVariant,
      dao,
      data,
      nearService ?? undefined,
      isDraft
    );

    try {
      let values = await schema.validate(data, {
        abortEarly: false,
      });

      if (
        context?.selectedProposalVariant ===
        ProposalVariant.ProposeChangeDaoFlag
      ) {
        values = {
          ...values,
          flagCover: data.flagCover,
          flagLogo: data.flagLogo,
        };
      }

      return {
        values,
        errors: {},
      };
    } catch (errors) {
      return {
        values: {},
        errors: errors.inner.reduce(
          (
            allErrors: Record<string, string>,
            currentError: { path: string; type?: string; message: string }
          ) => ({
            ...allErrors,
            [currentError.path]: {
              type: currentError.type ?? 'validation',
              message: currentError.message,
            },
          }),
          {}
        ),
      };
    }
  };
