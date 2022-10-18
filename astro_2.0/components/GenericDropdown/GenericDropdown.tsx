import cn from 'classnames';
import { merge } from 'lodash';
import { usePopper } from 'react-popper';
import React, { FC, useState, useEffect } from 'react';
import { Placement } from '@popperjs/core/lib/enums';

import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { BaseDropdownProps } from './types';

import s from './GenericDropdown.module.scss';

export interface GenericDropdownProps extends BaseDropdownProps {
  children: React.ReactElement;
  onOpenUpdate?: (open: boolean) => void;
  forceState?: (open: boolean) => void;
  arrow?: boolean;
  arrowClassName?: string;
  showOnHover?: boolean;
  preventOpenThroughParent?: boolean;
  placement?: Placement;
}

export const GenericDropdown: FC<GenericDropdownProps> = ({
  arrow,
  parent,
  isOpen,
  children,
  options,
  onOpenUpdate,
  arrowClassName,
  showOnHover,
  preventOpenThroughParent,
  placement = 'auto',
}) => {
  const [open, setOpen] = useState(isOpen);
  const [popperElement, setPopperElement] = useState<HTMLElement>();
  const [referenceElement, setReferenceElement] = useState<HTMLElement>();

  function openCloseDropdown(e: Event, isClickOutside: boolean) {
    if (preventOpenThroughParent && !isClickOutside) {
      return;
    }

    if (e.target && (e.target as HTMLElement)?.closest('#search_results')) {
      return;
    }

    setOpen(!open);

    if (onOpenUpdate) {
      onOpenUpdate(!open);
    }
  }

  useOnClickOutside(
    [
      { current: popperElement } as React.RefObject<HTMLElement>,
      { current: referenceElement } as React.RefObject<HTMLElement>,
    ],
    openCloseDropdown
  );

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    function mouseMoveListener(e: MouseEvent) {
      const path = e.composedPath();

      setOpen(
        path.includes(referenceElement as EventTarget) ||
          path.includes(popperElement as EventTarget)
      );
    }

    if (showOnHover) {
      document.addEventListener('mousemove', mouseMoveListener);
    }

    return () => document.removeEventListener('mousemove', mouseMoveListener);
  }, [showOnHover, popperElement, referenceElement]);

  const opts = merge(
    {
      placement,
      strategy: 'fixed',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, arrow ? 16 : 8],
          },
        },
      ],
    },
    options
  );

  const { styles, attributes } = usePopper(
    referenceElement,
    popperElement,
    opts
  );

  const parentEl = React.cloneElement(parent, {
    ref: setReferenceElement as React.LegacyRef<unknown>,
    onClick: openCloseDropdown,
  });

  function getDropdown() {
    const arrowEl = arrow && (
      <div
        data-popper-arrow
        style={styles.arrow}
        className={cn(s.arrow, arrowClassName)}
        key="arrow"
      />
    );

    return (
      <div
        ref={setPopperElement as React.LegacyRef<HTMLDivElement>}
        style={styles.popper}
        {...attributes.popper}
        className={s.dropdown}
      >
        {arrowEl}
        {children}
      </div>
    );
  }

  return (
    <>
      {parentEl}
      {open && getDropdown()}
    </>
  );
};
