import React from 'react';
import classNames from 'classnames';

interface TitleProps extends React.HTMLProps<HTMLHeadingElement> {
  size: 1 | 2 | 3 | 4 | 5;
}

interface CaptionProps
  extends Omit<React.HTMLProps<HTMLHeadingElement>, 'size'> {
  size?: 'normal' | 'small';
}

export const Title: React.FC<TitleProps> = ({
  size,
  className: classNameProp,
  ...rest
}) => <div className={classNames(`title${size}`, classNameProp)} {...rest} />;

export const Subtitle: React.FC<TitleProps> = ({
  size,
  className: classNameProp,
  ...rest
}) => (
  <div className={classNames(`subtitle${size}`, classNameProp)} {...rest} />
);

export const Caption: React.FC<CaptionProps> = ({
  size,
  className: classNameProp,
  ...rest
}) => (
  <div
    className={classNames(
      `caption`,
      size === 'small' ? 'small' : undefined,
      classNameProp
    )}
    {...rest}
  />
);
