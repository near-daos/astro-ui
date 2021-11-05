import React from 'react';
import classNames from 'classnames';

interface TitleProps extends React.HTMLProps<HTMLParagraphElement> {
  size: 1 | 2 | 3 | 4 | 5 | 6;
}

interface CaptionProps
  extends Omit<React.HTMLProps<HTMLHeadingElement>, 'size'> {
  size?: 'normal' | 'small';
}

export const Title = React.forwardRef<HTMLParagraphElement, TitleProps>(
  ({ size, className: classNameProp, ...rest }, externalRef) => (
    <p
      ref={externalRef}
      className={classNames(`title${size}`, classNameProp)}
      {...rest}
    />
  )
);

export const Subtitle = React.forwardRef<HTMLParagraphElement, TitleProps>(
  ({ size, className: classNameProp, ...rest }, externalRef) => (
    <p
      ref={externalRef}
      className={classNames(`subtitle${size}`, classNameProp)}
      {...rest}
    />
  )
);

export const Caption = React.forwardRef<HTMLHeadingElement, CaptionProps>(
  ({ children, size, className: classNameProp, ...rest }, externalRef) => (
    <h6
      ref={externalRef}
      className={classNames(
        `caption`,
        size === 'small' ? 'small' : undefined,
        classNameProp
      )}
      {...rest}
    >
      {children}
    </h6>
  )
);
