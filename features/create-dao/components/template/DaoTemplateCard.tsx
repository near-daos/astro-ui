import cn from 'classnames';
import * as Typography from 'components/Typography';
import cardFooterStyles from 'features/create-dao/components/template/card-footer.module.scss';
import { backgrounds } from 'features/create-dao/components/template/utils';
import { HTMLAttributes, VFC } from 'react';
import styles from './dao-template-card.module.scss';

export interface DaoTemplateCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  note?: string;
  description: string;
  variant: keyof typeof backgrounds;
  className?: string;
}

export const DaoTemplateCard: VFC<DaoTemplateCardProps> = ({
  title,
  note = 'Great for',
  description,
  variant,
  className,
  ...props
}) => {
  const background = backgrounds[variant];

  return (
    <div className={cn(styles.root, className)} {...props}>
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
