import { IconName } from 'components/Icon';

export interface NavItemProps {
  icon: IconName;
  hoverIcon: IconName;
  href: string;
  label: string;
  authRequired?: boolean;
}
