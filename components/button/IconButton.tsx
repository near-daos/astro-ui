import React, { SVGProps } from 'react';
import classNames from 'classnames';
import buttonStyles from './icon-button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
  icon: IconType;
  activeIcon?: IconType;
}

type IconProps = SVGProps<HTMLOrSVGElement> & { title?: string };
type IconType = React.FC<IconProps>;

export const IconButton: React.VFC<ButtonProps> = ({
  className: classNameProp,
  size = 'small',
  icon,
  activeIcon,
  ...props
}) => {
  const sizes = {
    small: buttonStyles.small,
    medium: buttonStyles.medium,
    large: buttonStyles.large
  };
  const className = classNames(
    buttonStyles['icon-button'],
    sizes[size],
    classNameProp
  );

  return (
    <button type="button" className={className} {...props}>
      <style jsx>{`
        button {
          background-image: url("${icon}");
        }

        button:active {
          background-image: ${activeIcon ? `url("${activeIcon}")` : undefined};
        }
      `}</style>
    </button>
  );
};
