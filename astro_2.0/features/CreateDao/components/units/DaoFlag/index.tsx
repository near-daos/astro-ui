import { DaoFlagForm } from 'astro_2.0/features/CreateDao/components/DaoFlagForm/DaoFlagForm';
import styles from 'astro_2.0/features/CreateDao/components/units/DaoUnit.module.scss';

export function DaoFlag(): JSX.Element {
  return (
    <div className={styles.root}>
      <DaoFlagForm />
    </div>
  );
}
