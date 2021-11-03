import ExternalLink from 'components/cards/components/external-link/ExternalLink';
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
  return (
    <div className={className}>
      <div className={styles.label}>Description</div>
      <div className={styles.description}>{description}</div>
      {link && (
        <div className={styles.link}>
          <ExternalLink to={link} />
        </div>
      )}
    </div>
  );
};
