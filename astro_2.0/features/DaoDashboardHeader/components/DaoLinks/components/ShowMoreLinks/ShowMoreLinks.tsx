import React, { useCallback } from 'react';
import { useModal } from 'components/modal';
import { MoreLinksModal } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/MoreLinksModal/MoreLinksModal';
import { Button } from 'components/button/Button';
import styles from './ShowMoreLinks.module.scss';

interface ShowMoreLinksProps {
  links: string[];
}

export const ShowMoreLinks: React.FC<ShowMoreLinksProps> = ({ links }) => {
  const additionalLinks = links.length - 3;
  const [showModal] = useModal(MoreLinksModal, { links });
  const handleClick = useCallback(async () => {
    await showModal();
  }, [showModal]);

  return (
    <Button variant="transparent" onClick={handleClick}>
      <div className={styles.showMore}>
        Show more links (+{additionalLinks})
      </div>
    </Button>
  );
};
