import { useBoolean } from 'react-use';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapsable } from 'components/collapsable/Collapsable';

import { DAO } from 'types/dao';
import { selectSelectedDAO, setSelectedDAO } from 'store/dao';

import { DaoItem } from './DaoItem';
import { DaoHeader } from './DaoHeader';

import styles from './nav-dao.module.scss';

interface DAOListProps {
  toggle: (newState?: boolean) => void;
  isOpen: boolean;
  items: DAO[];
}

export const DaoList: React.VFC<DAOListProps> = ({ items, ...props }) => {
  const dispatch = useDispatch();

  // TODO Probably it's better to use router params instead of currentItem prop
  // However url structure is unclear yet
  const [open, toggleState] = useBoolean(false);
  const { isOpen = open, toggle = toggleState } = props;

  const selectedDao = useSelector(selectSelectedDAO);

  const selectDao = useCallback(
    (dao: DAO) => {
      dispatch(setSelectedDAO(dao.id));
    },
    [dispatch]
  );

  return (
    <div className={styles.daoHeader}>
      <Collapsable
        isOpen={isOpen}
        toggle={toggle}
        duration={150}
        renderHeading={(toggleHeading, isHeadingOpen) => (
          <DaoHeader
            logo={selectedDao?.logo}
            isOpen={isHeadingOpen}
            onClick={() => toggleHeading()}
            label={selectedDao?.name || 'Select DAO'}
          />
        )}
      >
        {items.map(dao => (
          <DaoItem
            dao={dao}
            key={dao.id}
            logo={dao.logo}
            label={dao.name}
            count={dao.members}
            selectDao={selectDao}
            href={`/dao-home/${dao.id}`}
          />
        ))}
      </Collapsable>
    </div>
  );
};
