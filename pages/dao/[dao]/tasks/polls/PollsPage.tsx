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
import styles from 'pages/dao/[dao]/tasks/polls/polls.module.scss';
import { SputnikService } from 'services/SputnikService';
import { Proposal } from 'types/proposal';

interface PollsPageProps {
  data: Proposal[];
}

const PollsPage: FC<PollsPageProps> = () => {
  const { query } = useRouter();

  const [pollsList, setPollsList] = useState<Proposal[]>([]);

  const [showModal] = useModal(CreatePollDialog);

  const [showResetScroll, setShowResetScroll] = useState(false);
  const scrollListRef = useRef<VariableSizeList>(null);
  const isMobile = useMedia('(max-width: 767px)');

  function fetchPolls(daoId: string) {
    SputnikService.getPolls(daoId).then(res => setPollsList(res));
  }

  const handleScroll = useCallback(({ scrollOffset }: ListOnScrollProps) => {
    if (scrollOffset > 100) {
      setShowResetScroll(true);
    } else {
      setShowResetScroll(false);
    }
  }, []);

  const handleCreateClick = useCallback(async () => {
    await showModal();
    fetchPolls(query.dao as string);
  }, [query.dao, showModal]);

  const resetScroll = useCallback(() => {
    if (!scrollListRef || !scrollListRef.current) {
      return;
    }

    scrollListRef.current.scrollToItem(0);
  }, [scrollListRef]);

  useEffect(() => {
    if (query.dao) {
      fetchPolls(query.dao as string);
    }
  }, [query.dao]);

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
          itemSize={() => (isMobile ? 230 : 158)}
          ref={scrollListRef}
          renderItem={renderCard}
        />
        {showResetScroll ? (
          <IconButton
            icon="buttonResetScroll"
            size={isMobile ? 'medium' : 'large'}
            className={styles.reset}
            onClick={resetScroll}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PollsPage;
