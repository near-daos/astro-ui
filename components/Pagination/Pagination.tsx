import React from 'react';
import cn from 'classnames';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

import { NavLabel } from './components/NavLabel';

import styles from './Pagination.module.scss';

export interface PaginationProps
  extends Pick<
    ReactPaginateProps,
    Exclude<
      keyof ReactPaginateProps,
      'marginPagesDisplayed' | 'pageRangeDisplayed'
    >
  > {
  pagesVisible?: number;
  pagesRange?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  pagesVisible = 1,
  pagesRange = 5,
  ...rest
}) => {
  return (
    <ReactPaginate
      {...rest}
      containerClassName={cn(styles.root, 'subtitle4')}
      pageCount={pageCount}
      marginPagesDisplayed={pagesVisible}
      pageRangeDisplayed={pagesRange}
      previousLabel={
        <NavLabel icon="buttonArrowLeft" label="Prev" className={styles.prev} />
      }
      nextLabel={
        <NavLabel
          icon="buttonArrowRight"
          label="Next"
          className={styles.next}
        />
      }
      previousLinkClassName={styles.prevLink}
      nextLinkClassName={styles.nextLink}
      pageClassName={styles.page}
      pageLinkClassName={styles.pageLink}
      disabledClassName={styles.disabled}
      activeClassName={styles.active}
      breakClassName={styles.break}
      breakLinkClassName={styles.breakLink}
    />
  );
};
