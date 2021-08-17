import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';
import * as footers from 'features/create-dao/components/footers';
import {
  DaoOptionCard,
  DaoSettingOption
} from 'features/create-dao/components/option-card/DaoOptionCard';
import React, { FC } from 'react';

import styles from './dao-template-modal.module.scss';

export interface DaoTemplateModalProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  options: DaoSettingOption[];
  title: string;
  description: string;
  variant: keyof typeof footers;
}

const computedStyle = getComputedStyle(document.documentElement);
const backgrounds = {
  Club: computedStyle.getPropertyValue('--color-brand-coral-red'),
  Cooperative: computedStyle.getPropertyValue('--color-primary-50'),
  Corporation: computedStyle.getPropertyValue('--color-brand-pink'),
  Foundation: computedStyle.getPropertyValue('--color-brand-green')
};

export const DaoTemplateModal: FC<DaoTemplateModalProps> = ({
  isOpen,
  onClose,
  options = [],
  title,
  description,
  variant
}) => {
  const BackgroundComponent = footers[variant];
  const background = backgrounds[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <section>
          <h2 className={styles.title}> {title} </h2>
          <p className={styles.description}>{description}</p>
        </section>

        <div className={styles.list}>
          {options.map(option => (
            <DaoOptionCard
              key={option.value}
              iconNode={<Icon width={56} name={option.icon} />}
              title={option.title}
              subject={option.subject}
              description={option.description}
            />
          ))}
        </div>

        <Button onClick={() => onClose(true)}> Select and customize</Button>
      </div>

      <div style={{ background }} className={styles.footer}>
        {BackgroundComponent && <BackgroundComponent />}
      </div>
    </Modal>
  );
};
