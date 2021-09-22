import { Collapsable } from 'components/collapsable/Collapsable';
import { DaoHeader } from 'components/nav-dao/DaoHeader';

import { DaoItem } from 'components/nav-dao/DaoItem';
import { DAO_COOKIE, useSelectedDAO } from 'hooks/useSelectedDao';
import React from 'react';
import { useBoolean, useCookie } from 'react-use';

import { DAO } from 'types/dao';

interface DAOListProps {
  toggle: (newState?: boolean) => void;
  isOpen: boolean;
  items: DAO[];
}

export const DaoList: React.VFC<DAOListProps> = ({ items, ...props }) => {
  const [open, toggleState] = useBoolean(false);
  const { isOpen = open, toggle = toggleState } = props;

  const selectedDao = useSelectedDAO();
  const [, setSelectedDaoCookie] = useCookie(DAO_COOKIE);

  return (
    <div>
      <Collapsable
        isOpen={isOpen}
        toggle={toggle}
        duration={150}
        renderHeading={(toggleHeading, isHeadingOpen) => (
          <DaoHeader
            daoId={selectedDao?.id}
            logo={selectedDao?.logo}
            isOpen={isHeadingOpen}
            label={selectedDao?.name || ''}
            openCloseDropdown={toggleHeading}
          />
        )}
      >
        {items.map(dao => (
          <DaoItem
            onClick={() => {
              toggle(false);
              setSelectedDaoCookie(dao.id, { expires: 30 * 24 * 60 * 60 });
            }}
            dao={dao}
            key={dao.id}
            logo={dao.logo}
            label={dao.name}
            count={dao.members}
            selected={selectedDao?.id === dao.id}
          />
        ))}
      </Collapsable>
    </div>
  );
};
