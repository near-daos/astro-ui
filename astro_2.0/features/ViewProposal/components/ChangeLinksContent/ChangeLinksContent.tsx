import React, { FC } from 'react';
import cn from 'classnames';
import TextTruncate from 'react-text-truncate';
import { useTranslation } from 'next-i18next';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { Icon } from 'components/Icon';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import styles from './ChangeLinks.module.scss';

interface ChangeLinksContentProps {
  daoId: string;
  links: string[];
}

export const ChangeLinksContent: FC<ChangeLinksContentProps> = ({
  daoId,
  links,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <FieldWrapper label={t('proposalCard.newDAOLinks')}>
        {links.map((link, i) => (
          <FieldValue
            value={
              <a
                href={link}
                className={styles.linkWrapper}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
              >
                <div>
                  <Icon name="socialAnyUrl" width={22} />
                </div>
                &nbsp;
                <span className={cn(styles.link)}>
                  <TextTruncate
                    line={3}
                    element="span"
                    truncateText="…"
                    text={link}
                    textTruncateChild={null}
                  />
                </span>
              </a>
            }
            /* eslint-disable-next-line react/no-array-index-key */
            key={`${i}__${link}link`}
          />
        ))}
      </FieldWrapper>

      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget
          label={t('proposalCard.proposalTarget')}
          value={daoId}
          valueFontSize="S"
        />
      </div>
    </div>
  );
};
