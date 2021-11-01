import React, { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { TemplateLink } from 'astro_2.0/features/CreateDao/components/TemplateLink/TemplateLink';
import {
  DAOTemplate,
  DAOFormValues,
} from 'astro_2.0/features/CreateDao/components/units/types';
import styles from './TemplateRules.module.scss';

export interface TemplateRulesProps {
  templates: DAOTemplate[];
}

export const TemplateRules: FC<TemplateRulesProps> = ({ templates }) => {
  const { setValue } = useFormContext<DAOFormValues>();

  const handleClick = useCallback(
    async (template: DAOTemplate) => {
      setValue('voting', template.voting);
      setValue('proposals', template.proposals);
      setValue('structure', template.structure);
    },
    [setValue]
  );

  return (
    <div className={styles.root}>
      <TemplateLink linkType="custom" title="Custom" />
      {templates.map(template => (
        <TemplateLink
          key={template.variant}
          linkType="predefined"
          title={template.title}
          template={template}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};
