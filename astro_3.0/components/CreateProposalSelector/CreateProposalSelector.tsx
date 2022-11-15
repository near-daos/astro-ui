import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAsync } from 'react-use';

import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import {
  LetterHeadWidget,
  ProposalCardRenderer,
} from 'astro_2.0/components/ProposalCardRenderer';
import { AnimatedLayout } from 'astro_3.0/components/AnimatedLayout';

import { ProposalType, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';

import { useWalletContext } from 'context/WalletContext';
import { DummyProposalCard } from 'astro_3.0/components/CreateProposalSelector/components/DummyProposalCard';
import { SputnikHttpService } from 'services/sputnik';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import cn from 'classnames';
import { getDaoAvatar } from 'astro_3.0/features/Sidebar/helpers';
import { useDaoContext } from 'services/ApiService/hooks/useDaoContext';
import {
  DaoSettingsContext,
  useDaoSettingsData,
} from 'context/DaoSettingsContext';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { DaoTokensContext } from 'context/DaoTokensContext';

import { SHOW_PROPOSAL_SELECTOR } from 'constants/common';

import { useFlags } from 'launchdarkly-react-client-sdk';
import { useAccountDaos } from 'services/ApiService/hooks/useAccountDaos';
import { useDaoContext as useDaoContextFromSputnik } from 'hooks/useDaoContext';

import styles from './CreateProposalSelector.module.scss';

export const CreateProposalSelector: FC = () => {
  const { accountId } = useWalletContext();
  const [dao, setDao] = useState<DAO | null>(null);
  const [visible, setVisible] = useState(false);

  const { useOpenSearchDataApi } = useFlags();
  const daoContextFromOpenSearch = useDaoContext(dao?.id);
  const daoContextFromSputnik = useDaoContextFromSputnik(accountId, dao?.id);
  const daoContext = daoContextFromSputnik || daoContextFromOpenSearch;

  const { settings, loading, update } = useDaoSettingsData(dao?.id);
  const { tokens } = useDaoCustomTokens(dao?.id);
  const { data } = useAccountDaos();

  const { value: apiData } = useAsync(async () => {
    if (
      !accountId ||
      useOpenSearchDataApi ||
      useOpenSearchDataApi === undefined
    ) {
      return null;
    }

    return SputnikHttpService.getAccountDaos(accountId);
  }, [accountId]);

  const daos = apiData || data;

  const handleVisibility = useCallback(() => {
    setVisible(true);
  }, []);

  const handleDone = useCallback(() => {
    setDao(null);
    setVisible(false);
  }, []);

  const handleDaoSelect = useCallback(
    async val => {
      const selectedDao = daos?.find(item => item.id === val);

      if (selectedDao) {
        const selectedDaoData = await SputnikHttpService.getDaoById(
          selectedDao.id
        );

        setDao(selectedDaoData);
      }
    },
    [daos]
  );

  useEffect(() => {
    document.addEventListener(
      SHOW_PROPOSAL_SELECTOR,
      handleVisibility as EventListener
    );

    return () =>
      document.removeEventListener(
        SHOW_PROPOSAL_SELECTOR,
        handleVisibility as EventListener
      );
  }, [handleVisibility]);

  const daosOptions = useMemo(() => {
    if (!daos) {
      return [];
    }

    return daos.map(item => {
      const avatar = getDaoAvatar(item);

      return {
        value: item.id,
        label: (
          <div className={styles.row}>
            <div
              className={cn(styles.avatar)}
              style={{
                backgroundImage: `url(${avatar})`,
              }}
            />
            <div className={styles.name}>{item.id}</div>
          </div>
        ),
      };
    });
  }, [daos]);

  const settingsContextValue = useMemo(() => {
    return {
      settings,
      update,
      loading,
    };
  }, [loading, settings, update]);

  const tokensContextValue = useMemo(() => {
    return {
      tokens,
    };
  }, [tokens]);

  const allowedVariant = useMemo(() => {
    if (!daoContext) {
      return null;
    }

    const allowed = Object.entries(
      daoContext.userPermissions.allowedProposalsToCreate
    ).find(([, value]) => value);

    if (allowed) {
      return allowed[0] as ProposalVariant;
    }

    return null;
  }, [daoContext]);

  return (
    <AnimatedLayout>
      {visible ? (
        <div className={styles.root}>
          <DropdownSelect
            isBorderless
            placeholder={
              <div className={styles.row}>
                <div
                  className={cn(styles.avatar, styles.selected)}
                  style={{
                    backgroundImage: `url(/avatars/defaltDaoAvatar.png)`,
                  }}
                />
                <div className={styles.placeholder}>Select DAO</div>
              </div>
            }
            className={styles.dropdown}
            options={daosOptions}
            onChange={handleDaoSelect}
          />
          {dao && daoContext && allowedVariant ? (
            <DaoTokensContext.Provider value={tokensContextValue}>
              <DaoSettingsContext.Provider value={settingsContextValue}>
                <CreateProposal
                  showInfo={false}
                  className={styles.createProposal}
                  dao={dao}
                  daoTokens={tokens}
                  userPermissions={daoContext.userPermissions}
                  proposalVariant={allowedVariant}
                  showFlag={false}
                  onCreate={handleDone}
                  onClose={handleDone}
                />
              </DaoSettingsContext.Provider>
            </DaoTokensContext.Provider>
          ) : (
            <ProposalCardRenderer
              daoFlagNode={null}
              className={styles.dummyCard}
              letterHeadNode={
                <LetterHeadWidget
                  type={ProposalType.Transfer}
                  proposalVariant={ProposalVariant.ProposeTransfer}
                />
              }
              proposalCardNode={
                <DummyProposalCard onClose={() => setVisible(false)} />
              }
            />
          )}
        </div>
      ) : null}
    </AnimatedLayout>
  );
};
