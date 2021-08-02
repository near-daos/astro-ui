import Link from 'next/link';
import { Icon, IconName } from 'components/Icon';
import { Badge } from 'components/badge/Badge';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import styles from './navitem.module.scss';

interface NavItemProps {
  label: string;
  href: string;
  icon: IconName;
  count?: number;
  active?: boolean;
  className?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  href,
  count,
  active: isActive,
  className: classNameProp
}) => {
  const router = useRouter();

  const className = classNames(
    styles.nav,
    {
      [styles.active]: isActive || router.pathname === href
    },
    classNameProp
  );

  return (
    <Link href={href} passHref>
      {/* Property 'href' would be overridden by Link. Check https://git.io/Jns2B */}
      <a href="*" className={className}>
        <Icon height={16} name={icon} />
        <span> {label} </span>
        {Number.isFinite(count) && (
          <Badge className={styles.badge} variant="primary" size="small">
            {count && count > 99 ? '99+' : count}
          </Badge>
        )}
      </a>
    </Link>
  );
};
