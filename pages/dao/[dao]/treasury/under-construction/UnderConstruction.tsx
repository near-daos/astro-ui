import { useRouter } from 'next/router';
import { useCallback, VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { CREATE_GOV_TOKEN_PAGE_URL } from 'constants/routing';

import { Button } from 'components/button/Button';

import styles from './UnderConstruction.module.scss';

const UnderConstruction: VFC = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const goToCreateToken = useCallback(() => {
    router.push({
      pathname: CREATE_GOV_TOKEN_PAGE_URL,
      query: {
        dao: router.query.dao,
      },
    });
  }, [router]);

  return (
    <div className={styles.root}>
      {t('createGovernanceTokenPage.underConstruction')}
      <Button onClick={goToCreateToken}>Go Back</Button>
    </div>
  );
};

export default UnderConstruction;
