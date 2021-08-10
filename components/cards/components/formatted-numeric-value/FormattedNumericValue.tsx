import styles from 'components/cards/components/formatted-numeric-value/formatted-numeric-value.module.scss';
import classNames from 'classnames';

interface FormattedNumericValueProps {
  value: number;
  suffix?: string;
  className?: string;
}

export const FormattedNumericValue: React.FC<FormattedNumericValueProps> = ({
  value,
  suffix,
  className
}) => (
  <div className={classNames(styles.root, className)}>
    <span className="title3">{value.toLocaleString()}</span>
    &nbsp;
    {suffix ? (
      <span className={classNames('subtitle3', styles['upper-case'])}>
        {suffix}
      </span>
    ) : null}
  </div>
);
