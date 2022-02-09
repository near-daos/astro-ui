import React, { FC, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Subject } from 'astro_2.0/features/CreateDao/components/types';

import { DAO_SUBJECT_OPTIONS } from 'astro_2.0/features/CreateDao/components/data';

import { Icon } from 'components/Icon';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';
import { DaoOptionCard } from 'astro_2.0/features/CreateDao/components/SubjectRule/components/DaoOptionCard';

import styles from './SubjectRule.module.scss';

export interface SubjectRuleProps {
  title: string;
  subTitle: string;
  subject: Subject;
}

export const SubjectRule: FC<SubjectRuleProps> = ({
  title,
  subTitle,
  subject,
}) => {
  const { t } = useTranslation();
  const errorElRef = useRef<HTMLDivElement>(null);

  const { formState, trigger } = useFormContext();
  const { errors } = formState;

  const options = DAO_SUBJECT_OPTIONS[subject];

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>{subTitle}</p>
      </div>

      <InputFormWrapper
        errors={errors}
        errorElRef={errorElRef}
        component={
          <Controller
            name={subject}
            render={renderProps => {
              const { field } = renderProps;

              const { value: actualValue, onChange } = field;

              return (
                <div className={styles.listContainer}>
                  <div className={styles.list}>
                    {options.map(opt => {
                      const {
                        value,
                        icon,
                        title: optionTitle,
                        description,
                      } = opt;

                      function onOptSelect() {
                        onChange({
                          target: {
                            value,
                          },
                        });
                        trigger(subject);
                      }

                      return (
                        <DaoOptionCard
                          key={value}
                          className={styles.optionCard}
                          title={t(
                            `createDAO.daoRulesForm.daoRules.${optionTitle}`
                          )}
                          onSelect={onOptSelect}
                          description={t(
                            `createDAO.daoRulesForm.daoRules.${description}`
                          )}
                          active={value === actualValue}
                          iconNode={<Icon width={56} name={icon} />}
                        />
                      );
                    })}
                  </div>
                  <div ref={errorElRef} />
                </div>
              );
            }}
          />
        }
      />
    </div>
  );
};
