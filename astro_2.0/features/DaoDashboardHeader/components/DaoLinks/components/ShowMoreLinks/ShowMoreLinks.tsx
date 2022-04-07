import isEmpty from 'lodash/isEmpty';
import React, { useCallback } from 'react';
import { useModal } from 'components/modal';
import { MoreLinksModal } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/MoreLinksModal/MoreLinksModal';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import styles from './ShowMoreLinks.module.scss';

interface ShowMoreLinksProps {
  links: string[];
}

export const ShowMoreLinks: React.FC<ShowMoreLinksProps> = ({ links }) => {
  const [showModal] = useModal(MoreLinksModal, { links });
  const handleClick = useCallback(async () => {
    await showModal();
  }, [showModal]);

  if (isEmpty(links)) {
    return null;
  }

  return (
    <Button
      size="block"
      variant="transparent"
      onClick={handleClick}
      className={styles.showMore}
    >
      <Icon name="buttonLink" className={styles.toggle} />
    </Button>
  );
};
