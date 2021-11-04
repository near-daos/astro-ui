import React, { VFC, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Icon } from 'components/Icon';
import { Input } from 'components/inputs/input/Input';
import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';
import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';

import styles from './DaoLinksForm.module.scss';

export const DaoLinksForm: VFC = () => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors, touchedFields },
  } = useFormContext();

  const initialValues = getValues();

  const [linksCount, setLinksCount] = useState<number>(
    initialValues?.websites?.length ?? 0
  );

  function addLink() {
    setLinksCount(count => count + 1);
  }

  function removeLink(index: number) {
    const websites = getValues('websites');

    websites.splice(index, 1);

    setValue('websites', websites);
    setLinksCount(count => count - 1);
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>Links and socials</h2>
        <p>
          Looking to&nbsp;grow the DAO members? Add links to&nbsp;allow people
          to&nbsp;learn more about your DAO.
        </p>
      </div>

      <section className={styles.links}>
        {Array.from({ length: linksCount }, (_, i) => i).map(index => (
          <div className={styles.link} key={index}>
            <Icon
              className={styles.socialIcon}
              name={getSocialLinkIcon(getValues(`websites.${index}` as const))}
              width={24}
            />
            <Input
              isValid={
                touchedFields.websites?.[index] &&
                !errors.websites?.[index]?.message
              }
              key={`websites.${index}` as const}
              placeholder="https://"
              {...register(`websites.${index}` as const, {
                shouldUnregister: true,
              })}
              size="block"
            />
            <IconButton
              className={styles.deleteBtn}
              icon="buttonDelete"
              onClick={() => removeLink(index)}
              size="medium"
            />
          </div>
        ))}

        <Button className={styles.link} onClick={addLink} variant="transparent">
          <Icon
            className={styles.socialIcon}
            name="socialPlaceholder"
            width={24}
          />
          <span className={styles.socialText}>https://</span>
          <Icon className={styles.addBtn} name="buttonAdd" width={24} />
        </Button>
      </section>
    </div>
  );
};
