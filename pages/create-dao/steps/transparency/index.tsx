import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Title } from 'components/Typography';
import { DaoPublicNotice } from 'features/create-dao/components/public-notice/DaoPublicNotice';
import Link from 'next/link';
import styles from 'pages/create-dao/steps/settings/settings.module.scss';

export function TransparencyView(): JSX.Element {
  return (
    <div className={styles.root}>
      <DaoPublicNotice />

      <div className={styles.footer}>
        <div style={{ gap: '16px' }} className={styles.inline}>
          <Link href="/create-dao/foundation" as="/create-dao/foundation">
            <a href="*" className={styles.inline}>
              <Icon width={24} name="buttonArrowLeft" />
              <Title size={5}>Back</Title>
            </a>
          </Link>
          <Title className={styles.gray} size={5}>
            Step 2 of 5
          </Title>
        </div>
        <Link href="/create-dao/form" as="/create-dao/form">
          <a href="*">
            <Button style={{ textTransform: 'none' }}>
              <span className={styles.gray}> Next:</span> Name your dao
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
