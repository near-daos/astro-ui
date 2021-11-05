import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Title } from 'components/Typography';
import { SelectFlag } from 'features/create-dao/components/select-flag/SelectFlag';
import styles from 'features/create-dao/components/steps/form/form.module.scss';
import { DAOFormValues } from 'features/create-dao/components/steps/types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { nearConfig } from 'config/index';

import { useFormContext } from 'react-hook-form';

function FlagViewComponent(): JSX.Element {
  const { setValue, getValues } = useFormContext<DAOFormValues>();
  const router = useRouter();

  const name = getValues('address');

  const onSubmit = (data: { file: File; preview: string }) => {
    setValue('flag', data.file);
    setValue('flagPreview', data.preview);
    router.push('/create-dao/review');
  };

  const sources = [
    '/flags/flag-1.svg',
    '/flags/flag-2.svg',
    '/flags/flag-3.svg',
    '/flags/flag-4.svg',
    '/flags/flag-5.svg',
    '/flags/flag-6.svg'
  ];

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>Select your flag</h2>
        <p> Move the window around to pick your flag </p>
      </div>
      <SelectFlag
        id="flag"
        fileName={`${name}.${nearConfig.contractName}`}
        onSubmit={onSubmit}
        sources={sources}
      />

      <div className={styles.footer}>
        <div style={{ gap: '16px' }} className={styles.inline}>
          <Link href="/create-dao/form">
            <a href="*" className={styles.inline}>
              <Icon width={24} name="buttonArrowLeft" />
              <Title size={5}>Back</Title>
            </a>
          </Link>
          <Title className={styles.gray} size={5}>
            Step 4 of 5
          </Title>
        </div>
        <Button type="submit" form="flag" style={{ textTransform: 'none' }}>
          <span className={styles.gray}> Next:</span> Review a DAO
        </Button>
      </div>
    </div>
  );
}

export const FlagView = dynamic(() => Promise.resolve(FlagViewComponent), {
  ssr: false
});
