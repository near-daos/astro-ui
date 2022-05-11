import { useCallback, useEffect, useState } from 'react';
import { Contract } from 'near-api-js';
import { DAO, DaoVersion } from 'types/dao';
import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { Settings, UpgradeStatus, UpgradeSteps } from 'types/settings';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { configService } from 'services/ConfigService';
import { useWalletContext } from 'context/WalletContext';

type RawMeta = [string, DaoVersion];

interface ExtendedContract extends Contract {
  // eslint-disable-next-line camelcase
  get_default_code_hash: () => Promise<string>;
  // eslint-disable-next-line camelcase
  get_contracts_metadata: () => Promise<RawMeta[]>;
}

type Version = [string, { version: number[] }];

export function useCheckDaoUpgrade(
  dao: DAO
): {
  version: Version | null;
  loading: boolean;
} {
  const { nearService } = useWalletContext();
  const [loading, setLoading] = useState(true);
  const { appConfig } = configService.get();

  const [version, setVersion] = useState<Version | null>(null);

  const getUpgradeInfo = useCallback(async () => {
    try {
      const account = nearService?.getAccount();

      if (!appConfig || !account) {
        return;
      }

      const contract = new Contract(account, appConfig.NEAR_CONTRACT_NAME, {
        viewMethods: ['get_default_code_hash', 'get_contracts_metadata'],
        changeMethods: [],
      }) as ExtendedContract;

      const metadata = await contract.get_contracts_metadata();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sortedMeta = metadata.sort((v1, v2) => {
        if (v1[1].version > v2[1].version) {
          return 1;
        }

        if (v1[1].version < v2[1].version) {
          return -1;
        }

        return 0;
      });

      const currentVersionHashIndex = sortedMeta.findIndex(
        meta => meta[0] === dao.daoVersion?.hash
      );
      const nextVersion =
        currentVersionHashIndex === -1
          ? sortedMeta[0]
          : sortedMeta[currentVersionHashIndex + 1];

      const hash = nextVersion[0];

      if (hash === dao.daoVersion?.hash) {
        setLoading(false);

        return;
      }

      setVersion(nextVersion);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, [appConfig, dao.daoVersion, nearService]);

  useEffect(() => {
    (async () => {
      await getUpgradeInfo();
    })();
  }, [getUpgradeInfo]);

  return {
    version,
    loading,
  };
}

export function useUpgradeStatus(
  daoId: string
): {
  loading: boolean;
  upgradeStatus: UpgradeStatus | null;
  update: ({
    upgradeStep,
    proposalId,
    versionHash,
  }: {
    upgradeStep: UpgradeSteps | null;
    proposalId: number | null;
    versionHash: string;
  }) => Promise<void>;
} {
  const { accountId, nearService } = useWalletContext();
  const [upgradeStatus, setUpgradeStatus] = useState<UpgradeStatus | null>(
    null
  );

  const [{ loading }, getSettings] = useAsyncFn(async () => {
    const settings = await SputnikHttpService.getDaoSettings(daoId);

    if (settings?.daoUpgrade) {
      setUpgradeStatus(settings.daoUpgrade);
    }
  }, [daoId]);

  const [{ loading: updatingStatus }, update] = useAsyncFn(
    async ({ upgradeStep, proposalId, versionHash }) => {
      try {
        const settings =
          (await SputnikHttpService.getDaoSettings(daoId)) ?? ({} as Settings);

        const newSettings: Settings = {
          ...settings,
          daoUpgrade: {
            upgradeStep,
            proposalId,
            versionHash,
          },
        };

        const publicKey = await nearService?.getPublicKey();
        const signature = await nearService?.getSignature();

        if (publicKey && signature && accountId) {
          const resp = await SputnikHttpService.updateDaoSettings(daoId, {
            accountId,
            publicKey,
            signature,
            settings: newSettings,
          });

          if (resp.daoUpgrade) {
            setUpgradeStatus(resp.daoUpgrade);
          }
        }
      } catch (err) {
        const { message } = err;

        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: message,
        });
      }
    },
    [daoId, nearService]
  );

  useEffect(() => {
    (async () => {
      await getSettings();
    })();
  }, [getSettings]);

  return {
    loading: loading || updatingStatus,
    upgradeStatus,
    update,
  };
}
