import isEqual from 'lodash/isEqual';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { SINGLE_DAO_PAGE } from 'constants/routing';

import { useDao } from 'hooks/useDao';

import { SputnikWalletError } from 'errors/SputnikWalletError';

import { Button } from 'components/button/Button';
import { Badge, Variant } from 'components/badge/Badge';

import {
  getInitialData,
  getNewProposalObject,
  VotingPolicyPageInitialData,
} from 'features/vote-policy/helpers';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DaoSettingsBanner } from 'features/vote-policy/components/DaoSettingsBanner';
import { EditDefaultPolicy } from 'features/vote-policy/components/EditDefaultPolicy';

import { SputnikNearService } from 'services/sputnik';

import styles from './voting-policy-page.module.scss';

function getBadgeVariant(index: number): Variant {
  const variants = [
    'violet',
    'blurple',
    'blue',
    'turqoise',
    'green',
    'red',
    'orange',
    'yellow',
    'primary',
  ];

  return (variants[index] || variants[index % variants.length]) as Variant;
}

const VotingPolicyPage: FC = () => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const dao = useDao(daoId);

  const accountId = SputnikNearService.getAccountId();

  const [data, setData] = useState<VotingPolicyPageInitialData | null>(null);

  useEffect(() => {
    if (dao && !data) setData(getInitialData(dao));
  }, [dao, data]);

  const [viewMode, setViewMode] = useState(true);

  const handleChange = useCallback(
    (name, value) => {
      if (data) {
        setData({
          ...data,
          [name]: {
            ...value,
            isDirty: true,
          },
        });
      }
    },
    [data]
  );

  const handleSubmit = useCallback(async () => {
    setViewMode(true);

    if (data && dao && !isEqual(getInitialData(dao), data)) {
      try {
        const proposal = getNewProposalObject(dao, data);

        await SputnikNearService.createProposal(proposal);

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
          lifetime: 20000,
        });

        setData(getInitialData(dao));

        router.push({
          pathname: SINGLE_DAO_PAGE,
          query: {
            dao: daoId,
          },
        });
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
    }
  }, [dao, data, daoId, router]);

  const onChangeButtonClick = useCallback(() => {
    if (accountId) {
      setViewMode(false);
    } else {
      SputnikNearService.login();
    }
  }, [accountId]);

  if (!data || !dao) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Voting policy</h1>
        {viewMode && (
          <Button
            className={styles.changeButton}
            size="small"
            variant="black"
            onClick={onChangeButtonClick}
          >
            Change
          </Button>
        )}
      </div>
      <DaoSettingsBanner
        onCancel={() => {
          setViewMode(true);
          setData(getInitialData(dao));
        }}
        onSubmit={handleSubmit}
        onChange={handleChange}
        viewMode={viewMode}
        data={data.daoSettings}
        scope="policy"
      />
      <div className={styles.content}>
        <div className={styles.groupsWrapper}>
          {dao.groups.map((group, i) => {
            return (
              <Badge size="small" key={group.slug} variant={getBadgeVariant(i)}>
                {group.name}
              </Badge>
            );
          })}
        </div>
        <div className={styles.separator} />
        <div className={styles.policyWrapper}>
          <div className={styles.policyLabel}>Voting policy default</div>
          {viewMode ? (
            <div className={styles.policy}>
              <div>{data.policy.voteBy}</div>
              <div className={styles.bold}>{data.policy.amount}</div>
              <div>{data.policy.threshold}</div>
              <div>to pass</div>
            </div>
          ) : (
            <EditDefaultPolicy
              policy={data.policy}
              onChange={value => {
                handleChange('policy', value);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingPolicyPage;
