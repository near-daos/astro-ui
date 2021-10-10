import React, { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CreatePollDialog } from 'features/poll/dialogs/create-poll-dialog/CreatePollDialog';
import { ProposalCardRenderer } from 'components/cards/proposal-card';
import { useModal } from 'components/modal/hooks';
import { Button } from 'components/button/Button';
import styles from 'pages/dao/[dao]/tasks/polls/polls.module.scss';
import { SputnikService } from 'services/SputnikService';
import { Proposal } from 'types/proposal';
import { ProposalsTabsFilter } from 'components/proposals-tabs-filter';
import { filterProposalsByStatus } from 'features/dao-home/helpers';

interface PollsPageProps {
  data: Proposal[];
}

const PollsPage: FC<PollsPageProps> = () => {
  const { query } = useRouter();

  const [pollsList, setPollsList] = useState<Proposal[]>([]);

  const [showModal] = useModal(CreatePollDialog);

  function fetchPolls(daoId: string) {
    SputnikService.getPolls(daoId).then(res => setPollsList(res));
  }

  const handleCreateClick = useCallback(async () => {
    await showModal();
    fetchPolls(query.dao as string);
  }, [query.dao, showModal]);

  useEffect(() => {
    if (query.dao) {
      fetchPolls(query.dao as string);
    }
  }, [query.dao]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span>Polls</span>
        <Button variant="black" size="small" onClick={handleCreateClick}>
          Create new poll
        </Button>
      </div>
      <div className={styles.polls}>
        <ProposalsTabsFilter
          filter={filterProposalsByStatus}
          proposals={pollsList}
          tabsConfig={[
            {
              label: 'Active proposals',
              className: styles.activeProposalsTab
            },
            {
              label: 'Approved',
              className: styles.approvedProposalsTab
            },
            {
              label: 'Failed',
              className: styles.failedProposalsTab
            }
          ]}
          tabContentRenderer={(proposals: Proposal[]) => (
            <div className={styles.proposalsView}>
              {proposals.map(item => (
                <div className={styles.proposalCardWrapper}>
                  <ProposalCardRenderer proposal={item} />
                </div>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default PollsPage;
