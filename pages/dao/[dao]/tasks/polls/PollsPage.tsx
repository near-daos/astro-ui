import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { CreatePollDialog } from 'features/poll/dialogs/create-poll-dialog/CreatePollDialog';
import { ProposalCardRenderer } from 'components/cards/proposal-card';
import { useModal } from 'components/modal/hooks';
import { Button } from 'components/button/Button';
import styles from 'pages/dao/[dao]/tasks/polls/polls.module.scss';
import { SputnikService } from 'services/SputnikService';
import { Proposal } from 'types/proposal';
import { ProposalsTabsFilter } from 'components/proposals-tabs-filter';
import { filterProposalsByStatus } from 'features/dao-home/helpers';
import { useAuthContext } from 'context/AuthContext';
import { NoResultsView } from 'features/no-results-view';

interface PollsPageProps {
  data: Proposal[];
}

const PollsPage: FC<PollsPageProps> = () => {
  const { query } = useRouter();
  const { accountId, login } = useAuthContext();

  const [pollsList, setPollsList] = useState<Proposal[]>([]);

  const [showModal] = useModal(CreatePollDialog);

  function fetchPolls(daoId: string) {
    SputnikService.getPolls(daoId).then(res => setPollsList(res));
  }

  const showCreatePollDialog = useCallback(async () => {
    await showModal();
    fetchPolls(query.dao as string);
  }, [query.dao, showModal]);

  useEffect(() => {
    if (query.dao) {
      fetchPolls(query.dao as string);
    }
  }, [query.dao]);

  const handleCreateClick = useCallback(
    () => (accountId ? showCreatePollDialog() : login()),
    [login, showCreatePollDialog, accountId]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Polls</h1>
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
          tabContentRenderer={(proposals: Proposal[]) => {
            if (isEmpty(proposals)) {
              return <NoResultsView title="No proposals here" />;
            }

            return (
              <div className={styles.proposalsView}>
                {proposals.map(item => (
                  <div className={styles.proposalCardWrapper}>
                    <ProposalCardRenderer proposal={item} />
                  </div>
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default PollsPage;
