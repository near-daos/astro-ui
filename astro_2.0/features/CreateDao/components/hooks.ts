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
import { useCallback, useEffect, useState } from 'react';
import {
  DAO_PROPOSALS_OPTIONS,
  DAO_STRUCTURE_OPTIONS,
  DAO_VOTING_POWER_OPTIONS,
} from 'astro_2.0/features/CreateDao/components/data';
import { httpService } from 'services/HttpService';
// import { SputnikNearService } from 'services/sputnik';
import { CreateDaoCustomInput, CreateDaoInput } from 'types/dao';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { configService } from 'services/ConfigService';
import { SputnikWalletError } from 'errors/SputnikWalletError';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  getInitialValues,
  updateAction,
} from 'astro_2.0/features/CreateDao/components/helpers';
import { useStateMachine } from 'little-state-machine';
import { useAuthContext } from 'context/AuthContext';

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

export function useImageUpload(): {
  uploadImage: (file: File) => Promise<string>;
} {
  const uploadImage = useCallback(async (img: File) => {
    try {
      if (img) {
        const { data } = await httpService.post('/api/upload-to-s3', img, {
          baseURL: '',
        });

        return data;
      }
    } catch (e) {
      return '';
    }

    return '';
  }, []);

  return { uploadImage };
}

export function useCreateDao(): {
  uploadAssets: (defaultFlag: string) => Promise<string>;
  createDao: (
    daoName: string,
    data: CreateDaoInput | null,
    args?: CreateDaoCustomInput
  ) => Promise<void>;
} {
  const router = useRouter();
  const { t } = useTranslation();
  const { accountId, nearService } = useAuthContext();
  const { actions, state } = useStateMachine({ updateAction });

  const uploadImg = useCallback(async (img: File) => {
    if (img) {
      const { data } = await httpService.post('/api/upload-to-s3', img, {
        baseURL: '',
      });

      return data;
    }

    return '';
  }, []);

  async function loadImage(defaultFlag: string) {
    const response = await fetch(defaultFlag);
    const blob = await response.blob();

    return new File([blob], 'image.png', { type: 'image/png' });
  }

  const uploadAssets = useCallback(
    async (defaultFlag: string) => {
      try {
        const defaultFlagFile = await loadImage(defaultFlag);

        return uploadImg(defaultFlagFile);
      } catch (e) {
        return '';
      }
    },
    [uploadImg]
  );

  const createDao = useCallback(
    async (
      daoName: string,
      data: CreateDaoInput | null,
      args?: CreateDaoCustomInput
    ) => {
      try {
        if (data) {
          await nearService?.createDao(data);
        } else if (args) {
          await nearService?.createDao(args);
        }

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: t('notifications.transactionDelay'),
          lifetime: 20000,
        });

        sessionStorage.removeItem('__LSM__');
        actions.updateAction(
          getInitialValues(accountId, state.assets.defaultFlag)
        );

        const { nearConfig } = configService.get();

        await router.push(`/dao/${daoName}.${nearConfig?.contractName ?? ''}`);
      } catch (error) {
        console.warn(error);

        if (error instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: error.message,
            lifetime: 20000,
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, uploadImg]
  );

  return {
    createDao,
    uploadAssets,
  };
}
