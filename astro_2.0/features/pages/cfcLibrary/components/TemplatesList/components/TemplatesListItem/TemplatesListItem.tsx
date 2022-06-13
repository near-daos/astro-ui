import React, { FC, useCallback } from 'react';
import TextTruncate from 'react-text-truncate';
import { useRouter } from 'next/router';

import { SharedProposalTemplate } from 'types/proposalTemplate';

import { DuplicateSharedTemplate } from 'astro_2.0/features/pages/cfcLibrary/components/DuplicateSharedTemplate';

import { CFC_LIBRARY_TEMPLATE_VIEW } from 'constants/routing';

import styles from './TemplatesListItem.module.scss';

interface Props {
  data: SharedProposalTemplate;
}

export const TemplatesListItem: FC<Props> = ({ data }) => {
  const router = useRouter();
  const { id, name, description, creator, duplicated } = data;

  const handleRowClick = useCallback(() => {
    router.push({
      pathname: CFC_LIBRARY_TEMPLATE_VIEW,
      query: {
        template: id,
      },
    });
  }, [id, router]);

  return (
    <div
      tabIndex={0}
      role="button"
      onKeyPress={handleRowClick}
      className={styles.root}
      onClick={handleRowClick}
    >
      <div className={styles.name}>
        <div className={styles.title}>{name}</div>
        <TextTruncate
          containerClassName={styles.desc}
          line={2}
          element="div"
          truncateText="…"
          text={description}
          textTruncateChild={null}
        />
      </div>
      <div className={styles.creator}>
        <TextTruncate
          line={2}
          element="div"
          truncateText="…"
          text={creator}
          textTruncateChild={null}
        />
      </div>
      <div className={styles.duplicated}>{duplicated}</div>
      <div className={styles.control}>
        <DuplicateSharedTemplate />
      </div>
    </div>
  );
};
