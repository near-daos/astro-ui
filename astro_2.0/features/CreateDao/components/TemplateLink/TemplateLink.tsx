import React, { FC } from 'react';
import cn from 'classnames';
import isNil from 'lodash/isNil';
import {
  DAOTemplate,
  TemplateLinkType,
} from 'astro_2.0/features/CreateDao/components/units/types';
import { useDaoFormState } from 'astro_2.0/features/CreateDao/components/units/hooks';
import styles from './TemplateLink.module.scss';

export interface TemplateLinkProps {
  linkType: TemplateLinkType;
  title: string;
  template?: DAOTemplate;
  onClick?: (template: DAOTemplate) => void;
}

export const TemplateLink: FC<TemplateLinkProps> = ({
  linkType,
  title,
  template,
  onClick,
}) => {
  const isCustom = linkType === 'custom';
  const { getValues } = useDaoFormState();

  const isCustomActive =
    isNil(getValues('proposals')) ||
    isNil(getValues('voting')) ||
    isNil(getValues('structure'));

  const isActive =
    getValues('proposals') === template?.proposals &&
    getValues('voting') === template?.voting &&
    getValues('structure') === template?.structure;

  function handleClick() {
    if (onClick && template) {
      onClick(template);
    }
  }

  const className = cn(styles.root, {
    [styles.custom]: isCustom,
    [styles.customActive]: isCustomActive,
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
