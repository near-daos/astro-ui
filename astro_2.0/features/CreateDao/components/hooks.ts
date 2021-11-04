import {
  useFormContext,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import {
  DAOFormValues,
  DAOProposalsType,
  DaoSettingOption,
  DAOStructureType,
  DAOVotingPowerType,
} from 'astro_2.0/features/CreateDao/components/types';
import { useEffect, useState } from 'react';
import {
  DAO_PROPOSALS_OPTIONS,
  DAO_STRUCTURE_OPTIONS,
  DAO_VOTING_POWER_OPTIONS,
} from 'astro_2.0/features/CreateDao/components/data';

type DaoFormStateReturn = {
  options: DaoSettingOption<
    DAOStructureType | DAOVotingPowerType | DAOProposalsType
  >[];
  getValues: UseFormGetValues<DAOFormValues>;
  setValue: UseFormSetValue<DAOFormValues>;
};

export const useDaoFormState = (): DaoFormStateReturn => {
  const { getValues, watch, setValue } = useFormContext<DAOFormValues>();

  const [structure, voting, proposals] = watch([
    'structure',
    'voting',
    'proposals',
  ]);

  const [options, setOptions] = useState<
    DaoSettingOption<DAOStructureType | DAOVotingPowerType | DAOProposalsType>[]
  >([]);

  useEffect(() => {
    setOptions([
      DAO_STRUCTURE_OPTIONS[structure],
      DAO_VOTING_POWER_OPTIONS[voting],
      DAO_PROPOSALS_OPTIONS[proposals],
    ]);
  }, [structure, voting, proposals, setValue]);

  return { options, getValues, setValue };
};
