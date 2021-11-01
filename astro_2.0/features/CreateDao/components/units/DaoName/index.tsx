import { useFormContext } from 'react-hook-form';
import { DaoNameForm } from 'astro_2.0/features/CreateDao/components/DaoNameForm/DaoNameForm';
import { formatDaoAddress } from 'astro_2.0/features/CreateDao/components/DaoNameForm/helpers';
import styles from 'astro_2.0/features/CreateDao/components/units/DaoUnit.module.scss';

export function DaoName(): JSX.Element {
  const { getValues, reset } = useFormContext();

  return (
    <div className={styles.root}>
      <DaoNameForm
        id="dao-name-form"
        initialValues={getValues()}
        onSubmit={data => {
          reset({
            ...getValues(),
            ...data,
            address: formatDaoAddress(data.displayName),
          });
        }}
      />
    </div>
  );
}
