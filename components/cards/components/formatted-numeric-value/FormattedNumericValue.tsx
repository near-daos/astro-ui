import styles from 'components/cards/components/formatted-numeric-value/formatted-numeric-value.module.scss';
import classNames from 'classnames';

interface FormattedNumericValueProps {
  value: number;
  suffix?: string;
}

export const FormattedNumericValue: React.FC<FormattedNumericValueProps> = ({
  value,
  suffix
}) => (
  <div className={styles.root}>
    <span className="title3">{value.toLocaleString()}</span>
    &nbsp;
    {suffix ? (
      <span className={classNames('subtitle3', styles['upper-case'])}>
        {suffix}
      </span>
    ) : null}
  </div>
);
