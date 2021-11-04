import React, { FC } from 'react';
import { Icon } from 'components/Icon';
import { DaoOptionCard } from 'astro_2.0/features/CreateDao/components/DaoOptionCard/DaoOptionCard';
import { Subject } from 'astro_2.0/features/CreateDao/components/types';
import { DAO_SUBJECT_OPTIONS } from 'astro_2.0/features/CreateDao/components/data';
import { useDaoFormState } from 'astro_2.0/features/CreateDao/components/hooks';
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
  const options = DAO_SUBJECT_OPTIONS[subject];
  const { getValues, setValue } = useDaoFormState();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>{subTitle}</p>
      </div>

      <div className={styles.list}>
        {options.map(({ value, icon, title: optionTitle, description }) => (
          <DaoOptionCard
            active={value === getValues(subject)}
            key={value}
            onClick={() => setValue(subject, value)}
            iconNode={<Icon width={56} name={icon} />}
            title={optionTitle}
            description={description}
          />
        ))}
      </div>
    </div>
  );
};
