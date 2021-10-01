import {
  useFormContext,
  UseFormGetValues,
  UseFormSetValue
} from 'react-hook-form';
import {
  DAOFormValues,
  DAOProposalsType,
  DaoSettingOption,
  DAOStructureType,
  DAOVotingPowerType
} from 'features/create-dao/components/steps/types';
import { useEffect, useState } from 'react';
import {
  DAO_PROPOSALS_OPTIONS,
  DAO_STRUCTURE_OPTIONS,
  DAO_VOTING_POWER_OPTIONS
} from 'features/create-dao/components/steps/data';

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
    'proposals'
  ]);

  const [options, setOptions] = useState<
    DaoSettingOption<DAOStructureType | DAOVotingPowerType | DAOProposalsType>[]
  >([]);

  useEffect(() => {
    if (structure === 'flat') {
      DAO_STRUCTURE_OPTIONS.flat.disabled = false;
      DAO_VOTING_POWER_OPTIONS.weighted.disabled = true;
      DAO_PROPOSALS_OPTIONS.closed.disabled = true;
      setOptions([
        DAO_STRUCTURE_OPTIONS[structure],
        DAO_VOTING_POWER_OPTIONS.democratic,
        DAO_PROPOSALS_OPTIONS[proposals]
      ]);
      setValue('voting', 'democratic');
      setValue('proposals', 'open');
    } else if (voting === 'weighted') {
      setValue('structure', 'groups');

      DAO_STRUCTURE_OPTIONS.flat.disabled = true;
      setOptions([
        DAO_STRUCTURE_OPTIONS.groups,
        DAO_VOTING_POWER_OPTIONS[voting],
        DAO_PROPOSALS_OPTIONS[proposals]
      ]);
    } else {
      DAO_VOTING_POWER_OPTIONS.weighted.disabled = false;
      DAO_STRUCTURE_OPTIONS.flat.disabled = false;

      setOptions([
        DAO_STRUCTURE_OPTIONS[structure],
        DAO_VOTING_POWER_OPTIONS[voting],
        DAO_PROPOSALS_OPTIONS[proposals]
      ]);
    }
  }, [structure, voting, proposals, setValue]);

  return { options, getValues, setValue };
};
