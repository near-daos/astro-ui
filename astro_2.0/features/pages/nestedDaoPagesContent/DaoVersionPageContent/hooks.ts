import { useCallback, useEffect, useState } from 'react';
import { DAO } from 'types/dao';
import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { Settings, UpgradeStatus, UpgradeSteps } from 'types/settings';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { configService } from 'services/ConfigService';
import { useWalletContext } from 'context/WalletContext';
import { useDaoSettings } from 'context/DaoSettingsContext';

type Version = [string, { version: number[] }];

export function useCheckDaoUpgrade(dao: DAO): {
  version: Version | null;
  loading: boolean;
} {
  const { nearService } = useWalletContext();
  const [loading, setLoading] = useState(true);
  const { appConfig } = configService.get();

  const [version, setVersion] = useState<Version | null>(null);

  const getUpgradeInfo = useCallback(async () => {
    try {
      if (!nearService) {
        return;
      }

      const accountId = nearService.getAccountId();

      if (!appConfig || !accountId || dao.daoVersion?.version[0] === 2) {
        return;
      }

      const metadata = await nearService.getContractsMetadata();

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

      const currentVersionMeta = sortedMeta.find(
        meta => meta[0] === dao.daoVersion?.hash
      );

      const nextVersion = currentVersionMeta
        ? sortedMeta.find(
            meta => meta[1].version[0] > currentVersionMeta[1].version[0]
          )
        : null;

      if (!nextVersion) {
        setLoading(false);

        return;
      }

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

export function useUpgradeStatus(daoId: string): {
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
  const { accountId, nearService, pkAndSignature } = useWalletContext();
  const [upgradeStatus, setUpgradeStatus] = useState<UpgradeStatus | null>(
    null
  );
  const { loading, settings } = useDaoSettings();

  useEffect(() => {
    if (!settings) {
      return;
    }

    if (settings?.daoUpgrade) {
      setUpgradeStatus(settings.daoUpgrade);
    }
  }, [settings]);

  const [{ loading: updatingStatus }, update] = useAsyncFn(
    async ({ upgradeStep, proposalId, versionHash }) => {
      if (!settings || !pkAndSignature) {
        return;
      }

      try {
        const newSettings: Settings = {
          ...settings,
          daoUpgrade: {
            upgradeStep,
            proposalId,
            versionHash,
          },
        };

        const { publicKey, signature } = pkAndSignature;

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
    [daoId, nearService, pkAndSignature]
  );

  return {
    loading: loading || updatingStatus,
    upgradeStatus,
    update,
  };
}
