import cn from 'classnames';
import React, { FC } from 'react';

import { DAOTemplate } from 'astro_2.0/features/CreateDao/components/types';

import styles from './TemplateLink.module.scss';

export interface TemplateLinkProps {
  title: string;
  isActive: boolean;
  isCustom?: boolean;
  template?: DAOTemplate;
  onClick?: (template: DAOTemplate) => void;
}

export const TemplateLink: FC<TemplateLinkProps> = ({
  title,
  isActive,
  isCustom,
  template,
  onClick,
}) => {
  function handleClick() {
    if (onClick && template) {
      onClick(template);
    }
  }

  const className = cn(styles.root, {
    [styles.custom]: isCustom,
    [styles.active]: isActive,
  });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={handleClick}
      className={className}
    >
      {title}
    </div>
  );
};
