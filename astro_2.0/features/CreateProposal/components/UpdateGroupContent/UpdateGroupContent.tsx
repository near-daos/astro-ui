import cn from 'classnames';
import React, { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { TGroup } from 'types/dao';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import styles from './UpdateGroupContent.module.scss';

type Props = {
  groups: TGroup[];
  getDataFromContext?: boolean;
};

const calculateQuorum = (threshold: number[] = [1, 2]): number =>
  Math.floor((threshold[0] / threshold[1]) * 100);

export const UpdateGroupContent: FC<Props> = ({
  groups,
  getDataFromContext = false,
}) => {
  const { t } = useTranslation();

  const formContext = useFormContext();

  let groupsList: TGroup[] = [];

  if (getDataFromContext && formContext) {
    const { watch } = formContext;

    groupsList = watch('groups');
  } else {
    groupsList = groups;
  }

  const [activeGroupSlug, setActiveGroupSlug] = useState(groupsList[0].slug);

  const activeGroup =
    groupsList.find(group => group.slug === activeGroupSlug) || groupsList[0];

  return (
    <div className={styles.root}>
      <div className={styles.list}>
        <h4 className={styles.listTitle}>
          {t('proposalCard.upgradeContent.groups')}
        </h4>

        {groupsList.map(group => (
          <Button
            key={group.slug}
            variant="transparent"
            className={cn(styles.group, {
              [styles.groupActive]: group.slug === activeGroupSlug,
            })}
            onClick={() => setActiveGroupSlug(group.slug)}
          >
            {group.name}
          </Button>
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.column}>
          <h6 className={styles.contentTitle}>
            {t('proposalCard.upgradeContent.groupName')}
          </h6>

          <p className={styles.contentValueName}>{activeGroup.name}</p>

          <h6 className={styles.contentTitle}>
            {t('votingPolicy')}
            <Tooltip
              placement="top"
              arrowClassName={styles.popupArrow}
              popupClassName={styles.popupWrapper}
              className={styles.popover}
              overlay={
                <div className={styles.tooltip}>
                  {t('proposalCard.upgradeContent.quorumDescr')}
                </div>
              }
            >
              <Icon name="info" className={styles.infoIcon} />
            </Tooltip>
          </h6>

          <p className={styles.contentValue}>
            {`${t('proposalCard.upgradeContent.groupQuorum')} `}
            <b>
              {activeGroup.votePolicy?.quorum
                ? activeGroup.votePolicy?.quorum
                : calculateQuorum(
                    activeGroup.votePolicy?.policy?.threshold ||
                      activeGroup.votePolicy?.defaultPolicy?.threshold
                  )}{' '}
              %
            </b>
          </p>
        </div>

        <div className={styles.column}>
          <h6 className={cn(styles.contentTitle, styles.contentTitleSmall)}>
            {t('proposalCard.upgradeContent.members')}
          </h6>

          {activeGroup.members?.map(member => (
            <p className={styles.member} key={member}>
              {member}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
