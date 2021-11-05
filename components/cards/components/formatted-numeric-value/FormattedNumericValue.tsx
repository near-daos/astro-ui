import cn from 'classnames';
import styles from 'components/cards/components/formatted-numeric-value/formatted-numeric-value.module.scss';

interface FormattedNumericValueProps {
  value: number | string;
  suffix?: string;
  className?: string;
  valueClassName?: string;
  suffixClassName?: string;
}

export const FormattedNumericValue: React.FC<FormattedNumericValueProps> = ({
  value,
  suffix,
  className,
  valueClassName,
  suffixClassName
}) => (
  <div className={cn(styles.root, className)}>
    <span className={cn('title3', valueClassName)}>
      {value?.toLocaleString()}
    </span>
    &nbsp;
    {suffix ? (
      <span className={cn('subtitle3', styles.upperCase, suffixClassName)}>
        {suffix}
      </span>
    ) : null}
  </div>
);
