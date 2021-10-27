import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { useModal } from 'components/modal';
import { Title } from 'components/Typography';
import { DaoOptionCard } from 'features/create-dao/components/option-card/DaoOptionCard';
import { DaoSettingsModal } from 'features/create-dao/components/settings-modal/DaoSettingsModal';
import Link from 'next/link';
import { DAO_SUBJECT_OPTIONS } from 'features/create-dao/components/steps/data';
import styles from 'features/create-dao/components/steps/settings/settings.module.scss';
import { Subject } from 'features/create-dao/components/steps/types';
import { useCallback } from 'react';

import { useDaoFormState } from 'features/create-dao/components/steps/hooks';

export function SettingsView(): JSX.Element {
  const { options, getValues, setValue } = useDaoFormState();

  const [showModal] = useModal(DaoSettingsModal);

  const handleClick = useCallback(
    async (subject: Subject) => {
      const subjectOptions = DAO_SUBJECT_OPTIONS[subject];

      type SubjectOptionValueT = typeof subjectOptions[0]['value'];

      const result = await showModal({
        options: subjectOptions,
        initialValue: getValues(subject),
      });

      const [value] = (result as unknown) as [SubjectOptionValueT];

      if (value != null) {
        setValue(subject, value);
      }
    },
    [showModal, getValues, setValue]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Set rules for your organization </h1>
        You can adjust them later.
      </div>

      <div className={styles.column}>
        {options.map(option => (
          <DaoOptionCard
            editable
            onEditClick={() => handleClick(option.subject)}
            iconNode={<Icon width={56} height={56} name={option.icon} />}
            key={option.value}
            subject={option.subject}
            title={option.title}
            description={option.description}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <div style={{ gap: '16px' }} className={styles.inline}>
          <Link href="/create-dao/foundation" as="/create-dao/foundation">
            <a href="*" className={styles.inline}>
              <Icon width={24} name="buttonArrowLeft" />
              <Title size={5}>Back</Title>
            </a>
          </Link>
          <Title className={styles.gray} size={5}>
            Step 1 of 5
          </Title>
        </div>
        <Link href="/create-dao/transparency" as="/create-dao/transparency">
          <a href="*">
            <Button style={{ textTransform: 'none' }}>
              <span className={styles.gray}> Next:</span> Name your dao
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
