import React, { ReactNode, useState } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';
import { Popup } from 'components/Popup';
import { TooltipMessageSeverity } from 'astro_2.0/components/InfoBlockWidget/types';
import styles from './InfoBlockWidget.module.scss';

interface InfoBlockWidgetProps {
  label: string;
  tooltip?: ReactNode;
  messageSeverity?: TooltipMessageSeverity;
  value: ReactNode;
  valueFontSize?: 'S' | 'L';
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export const InfoBlockWidget: React.FC<InfoBlockWidgetProps> = ({
  label,
  value,
  tooltip,
  valueFontSize = 'S',
  messageSeverity,
  className,
  valueClassName,
  labelClassName,
}) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.block}>
        <div className={cn(styles.label, labelClassName)}>{label}</div>
        {tooltip && (
          <div ref={setRef} className={styles.iconHolder}>
            <Icon
              name="buttonAlert"
              className={cn({
                [styles.infoIcon]:
                  messageSeverity === TooltipMessageSeverity.Info,
                [styles.positiveIcon]:
                  messageSeverity === TooltipMessageSeverity.Positive,
                [styles.warningIcon]:
                  messageSeverity === TooltipMessageSeverity.Warning,
              })}
            />
            <Popup
              anchor={ref}
              placement="bottom"
              className={cn(styles.tooltip, {
                [styles.infoTooltip]:
                  messageSeverity === TooltipMessageSeverity.Info,
                [styles.positiveTooltip]:
                  messageSeverity === TooltipMessageSeverity.Positive,
                [styles.warningTooltip]:
                  messageSeverity === TooltipMessageSeverity.Warning,
              })}
            >
              {tooltip}
            </Popup>
          </div>
        )}
      </div>
      <div className={cn(styles.block)}>
        <div
          className={cn(valueClassName, {
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
