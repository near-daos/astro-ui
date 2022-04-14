import { useCallback, useEffect, useState } from 'react';
import { Contract } from 'near-api-js';
import { useAuthContext } from 'context/AuthContext';
import { DAO, DaoVersion } from 'types/dao';
import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { Settings, UpgradeStatus, UpgradeSteps } from 'types/settings';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

type RawMeta = [string, DaoVersion];

interface ExtendedContract extends Contract {
  // eslint-disable-next-line camelcase
  get_default_code_hash: () => Promise<string>;
  // eslint-disable-next-line camelcase
  get_contracts_metadata: () => Promise<RawMeta[]>;
}

export function useCheckDaoUpgrade(
  dao: DAO
): {
  versionHash: string | null;
  loading: boolean;
} {
  const { nearService } = useAuthContext();
  const [loading, setLoading] = useState(true);

  const [versionHash, setVersionHash] = useState<string | null>(null);

  const getUpgradeInfo = useCallback(async () => {
    const account = nearService?.getAccount();

    if (!account) {
      return;
    }

    const contract = new Contract(
      account,
      'sputnik-factory-v3.ctindogaru.testnet',
      {
        viewMethods: ['get_default_code_hash', 'get_contracts_metadata'],
        changeMethods: [],
      }
    ) as ExtendedContract;

    // todo - this is just to enable upgrade flow for demo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [hash, metadata] = await Promise.all([
      contract.get_default_code_hash(),
      contract.get_contracts_metadata(),
    ]);

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

    // // todo - temp!!!
    setVersionHash(dao.daoVersion.hash);

    // if (hash === dao.daoVersion.hash) {
    //   setLoading(false);
    //
    //   return;
    // }
    //
    // const currentVersionHashIndex = sortedMeta.findIndex(
    //   meta => meta[0] === dao.daoVersion.hash
    // );
    // const nextVersionHash = sortedMeta[currentVersionHashIndex + 1];
    //
    // setVersionHash(nextVersionHash[0]);
    setLoading(false);
  }, [dao.daoVersion.hash, nearService]);

  useEffect(() => {
    (async () => {
      await getUpgradeInfo();
    })();
  }, [getUpgradeInfo]);

  return {
    versionHash,
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
  const { accountId, nearService } = useAuthContext();
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
        const settings = await SputnikHttpService.getDaoSettings(daoId);

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

          setUpgradeStatus(resp.daoUpgrade);
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
