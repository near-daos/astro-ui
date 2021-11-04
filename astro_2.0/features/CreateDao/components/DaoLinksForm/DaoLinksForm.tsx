import times from 'lodash/times';
import React, { VFC, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { DaoLinkLine } from './components/DaoLinkLine';

import styles from './DaoLinksForm.module.scss';

export const DaoLinksForm: VFC = () => {
  const { setValue, getValues } = useFormContext();

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

  function renderLinkFormEls() {
    return times(linksCount, index => (
      <DaoLinkLine key={index} index={index} removeLink={removeLink} />
    ));
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
        {renderLinkFormEls()}

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
