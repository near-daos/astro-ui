import cn from 'classnames';
import * as Typography from 'components/Typography';
import * as footers from 'features/create-dao/components/footers';
import { VFC } from 'react';
import styles from './dao-template-card.module.scss';

const computedStyle = getComputedStyle(document.documentElement);
const backgrounds = {
  Club: computedStyle.getPropertyValue('--color-brand-coral-red'),
  Cooperative: computedStyle.getPropertyValue('--color-primary-50'),
  Corporation: computedStyle.getPropertyValue('--color-brand-pink'),
  Foundation: computedStyle.getPropertyValue('--color-brand-green')
};

export interface DaoTemplateCardProps {
  title: string;
  note: string;
  description: string;
  variant: keyof typeof footers;
  className?: string;
}

export const DaoTemplateCard: VFC<DaoTemplateCardProps> = ({
  title,
  note = 'Great for',
  description,
  variant,
  className
}) => {
  const BackgroundComponent = footers[variant];
  const background = backgrounds[variant];

  return (
    <div className={cn(styles.root, className)}>
      <h2 className={styles.title}>{title}</h2>
      <Typography.Subtitle size={6} className={styles.notes}>
        {note}
      </Typography.Subtitle>
      <p className={styles.description}> {description}</p>
      <div style={{ background }} className={styles.footer}>
        <BackgroundComponent />
      </div>
    </div>
  );
};
