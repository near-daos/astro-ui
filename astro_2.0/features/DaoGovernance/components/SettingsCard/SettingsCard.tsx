import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import React, { ReactNode } from 'react';
import styles from 'astro_2.0/features/DaoGovernance/components/SettingsCard/SettingsCard.module.scss';
import cn from 'classnames';

interface SettingsCardProps {
  settingName: string;
  settings: {
    label: string;
    value: ReactNode;
  }[];
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  settingName,
  settings,
  className,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.settingName}>{settingName}</div>
      {settings.map(setting => (
        <InfoBlockWidget
          key={setting.label}
          label={setting.label}
          value={setting.value}
          className={styles.padding}
        />
      ))}
    </div>
  );
};
