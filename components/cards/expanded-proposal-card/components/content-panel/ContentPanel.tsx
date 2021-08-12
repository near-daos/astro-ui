import React, { FC, ReactNode } from 'react';

import { Icon } from 'components/Icon';
import ExternalLink from 'components/cards/proposal-card/components/external-link/ExternalLink';
import * as Typography from 'components/Typography';
import ProposalControlPanel from 'components/cards/proposal-card/components/proposal-control-panel/ProposalControlPanel';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';

import styles from './content-panel.module.scss';

interface ContentPanelProps {
  title: string;
  name: string;
  text: string;
  link: string;
  linkTitle: string;
  children: ReactNode;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  onLike: () => void;
  onDislike: () => void;
}

export const ContentPanel: FC<ContentPanelProps> = ({
  title,
  name,
  text,
  link,
  linkTitle,
  children,
  likes,
  dislikes,
  liked,
  disliked,
  onLike,
  onDislike
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Icon name="flag" className={styles.icon} />
          <Typography.Title size={3}>{title}</Typography.Title>
        </div>
        <div className={styles.right}>
          <Icon name="buttonBookmark" className={styles.icon} />
          <Icon name="buttonShare" className={styles.icon} />
        </div>
      </div>
      <div className={styles.name}>{name}</div>
      <p>{text}</p>
      <ExternalLink to={link}>{linkTitle}</ExternalLink>
      <div>{children}</div>
      <ProposalControlPanel
        className={styles.control}
        onLike={onLike}
        onDislike={onDislike}
        likes={likes}
        liked={liked}
        dislikes={dislikes}
        disliked={disliked}
      />
      <div className={styles.votes}>
        <ExpandableDetails label="Vote details">Placeholder</ExpandableDetails>
      </div>
    </div>
  );
};
