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
import { useWalletContext } from 'context/WalletContext';
import { GA_EVENTS, sendGAEvent } from 'utils/ga';

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
    data: CreateDaoInput | CreateDaoCustomInput
  ) => Promise<void>;
} {
  const router = useRouter();
  const { t } = useTranslation();
  const { accountId, nearService } = useWalletContext();
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
    async (daoName: string, data: CreateDaoInput | CreateDaoCustomInput) => {
      try {
        await nearService?.createDao(data);

        const { nearConfig } = configService.get();
        const daoId = `${daoName}.${nearConfig?.contractName ?? ''}`;

        sendGAEvent({
          name: GA_EVENTS.CREATE_DAO,
          daoId,
          accountId,
        });

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: t('notifications.transactionDelay'),
          lifetime: 20000,
        });

        sessionStorage.removeItem('__LSM__');
        actions.updateAction(
          getInitialValues(accountId, state.assets.defaultFlag)
        );

        await router.push(`/dao/${daoId}`);
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
    [router, uploadImg, nearService]
  );

  return {
    createDao,
    uploadAssets,
  };
}
