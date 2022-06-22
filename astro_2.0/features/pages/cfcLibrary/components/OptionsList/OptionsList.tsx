import React, { ReactElement, useCallback } from 'react';
import styles from 'pages/cfc-library/[template]/SharedTemplatePage.module.scss';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import ContentLoader from 'react-content-loader';
import { ListModal } from 'astro_2.0/features/pages/cfcLibrary/components/ListModal';

interface Props<T> {
  title: string;
  data: T[] | null | undefined;
  renderItem: (item: T) => ReactElement;
  suffix: string;
  loading: boolean;
}

export const OptionsList = <T,>({
  title,
  data,
  renderItem,
  suffix,
  loading,
}: Props<T>): ReactElement | null => {
  const [showModal] = useModal(ListModal);

  const handleMoreClick = useCallback(async () => {
    if (!data) {
      return;
    }

    await showModal({
      data: data.slice(9),
      renderItem: item => renderItem(item as T),
      title,
    });
  }, [data, renderItem, showModal, title]);

  if (loading) {
    return (
      <ContentLoader height={280}>
        <rect x="0" y="10" width="180" height="20" />
        <rect x="0" y="50" width="180" height="20" />
        <rect x="0" y="90" width="180" height="20" />
        <rect x="0" y="130" width="180" height="20" />
        <rect x="0" y="170" width="180" height="20" />
        <rect x="0" y="210" width="180" height="20" />
        <rect x="0" y="250" width="180" height="20" />
      </ContentLoader>
    );
  }

  if (!data?.length) {
    return null;
  }

  return (
    <>
      <div className={styles.listTitle}>{title}</div>
      <ul>{data.slice(0, 9).map(item => renderItem(item))}</ul>
      {(data?.length ?? 0) > 9 && (
        <Button
          onClick={handleMoreClick}
          size="medium"
          variant="tertiary"
          capitalize
          className={styles.listTotal}
        >
          <span>
            + {(data?.length ?? 0) - 9} {suffix}
          </span>
        </Button>
      )}
    </>
  );
};
