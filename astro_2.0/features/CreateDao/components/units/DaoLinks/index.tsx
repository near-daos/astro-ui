import { useFormContext } from 'react-hook-form';
import { DaoLinksForm } from 'astro_2.0/features/CreateDao/components/DaoLinksForm/DaoLinksForm';
import styles from 'astro_2.0/features/CreateDao/components/units/DaoUnit.module.scss';

export function DaoLinks(): JSX.Element {
  const { getValues, reset } = useFormContext();

  return (
    <div className={styles.root}>
      <DaoLinksForm
        id="dao-links-form"
        initialValues={getValues()}
        onSubmit={data => {
          reset({
            ...getValues(),
            ...data,
          });
        }}
      />
    </div>
  );
}
