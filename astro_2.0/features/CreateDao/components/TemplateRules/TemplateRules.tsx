import isEqual from 'lodash/isEqual';
import { useFormContext } from 'react-hook-form';
import React, { VFC, useCallback, useState, useEffect } from 'react';

import {
  DAOTemplate,
  DAOFormValues,
} from 'astro_2.0/features/CreateDao/components/types';

import {
  CLUB_TEMPLATE,
  COOP_TEMPLATE,
  CORP_TEMPLATE,
  CUSTOM_TEMPLATE,
  DAO_TEMPLATE_CLUB,
  DAO_TEMPLATE_COOP,
  DAO_TEMPLATE_CORP,
  DAO_TEMPLATE_FOUNDATION,
  DAO_TEMPLATES,
  FOUNDATION_TEMPLATE,
} from './constants';
import { TemplateLink } from './components/TemplateLink';

import styles from './TemplateRules.module.scss';

export const TemplateRules: VFC = () => {
  const { setValue, getValues, trigger } = useFormContext<DAOFormValues>();
  const { voting, proposals, structure } = getValues();

  const [templateName, setTemplateName] = useState(CUSTOM_TEMPLATE);

  useEffect(() => {
    let tName = '';
    const currentTemplate = {
      voting,
      proposals,
      structure,
    };

    switch (true) {
      case isEqual(currentTemplate, CLUB_TEMPLATE):
        tName = DAO_TEMPLATE_CLUB.variant;
        break;
      case isEqual(currentTemplate, FOUNDATION_TEMPLATE):
        tName = DAO_TEMPLATE_FOUNDATION.variant;
        break;
      case isEqual(currentTemplate, CORP_TEMPLATE):
        tName = DAO_TEMPLATE_CORP.variant;
        break;
      case isEqual(currentTemplate, COOP_TEMPLATE):
        tName = DAO_TEMPLATE_COOP.variant;
        break;
      default:
        tName = CUSTOM_TEMPLATE;
    }

    setTemplateName(tName);
  }, [voting, proposals, structure]);

  const handleClick = useCallback(
    async (template: DAOTemplate) => {
      setValue('voting', template.voting);
      setValue('proposals', template.proposals);
      setValue('structure', template.structure);
      trigger();
    },
    [trigger, setValue]
  );

  return (
    <div className={styles.root}>
      <TemplateLink
        isCustom
        title="Custom"
        isActive={templateName === CUSTOM_TEMPLATE}
      />
      {DAO_TEMPLATES.map(template => (
        <TemplateLink
          isActive={templateName === template.variant}
          key={template.variant}
          title={template.title}
          template={template}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};
