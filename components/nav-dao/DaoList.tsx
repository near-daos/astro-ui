import React, { useMemo, useState } from 'react';
import { Collapsable } from 'components/collapsable/Collapsable';
import { useBoolean } from 'react-use';
import styles from './nav-dao.module.scss';
import { DaoItem } from './DaoItem';
import { DaoHeader } from './DaoHeader';

interface DAOHeaderProps {
  toggle: (newState?: boolean) => void;
  isOpen: boolean;
  onChange?: (currentItem?: string) => void;
  currentItem?: string | undefined;
  items: {
    id: string;
    label: string;
    logo: string;
    count?: number | undefined;
  }[];
}

export const DaoList: React.VFC<DAOHeaderProps> = ({
  items,
  currentItem,
  onChange,
  ...props
}) => {
  // TODO Probably it's better to use router params instead of currentItem prop
  // However url structure is unclear yet
  const [open, toggleState] = useBoolean(false);
  const [selected, setSelected] = useState(currentItem);
  const { isOpen = open, toggle = toggleState } = props;

  const selectedItem = useMemo(() => {
    if (items.length === 0 || (!currentItem && !selected)) return null;

    if (currentItem != null) {
      return items.find(dao => currentItem === dao.id);
    }

    return items.find(dao => selected === dao.id);
  }, [items, currentItem, selected]);

  return (
    <div className={styles.daoHeader}>
      <Collapsable
        isOpen={isOpen}
        toggle={toggle}
        duration={150}
        renderHeading={(toggleHeading, isHeadingOpen) => (
          <DaoHeader
            logo={selectedItem?.logo}
            isOpen={isHeadingOpen}
            onClick={() => toggleHeading()}
            label={selectedItem?.label || 'Select DAO'}
          />
        )}
      >
        {items.map(dao => (
          <DaoItem
            key={dao.id}
            onClick={() => {
              if (onChange) {
                onChange(dao.id);
              } else {
                setSelected(dao.id);
              }

              toggle();
            }}
            logo={dao.logo}
            count={dao.count}
            label={dao.label}
            href={dao.id}
          />
        ))}
      </Collapsable>
    </div>
  );
};
