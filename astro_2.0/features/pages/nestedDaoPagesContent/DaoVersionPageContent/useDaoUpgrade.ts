import { useAuthContext } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { Contract } from 'near-api-js';
import { DAO, DaoVersion } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

type Step = {
  label: string;
  value: string;
  isCurrent: boolean;
};

const upgradeSteps: Step[] = [
  {
    label: 'Get latest code',
    value: 'getLatestCode',
    isCurrent: true,
  },
  {
    label: 'Upgrade self',
    value: 'upgradeSelf',
    isCurrent: false,
  },
  {
    label: 'Remove upgrade code blob',
    value: 'removeUpgradeCodeBlob',
    isCurrent: false,
  },
];

enum UpgradeSteps {
  GetUpgradeCode,
  UpgradeSelf,
  RemoveUpgradeCode,
}

type UpgradeStatus = {
  upgradeStep: UpgradeSteps;
  proposalId?: string;
  versionHash: string;
};

type DaoProperties = {
  upgradeStatus?: UpgradeStatus;
};

type RawMeta = [string, DaoVersion];

const properties: DaoProperties = {
  upgradeStatus: {
    upgradeStep: UpgradeSteps.RemoveUpgradeCode,
    proposalId: undefined,
    versionHash: '3.0',
  },
};

export interface DaoUpgradeStatus {
  upgradeStatus?: UpgradeStatus;
  currentProposalVariant?: ProposalVariant;
  upgradeSteps: Step[];
  upgradePossible: boolean;
}

export const useDaoUpgrade = (dao: DAO): DaoUpgradeStatus => {
  const { nearService } = useAuthContext();
  const [steps, setSteps] = useState<Step[]>(upgradeSteps);
  const [upgradeStatus, setUpgradeStatus] = useState<
    UpgradeStatus | undefined
  >();
  const [currentProposalVariant, setProposalVariant] = useState<
    ProposalVariant
  >(ProposalVariant.ProposeGetUpgradeCode);
  const [upgradePossible, setUpgradePossible] = useState(false);

  useEffect(() => {
    // get actual upgrade status from the backend
    setUpgradeStatus(properties.upgradeStatus);
  }, []);

  useEffect(() => {
    if (!upgradeStatus) {
      return;
    }

    const { upgradeStep } = upgradeStatus;

    const updatedSteps = upgradeSteps?.map((value, index) =>
      index === upgradeStep
        ? { ...value, isCurrent: true }
        : { ...value, isCurrent: false }
    );

    setSteps(updatedSteps);

    switch (upgradeStep) {
      case UpgradeSteps.GetUpgradeCode:
        setProposalVariant(ProposalVariant.ProposeGetUpgradeCode);
        break;
      case UpgradeSteps.UpgradeSelf:
        setProposalVariant(ProposalVariant.ProposeUpgradeSelf);
        break;
      case UpgradeSteps.RemoveUpgradeCode:
        setProposalVariant(ProposalVariant.ProposeRemoveUpgradeCode);
        break;
      default:
        setProposalVariant(ProposalVariant.ProposeGetUpgradeCode);
    }
  }, [upgradeStatus]);

  useEffect(() => {
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
    );

    const getUpgradeInfo = async () => {
      const [hash, metadata] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        contract.get_default_code_hash(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        contract.get_contracts_metadata() as RawMeta[],
      ]);

      const sortedMeta = metadata.sort((v1, v2) => {
        if (v1[1].version > v2[1].version) {
          return 1;
        }

        if (v1[1].version < v2[1].version) {
          return -1;
        }

        return 0;
      });

      if (hash === dao.daoVersion.hash) {
        setUpgradePossible(false);

        return;
      }

      const currentVersionHashIndex = sortedMeta.findIndex(
        meta => meta[0] === dao.daoVersion.hash
      );
      const nextVersionHash = sortedMeta[currentVersionHashIndex + 1];

      setUpgradePossible(true);

      setUpgradeStatus({
        upgradeStep: UpgradeSteps.GetUpgradeCode,
        versionHash: nextVersionHash[0],
      });
    };

    getUpgradeInfo();
  }, [dao.daoVersion.hash, nearService]);

  return {
    currentProposalVariant,
    upgradeStatus,
    upgradeSteps: steps,
    upgradePossible,
  };
};
