import { DaoSubmitForm } from 'astro_2.0/features/CreateDao/components/DaoSubmitForm/DaoSubmitForm';
import styles from 'astro_2.0/features/CreateDao/components/units/DaoUnit.module.scss';

export function DaoSubmit(): JSX.Element {
  return (
    <div className={styles.root}>
      <DaoSubmitForm />
    </div>
  );
}
