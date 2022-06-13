import { GlobalState } from 'little-state-machine';
import {
  AssetsStep,
  GroupsStep,
  InfoStep,
  LegalStep,
  LinksStep,
  MembersStep,
  ProposalsStep,
  SubmitStep,
  VotingStep,
} from 'astro_2.0/features/CreateDao/types';
import { AnySchema } from 'yup';
import { ResolverError, ResolverResult } from 'react-hook-form';
import { DEFAULT_CREATE_DAO_GAS } from 'services/sputnik/constants';

export function getInitialValues(
  accountId: string,
  defaultFlag: string
): GlobalState {
  return {
    info: {
      displayName: '',
      address: '',
      purpose: '',
      isValid: false,
    },
    kyc: {
      legalStatus: '',
      legalLink: '',
      isValid: false,
    },
    links: {
      websites: [],
      isValid: false,
    },
    groups: {
      items: [{ name: 'council', slug: 'council' }],
      isValid: false,
    },
    members: {
      accounts: [],
      isValid: false,
    },
    assets: {
      flagCover: '',
      flagLogo: '',
      defaultFlag,
      isValid: false,
    },
    voting: {
      data: null,
      isValid: false,
    },
    proposals: {
      data: null,
      isValid: false,
    },
    submit: {
      isValid: true,
      gas: DEFAULT_CREATE_DAO_GAS,
    },
  };
}

export function updateAction(
  state: GlobalState,
  payload: Record<
    string,
    | InfoStep
    | LegalStep
    | LinksStep
    | MembersStep
    | GroupsStep
    | AssetsStep
    | VotingStep
    | ProposalsStep
    | SubmitStep
  >
): GlobalState {
  return {
    ...state,
    ...payload,
  };
}

export async function handleValidate<T>(
  schema: AnySchema,
  data: T,
  onUpdateCb: (valid: boolean, data?: T, errors?: ResolverError<T>) => void
): Promise<ResolverResult<T>> {
  try {
    const values = await schema.validate(data, {
      abortEarly: false,
    });

    onUpdateCb(true);

    return {
      values,
      errors: {},
    };
  } catch (e) {
    onUpdateCb(false);

    return {
      values: {},
      errors: e.inner.reduce(
        (
          allErrors: Record<string, string>,
          currentError: { path: string; type?: string; message: string }
        ) => {
          return {
            ...allErrors,
            [currentError.path]: {
              type: currentError.type ?? 'validation',
              message: currentError.message,
            },
          };
        },
        {}
      ),
    };
  }
}
