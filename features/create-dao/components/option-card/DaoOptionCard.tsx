import cn from 'classnames';
import { IconButton } from 'components/button/IconButton';
import { IconName } from 'components/Icon';
import * as Typography from 'components/Typography';
import { Subject } from 'features/create-dao/components/steps/types';
import React from 'react';
import styles from './dao-option-card.module.scss';

export interface DaoOptionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  className?: string;
  iconNode?: JSX.Element;
  editable?: boolean;
  disabled?: boolean;
  editIcon?: IconName;
  onEditClick?: () => void;
  subject: Subject;
  title: string;
  onClick?: () => void | undefined;
  description: string;
}

const SUBJECT_LABELS: Record<Subject, string> = {
  proposals: 'Proposals',
  structure: 'Structure',
  voting: 'Voting Power'
};

export const DaoOptionCard: React.VFC<DaoOptionCardProps> = ({
  active,
  className: classNameProp,
  iconNode,
  subject,
  title,
  description,
  editable,
  disabled,
  editIcon = 'buttonEdit',
  onEditClick,
  ...props
}) => {
  const className = cn(
    styles.root,
    {
      [styles.active]: active,
      [styles.editable]: editable,
      [styles.disabled]: disabled
    },
    classNameProp
  );

  return (
    <div {...props} className={className}>
      <div className={styles.icon}>{iconNode}</div>
      <div className={styles.content}>
        <Typography.Title className={styles.subject} size={5}>
          {SUBJECT_LABELS[subject]}
        </Typography.Title>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      {editable && (
        <IconButton
          size="medium"
          className={styles.editIcon}
          onClick={onEditClick}
          icon={editIcon}
        />
      )}
    </div>
  );
};
