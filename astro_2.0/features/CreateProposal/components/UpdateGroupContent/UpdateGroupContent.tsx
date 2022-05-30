// TODO requires localisation

import React, { FC, useState } from 'react';
import cn from 'classnames';
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

export const UpdateGroupContent: FC<Props> = ({
  groups,
  getDataFromContext = false,
}) => {
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
        <h4 className={styles.listTitle}>Groups</h4>

        {groupsList.map(group => (
          <Button
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
          <h6 className={styles.contentTitle}>Group name</h6>

          <p className={styles.contentValueName}>{activeGroup.name}</p>

          <h6 className={styles.contentTitle}>
            Voting policy
            <Tooltip
              placement="top"
              arrowClassName={styles.popupArrow}
              popupClassName={styles.popupWrapper}
              className={styles.popover}
              overlay={
                <div className={styles.tooltip}>
                  What is the quorum required <br /> for the decision of this
                  group
                </div>
              }
            >
              <Icon name="info" className={styles.infoIcon} />
            </Tooltip>
          </h6>

          <p className={styles.contentValue}>
            Group quorum is{' '}
            <b>
              {activeGroup.votePolicy.quorum ||
                (
                  activeGroup.votePolicy?.changePolicy ||
                  activeGroup.votePolicy.defaultPolicy
                ).quorum}{' '}
              %
            </b>
          </p>
        </div>

        <div className={styles.column}>
          <h6 className={cn(styles.contentTitle, styles.contentTitleSmall)}>
            Members
          </h6>

          {activeGroup.members.map(member => (
            <p className={styles.member} key={member}>
              {member}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
