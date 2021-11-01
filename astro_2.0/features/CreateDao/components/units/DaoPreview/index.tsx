import { DaoPreviewForm } from 'astro_2.0/features/CreateDao/components/DaoPreviewForm/DaoPreviewForm';
import styles from 'astro_2.0/features/CreateDao/components/units/DaoUnit.module.scss';

export function DaoPreview(): JSX.Element {
  return (
    <div className={styles.root}>
      <DaoPreviewForm />
    </div>
  );
}
