import React from 'react';
import cn from 'classnames';
import styles from './InfoBlockWidget.module.scss';

interface InfoBlockWidgetProps {
  label: string;
  value: string;
  valueFontSize?: 'S' | 'L';
  valueNode?: React.ReactNode;
}

export const InfoBlockWidget: React.FC<InfoBlockWidgetProps> = ({
  label,
  value,
  valueFontSize = 'S',
  valueNode,
}) => {
  return (
    <div className={styles.infoBlock}>
      <div className={styles.label}>{label}</div>
      <div className={cn(styles.valueBlock, { [styles.left]: !valueNode })}>
        <div
          className={cn({
            [styles.valueSmall]: valueFontSize === 'S',
            [styles.valueLarge]: valueFontSize === 'L',
          })}
        >
          {value}
        </div>
        {valueNode && <div className={styles.valueNode}>{valueNode}</div>}
      </div>
    </div>
  );
};
