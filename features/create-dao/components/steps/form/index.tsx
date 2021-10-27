import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';

import { Icon } from 'components/Icon';
import { Title } from 'components/Typography';
import { Button } from 'components/button/Button';

import { DaoCreateForm } from 'features/create-dao/components/dao-create-form/DaoCreateForm';

import { formatDaoAddress } from 'features/create-dao/components/dao-create-form/helpers';

import styles from 'features/create-dao/components/steps/form/form.module.scss';

export function FormView(): JSX.Element {
  const { getValues, reset } = useFormContext();
  const router = useRouter();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>Name your DAO</h2>
      </div>
      <div className={styles.form}>
        <DaoCreateForm
          id="dao-create-form"
          initialValues={getValues()}
          onSubmit={async data => {
            reset({
              ...getValues(),
              ...data,
              address: formatDaoAddress(data.displayName),
            });
            await router.push('/create-dao/flag');
          }}
        />
      </div>

      <div className={styles.footer}>
        <div style={{ gap: '16px' }} className={styles.inline}>
          <Link href="/create-dao/transparency" as="/create-dao/transparency">
            <a href="*" className={styles.inline}>
              <Icon width={24} name="buttonArrowLeft" />
              <Title size={5}>Back</Title>
            </a>
          </Link>
          <Title className={styles.gray} size={5}>
            Step 3 of 5
          </Title>
        </div>

        <Button
          type="submit"
          form="dao-create-form"
          style={{ textTransform: 'none' }}
        >
          <span className={styles.gray}> Next:</span> Select a flag
        </Button>
      </div>
    </div>
  );
}
