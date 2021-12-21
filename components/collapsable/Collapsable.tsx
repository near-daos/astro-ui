import React from 'react';
import AnimateHeight, { AnimateHeightProps } from 'react-animate-height';
import { useId } from '@reach/auto-id';
import { useToggle } from 'react-use';

type PickProps =
  | 'animateOpacity'
  | 'delay'
  | 'duration'
  | 'easing'
  | 'height'
  | 'id'
  | 'onAnimationEnd'
  | 'onAnimationStart';

interface CollapsableProps extends Pick<AnimateHeightProps, PickProps> {
  id?: string;
  renderHeading: (
    toggle: (newState?: boolean) => void,
    isOpen: boolean
  ) => JSX.Element;
  isOpen?: boolean;
  toggle?: (nextValue?: boolean) => void;
  initialOpenState?: boolean;
  className?: string;
}

export const Collapsable: React.FC<CollapsableProps> = ({
  initialOpenState,
  children,
  height = 'auto',
  renderHeading,
  className,
  ...props
}) => {
  const id = useId(props.id);
  const [state, toggleState] = useToggle(
    initialOpenState !== undefined ? initialOpenState : false
  );

  const { isOpen = state, toggle = toggleState, ...animateProps } = props;

  return (
    <>
      {renderHeading(toggle, isOpen)}
      <AnimateHeight
        {...animateProps}
        id={id}
        duration={500}
        height={isOpen ? height : 0}
        className={className}
      >
        {typeof children === 'function' ? children(isOpen) : children}
      </AnimateHeight>
    </>
  );
};
