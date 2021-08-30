import cn from 'classnames';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';

import { DaoOptionCard } from 'features/create-dao/components/option-card/DaoOptionCard';
import cardFooterStyles from 'features/create-dao/components/template/card-footer.module.scss';

import styles from 'features/create-dao/components/template/dao-template-modal.module.scss';
import { backgrounds } from 'features/create-dao/components/template/utils';
import { DaoSettingOption, DAOType } from 'pages/create-dao/steps/types';
import React, { FC } from 'react';

export interface DaoTemplateModalProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  options: DaoSettingOption<string>[];
  title: string;
  description: string;
  variant: DAOType;
}

export const DaoTemplateModal: FC<DaoTemplateModalProps> = ({
  isOpen,
  onClose,
  options = [],
  title,
  description,
  variant
}) => {
  const background = backgrounds[variant];

  return (
    <Modal className={styles.modal} isOpen={isOpen} onClose={onClose}>
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

      <div className={cn(cardFooterStyles.root, background)} />
    </Modal>
  );
};
