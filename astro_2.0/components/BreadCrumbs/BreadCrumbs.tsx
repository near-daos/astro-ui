import React, {
  useRef,
  useState,
  Children,
  useCallback,
  ReactElement,
} from 'react';
import cn from 'classnames';
import takeRight from 'lodash/takeRight';

import { PAGE_LAYOUT_ID } from 'constants/common';

import { Icon, IconName } from 'components/Icon';

import { getElementSize } from 'utils/getElementSize';
import { useWindowResize } from 'hooks/useWindowResize';

import styles from './Breadcrumbs.module.scss';

export interface BreadCrumbsProps {
  className?: string;
  children: React.ReactElement[];
  separator?: IconName;
  linkClassName?: string;
  activeLinkClassName?: string;
}

export const BreadCrumbs: React.VFC<BreadCrumbsProps> = ({
  className,
  children,
  separator = 'buttonArrowRight',
  linkClassName = styles.link,
  activeLinkClassName = styles.activeLink,
}) => {
  const rootRef = useRef<HTMLElement>(null);

  const [maxWidth, setMaxWidth] = useState(0);
  const [showLastThree, setShowLastThree] = useState(false);

  const onResize = useCallback(() => {
    // We assume that breadcrumbs have all available width of the page content.
    const pageLayoutEl = document.getElementById(PAGE_LAYOUT_ID);
    const rootEl = rootRef.current;

    if (pageLayoutEl && rootEl) {
      const { width: pageContentWidth } = getElementSize(pageLayoutEl);

      const itemEls = rootEl.querySelectorAll(`.${styles.item}`);
      const breadcrumbsWidth = Array.from(itemEls).reduce((acc, itemEl) => {
        const { widthWithMargin } = getElementSize(itemEl as HTMLElement);

        return acc + widthWithMargin;
      }, 0);

      if (breadcrumbsWidth > maxWidth) {
        setMaxWidth(breadcrumbsWidth);
      }

      setShowLastThree(maxWidth > pageContentWidth);
    }
  }, [maxWidth, rootRef]);

  useWindowResize(onResize);

  function getChildrenToRender() {
    const childrenArr = Children.toArray(children);
    const childrenToRender = showLastThree
      ? takeRight(childrenArr, 3)
      : childrenArr;

    return childrenToRender;
  }

  function renderItem(child: ReactElement, index: number, isLastItem: boolean) {
    const childClassName = {
      className: cn(child.props.className, linkClassName, {
        [activeLinkClassName]: isLastItem,
      }),
    };

    return [
      <li className={styles.item}>
        {React.cloneElement(child, childClassName)}
      </li>,
      !isLastItem && (
        <li className={styles.item}>
          <Icon name={separator} width={16} />
        </li>
      ),
    ];
  }

  function renderAllItems() {
    const childrenToRender = getChildrenToRender();

    return Children.map(childrenToRender, (child, index) => {
      const isLast = index === childrenToRender.length - 1;

      return renderItem(child as ReactElement, index, isLast);
    });
  }

  return (
    <nav className={cn(styles.root, className)} ref={rootRef}>
      <ol className={styles.list}>{renderAllItems()}</ol>
    </nav>
  );
};
