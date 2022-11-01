import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { formatDistanceToNow, parseISO, differenceInMinutes } from 'date-fns';

import { useRouter } from 'next/router';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { DraftProposalFeedItem, DraftStatus } from 'types/draftProposal';
import { useLoadDateLocale } from 'hooks/useLoadDateLocale';

import { Icon } from 'components/Icon';

import { DRAFT_PAGE_URL, SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { useDraftsPageActions } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/hooks';

import { BehaviorActions } from 'features/proposal/components/ProposalActions/components/BehaviorActions';
import { Checkbox } from 'components/inputs/Checkbox';
import { MAX_MULTI_VOTES } from 'constants/proposals';
import { useModal } from 'components/modal';
import { ConfirmModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/ConfirmModal';
import { useWalletContext } from 'context/WalletContext';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import styles from './DraftCard.module.scss';

interface Props {
  data: DraftProposalFeedItem;
  daoId: string;
  onSelect?: (id: string) => void;
  selectedList?: string[];
  disableEdit: boolean;
}

export const DraftCardContent: FC<Props> = ({
  data,
  daoId,
  onSelect,
  selectedList,
  disableEdit,
}) => {
  const router = useRouter();
  const { accountId, pkAndSignature } = useWalletContext();
  const { draftsService } = useDraftsContext();
  const { t, i18n } = useTranslation();
  const dateLocale = useLoadDateLocale(i18n.language);
  const [showModal] = useModal(ConfirmModal);
  const { id, title, views, replies, updatedAt, state, proposalId, isSaved } =
    data;

  const isOpenStatus = DraftStatus.Open === state;
  const isClosedStatus = DraftStatus.Closed === state;

  const { handleView } = useDraftsPageActions();

  const handleCardClick = useCallback(
    async e => {
      if (e?.target?.closest(`.${styles.actions}`)) {
        return;
      }

      if (selectedList?.length !== 0 && onSelect && id !== undefined) {
        onSelect(id);

        return;
      }

      if (id && router.pathname !== DRAFT_PAGE_URL) {
        await handleView(id);

        await router.push({
          pathname: DRAFT_PAGE_URL,
          query: {
            dao: daoId,
            draft: id,
          },
        });
      }
    },
    [daoId, handleView, id, onSelect, router, selectedList?.length]
  );

  const handleRemove = useCallback(async () => {
    if (!pkAndSignature) {
      return;
    }

    const { publicKey, signature } = pkAndSignature;

    if (!publicKey || !signature) {
      return;
    }

    const res = await showModal({
      title: t('drafts.editDraftPage.modalDeleteTitle'),
      message: t('drafts.editDraftPage.modalDeleteMessage'),
    });

    if (res[0]) {
      try {
        await draftsService.deleteDraft({
          id,
          daoId,
          publicKey,
          signature,
          accountId,
        });
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    }
  }, [accountId, daoId, draftsService, id, pkAndSignature, showModal, t]);

  const renderDraftTitle = () => {
    if (isOpenStatus) {
      return <div className={styles.title}>{title}</div>;
    }

    return (
      <>
        <div className={styles.title}>{title}</div>
        <Tooltip overlay={<>{t('drafts.feed.card.linkToConvertedProposal')}</>}>
          <Link
            passHref
            href={{
              pathname: SINGLE_PROPOSAL_PAGE_URL,
              query: {
                dao: daoId,
                proposal: `${daoId}-${proposalId}`,
              },
            }}
          >
            <a className={styles.linkToProposal}>
              <Icon name="buttonLink" className={styles.linkToProposalIcon} />
            </a>
          </Link>
        </Tooltip>
      </>
    );
  };

  const updateDate = parseISO(updatedAt);

  const isChecked = selectedList?.findIndex(item => item === id) !== -1;

  return (
    <div
      tabIndex={0}
      role="button"
      className={styles.content}
      onMouseDown={handleCardClick}
    >
      <div className={styles.divider} />
      <div className={styles.inputWrapper}>{renderDraftTitle()}</div>
      <div className={styles.views}>
        <Icon name="draftEye" className={styles.icon} />
        {views}
      </div>
      <div className={styles.replies}>
        <Icon name="draftChat" className={styles.icon} />
        {replies}
      </div>
      <div className={styles.date}>
        <span className={styles.activityText}>
          {t('drafts.feed.card.lastActivity')}:
        </span>{' '}
        <span className={styles.dateText}>
          {differenceInMinutes(new Date(), updateDate) > 1
            ? `${formatDistanceToNow(updateDate, {
                locale: dateLocale,
              })} ${t('drafts.feed.card.minutesAgo')}`
            : t('drafts.feed.card.justNow')}
        </span>
      </div>
      <div
        className={cn(styles.status, {
          [styles.openStatus]: isOpenStatus,
          [styles.closedStatus]: isClosedStatus,
        })}
      >
        {isOpenStatus
          ? t('drafts.feed.card.onDiscussionStatus')
          : t('drafts.feed.card.convertedToProposalStatus')}
      </div>
      <div className={styles.saveFlag}>
        <Icon
          name={isSaved ? 'draftBookmarkFulfill' : 'draftBookmark'}
          className={styles.icon}
        />
      </div>
      {!disableEdit && (
        <div className={styles.actions}>
          {selectedList && selectedList.length > 0 ? (
            <Checkbox
              disabled={!isChecked && selectedList.length === MAX_MULTI_VOTES}
              className={styles.checkbox}
              checked={isChecked}
              onClick={() => onSelect && onSelect(id)}
            />
          ) : (
            <BehaviorActions
              allowSelect
              removeCount={0}
              removed={false}
              onRemove={handleRemove}
              hideSelect={!onSelect}
              onSelect={() => onSelect && onSelect(id)}
              disabled={false}
              className={styles.actionsDropdown}
              iconClassName={styles.actionIcon}
            />
          )}
        </div>
      )}
    </div>
  );
};
