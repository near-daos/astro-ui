import React from 'react';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import cn from 'classnames';

import { Icon } from 'components/Icon';

import styles from './pagination.module.scss';

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

const NavLabel = ({
  label,
  className,
  icon
}: {
  label: string;
  className: string;
  icon: 'buttonArrowLeft' | 'buttonArrowRight';
}) => (
  <div className={className}>
    {icon === 'buttonArrowLeft' && <Icon name={icon} width={24} />}
    <span
      className={cn(styles['nav-label'], {
        [styles['icon-left']]: icon === 'buttonArrowLeft',
        [styles['icon-right']]: icon === 'buttonArrowRight'
      })}
    >
      {label}
    </span>
    {icon === 'buttonArrowRight' && <Icon name={icon} width={24} />}
  </div>
);

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
      previousLinkClassName={styles['prev-link']}
      nextLinkClassName={styles['next-link']}
      pageClassName={styles.page}
      pageLinkClassName={styles['page-link']}
      disabledClassName={styles.disabled}
      activeClassName={styles.active}
      breakClassName={styles.break}
      breakLinkClassName={styles['break-link']}
    />
  );
};

export default Pagination;
