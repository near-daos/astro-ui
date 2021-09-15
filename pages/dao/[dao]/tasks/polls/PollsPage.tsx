import React, {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { ListOnScrollProps, VariableSizeList } from 'react-window';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';

import { CreatePollDialog } from 'features/poll/dialogs/create-poll-dialog/CreatePollDialog';
import { ProposalCardRenderer } from 'components/cards/proposal-card';
import { useModal } from 'components/modal/hooks';
import ScrollList from 'components/scroll-list/ScrollList';
import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';
import { VOTE_DETAIL_DATA, BOND_DETAIL_DATA } from 'lib/mocks/tasks/polls';
import styles from 'pages/dao/[dao]/tasks/polls/polls.module.scss';
import { SputnikService } from 'services/SputnikService';
import { Proposal } from 'types/proposal';

interface PollsPageProps {
  data: Proposal[];
}

const PollsPage: FC<PollsPageProps> = () => {
  const { query } = useRouter();
  const [pollsList, setPollsList] = useState<Proposal[]>([]);

  const [showCreatePollDialog] = useModal(CreatePollDialog, {
    voteDetails: VOTE_DETAIL_DATA,
    bondDetail: BOND_DETAIL_DATA
  });

  const [showResetScroll, setShowResetScroll] = useState(false);
  const scrollListRef = useRef<VariableSizeList>(null);
  const isMobileOrTablet = useMedia('(max-width: 767px)');

  const handleScroll = useCallback(({ scrollOffset }: ListOnScrollProps) => {
    if (scrollOffset > 100) {
      setShowResetScroll(true);
    } else {
      setShowResetScroll(false);
    }
  }, []);

  const handleCreateClick = useCallback(() => showCreatePollDialog(), [
    showCreatePollDialog
  ]);

  const resetScroll = useCallback(() => {
    if (!scrollListRef || !scrollListRef.current) {
      return;
    }

    scrollListRef.current.scrollToItem(0);
  }, [scrollListRef]);

  useEffect(() => {
    if (query.id) {
      SputnikService.getPolls(query.id as string).then(res =>
        setPollsList(res)
      );
    }
  }, [query.id]);

  const renderCard = ({
    index,
    style
  }: {
    index: number;
    style: CSSProperties;
  }) => (
    <div
      style={{
        ...style,
        marginTop: '0',
        marginBottom: '16px'
      }}
    >
      <ProposalCardRenderer proposal={pollsList[index]} />
    </div>
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>Polls</div>
      <div className={styles.create}>
        <Button variant="secondary" onClick={handleCreateClick}>
          Create new poll
        </Button>
      </div>
      <div className={styles.polls}>
        <ScrollList
          itemCount={pollsList.length}
          onScroll={handleScroll}
          height={700}
          itemSize={() => (isMobileOrTablet ? 186 : 120)}
          ref={scrollListRef}
          renderItem={renderCard}
        />
        {showResetScroll ? (
          <IconButton
            icon="buttonResetScroll"
            size={isMobileOrTablet ? 'medium' : 'large'}
            className={styles.reset}
            onClick={resetScroll}
          />
        ) : null}
      </div>
    </div>
  );
};

export async function getServerSideProps({
  query
}: {
  query: string;
}): Promise<{
  props: { data: Proposal[] };
}> {
  const data = await SputnikService.getProposals(query);

  return {
    props: {
      data
    }
  };
}

export default PollsPage;
