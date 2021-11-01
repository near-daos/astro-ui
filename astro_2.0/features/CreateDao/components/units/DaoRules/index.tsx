import { DaoRulesForm } from 'astro_2.0/features/CreateDao/components/DaoRulesForm/DaoRulesForm';
import styles from 'astro_2.0/features/CreateDao/components/units/DaoUnit.module.scss';

export function DaoRules(): JSX.Element {
  return (
    <div className={styles.root}>
      <DaoRulesForm />
    </div>
  );
}
