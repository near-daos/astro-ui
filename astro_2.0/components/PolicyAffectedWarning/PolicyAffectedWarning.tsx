import React, { FC } from 'react';
import { useTranslation, Trans } from 'next-i18next';
import { Proposal, ProposalType } from 'types/proposal';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { useRouter } from 'next/router';

import styles from './PolicyAffectedWarning.module.scss';

export interface PolicyAffectedWarningProps {
  data: Proposal[];
  className: string;
}

export const PolicyAffectedWarning: FC<PolicyAffectedWarningProps> = ({
  data,
  className = '',
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  if (!data?.length) {
    return null;
  }

  let title = t('daoConfig');

  if (data[0].kind.type === ProposalType.ChangePolicy) {
    title = t('votingPolicy');
  }

  return (
    <div className={className}>
      <div className={styles.root}>
        <div className={styles.status}>
          <Icon name="info" className={styles.icon} />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <Trans i18nKey="policyAffectedProposalsTitle" values={{ title }} />
          </div>
          <div className={styles.text}>
            <Trans i18nKey="policyAffectedProposalsText" values={{ title }} />
          </div>
        </div>
        <div className={styles.control}>
          {data.length === 1 && (
            <Button
              variant="primary"
              onClick={() =>
                router.push(`/dao/${data[0].daoId}/proposals/${data[0].id}`)
              }
            >
              {t('viewProposal')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
