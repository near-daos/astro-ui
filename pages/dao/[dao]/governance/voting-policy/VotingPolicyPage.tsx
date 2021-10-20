import isEqual from 'lodash/isEqual';
import { Button } from 'components/button/Button';
import { DaoSettingsBanner } from 'features/vote-policy/components/banner';
import {
  getInitialData,
  getNewProposalObject,
  VotingPolicyPageInitialData
} from 'features/vote-policy/helpers';
import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { SputnikService } from 'services/SputnikService';
import { Badge, Variant } from 'components/badge/Badge';
import EditDefaultPolicy from 'features/vote-policy/components/edit-default-policy/EditDefaultPolicy';

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
    'primary'
  ];

  return (variants[index] || variants[index % variants.length]) as Variant;
}

const VotingPolicyPage: FC = () => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const dao = useDao(daoId);

  const accountId = SputnikService.getAccountId();

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
            isDirty: true
          }
        });
      }
    },
    [data]
  );

  const handleSubmit = useCallback(async () => {
    setViewMode(true);

    if (data && dao && !isEqual(getInitialData(dao), data)) {
      const proposal = getNewProposalObject(dao, data);

      await SputnikService.createProposal(proposal);

      setData(getInitialData(dao));
    }
  }, [dao, data]);

  const onChangeButtonClick = useCallback(() => {
    if (accountId) {
      setViewMode(false);
    } else {
      SputnikService.login();
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
