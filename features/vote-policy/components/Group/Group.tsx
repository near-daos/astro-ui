import React, { FC } from 'react';

import styles from './Group.module.scss';

interface GroupProps {
  name: string;
}

export const Group: FC<GroupProps> = ({ name }) => (
  <div className={styles.root}>{name}</div>
);
