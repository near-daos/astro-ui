import { getValidationSchema } from 'astro_2.0/features/CreateProposal/helpers/rootHelper';
import { ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { SputnikNearService } from 'services/sputnik';

export const resolver = (
  dao: DAO,
  nearService: SputnikNearService | null
) => async (
  data: Record<string, unknown>,
  context: { selectedProposalVariant: ProposalVariant } | undefined
): Promise<{
  values: Record<string, unknown>;
  errors: Record<string, unknown>;
}> => {
  const schema = getValidationSchema(
    context?.selectedProposalVariant,
    dao,
    data,
    nearService ?? undefined
  );

  try {
    let values = await schema.validate(data, {
      abortEarly: false,
    });

    if (
      context?.selectedProposalVariant === ProposalVariant.ProposeChangeDaoFlag
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
