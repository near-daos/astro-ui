import { FC } from 'react';
import cn from 'classnames';

import * as Typography from 'components/Typography';
import { DAOTemplate } from 'features/create-dao/components/steps/types';
import { backgrounds } from 'features/create-dao/components/template/utils';
import cardFooterStyles from 'features/create-dao/components/template/card-footer.module.scss';

import styles from './dao-template-card.module.scss';

export interface DaoTemplateCardProps {
  note?: string;
  className?: string;
  template: DAOTemplate;
  onClick?: (template: DAOTemplate) => void;
}

export const DaoTemplateCard: FC<DaoTemplateCardProps> = ({
  note = 'Great for',
  className,
  template,
  onClick
}) => {
  const { title, description, variant, disabled } = template;
  const background = backgrounds[variant];

  function handleClick() {
    if (onClick) {
      onClick(template);
    }
  }

  const rootClassName = cn(styles.root, className, {
    [styles.disabled]: disabled
  });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={handleClick}
      className={rootClassName}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <Typography.Subtitle size={6} className={styles.notes}>
          {note}
        </Typography.Subtitle>
        <p className={styles.description}> {description}</p>
      </div>
      <div className={cn(cardFooterStyles.root, background)} />
    </div>
  );
};
