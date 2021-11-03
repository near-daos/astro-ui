import React, { ReactNode, useState } from 'react';
import cn from 'classnames';
import styles from 'astro_2.0/components/InfoBlockWidget/InfoBlockWidget.module.scss';
import { Icon } from 'components/Icon';
import { Popup } from 'components/popup/Popup';

type TooltipMessageSeverity = 'Info' | 'Positive' | 'Warning';
interface InfoBlockWidgetProps {
  label: string;
  tooltipText?: string;
  messageSeverity?: TooltipMessageSeverity;
  value: ReactNode;
  valueFontSize?: 'S' | 'L';
  className?: string;
}

export const InfoBlockWidget: React.FC<InfoBlockWidgetProps> = ({
  label,
  value,
  tooltipText,
  valueFontSize = 'S',
  className,
}) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.block}>
        <div className={styles.label}>{label}</div>
        {tooltipText && (
          <div ref={setRef} className={styles.iconHolder}>
            <Icon name="buttonAlert" className={styles.infoIcon} />
            <Popup anchor={ref} placement="bottom" className={styles.tooltip}>
              {tooltipText}
            </Popup>
          </div>
        )}
      </div>
      <div className={cn(styles.block)}>
        <div
          className={cn({
            [styles.valueSmall]: valueFontSize === 'S',
            [styles.valueLarge]: valueFontSize === 'L',
          })}
        >
          {value}
        </div>
      </div>
    </div>
  );
};
