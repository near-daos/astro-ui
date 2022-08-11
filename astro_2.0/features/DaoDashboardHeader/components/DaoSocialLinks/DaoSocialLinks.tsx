import React, { FC, useRef } from 'react';
import cn from 'classnames';

import { getSocialLinkIcon } from 'utils/getSocialLinkIcon';
import { ExternalLink } from 'components/ExternalLink';

import { IconButton } from 'components/button/IconButton';

import { ProposalVariant } from 'types/proposal';

import styles from './DaoSocialLinks.module.scss';

interface Props {
  legal?: { legalLink?: string; legalStatus?: string };
  links: string[];
  linkClassName?: string;
  onCreateProposal?: (
    variant: ProposalVariant,
    initialValues: Record<string, unknown>
  ) => void;
}

export const DaoSocialLinks: FC<Props> = ({ links, onCreateProposal }) => {
  const ref = useRef(null);

  return (
    <div
      className={cn(styles.root, {
        [styles.editable]: !!onCreateProposal,
      })}
      ref={ref}
    >
      <div className={styles.edit}>
        <IconButton
          icon="buttonEdit"
          onClick={() => {
            if (!onCreateProposal) {
              return;
            }

            onCreateProposal(ProposalVariant.ProposeChangeDaoLinks, {
              links,
            });
          }}
          iconProps={{
            className: styles.link,
            width: 16,
          }}
        />
      </div>
      {links.length === 0 ? (
        <IconButton
          icon="socialAnyUrl"
          iconProps={{
            className: styles.link,
            width: 16,
          }}
        />
      ) : (
        links.map(link => (
          <ExternalLink
            key={link}
            hideLinkLable
            to={link}
            icon={getSocialLinkIcon(link)}
            iconClassName={styles.link}
          />
        ))
      )}
    </div>
  );
};
