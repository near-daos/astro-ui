import { useTranslation } from 'next-i18next';
import { ExternalLink } from 'components/ExternalLink';
import React from 'react';
import styles from './ProposalDescription.module.scss';

interface ProposalDescriptionProps {
  description: string;
  link?: string;
  className?: string;
}

export const ProposalDescription: React.FC<ProposalDescriptionProps> = ({
  description,
  link,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className={styles.label}>
        {t(`proposalCard.proposalDescription`)}
      </div>
      <div className={styles.description}>{description}</div>
      {link && (
        <div className={styles.link}>
          <ExternalLink to={link} />
        </div>
      )}
    </div>
  );
};
