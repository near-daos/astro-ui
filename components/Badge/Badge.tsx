import React from 'react';
import classNames from 'classnames';
import { Property } from 'csstype';
import styles from './Badge.module.scss';

export type Variant =
  | 'white'
  | 'violet'
  | 'blurple'
  | 'blue'
  | 'turqoise'
  | 'green'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'neonYellow'
  | 'primary'
  | 'lightgray';

const sizes = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
  block: styles.block,
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: Property.Background;
  textTransform?: Property.TextTransform;
  size: keyof typeof sizes;
  variant?: Variant;
}

export function getBadgeVariant(name: string): Variant {
  const variants = [
    'white',
    'violet',
    'blurple',
    'blue',
    'turqoise',
    'green',
    'red',
    'orange',
    'yellow',
    'neonYellow',
    'primary',
  ] as Variant[];

  const first = name.charCodeAt(0);
  const last = name.charCodeAt(name.length - 1);
  const totalLength = name.length;

  const key = (first + last + totalLength) % variants.length;

  return variants[key];
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className: classNameProp,
      size = 'medium',
      children,
      background,
      variant = 'blurple',
      textTransform,
      ...props
    },
    externalRef
  ) => {
    const sizeClass = sizes[size];
    const style = styles[variant];

    const className = classNames(
      styles.badge,
      size ? sizeClass : undefined,
      style,
      classNameProp
    );

    return (
      <div
        ref={externalRef}
        {...props}
        style={{
          background,
          textTransform,
        }}
        className={className}
      >
        {children}
      </div>
    );
  }
);
