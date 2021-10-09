import React from 'react';
import { useBoolean, useCookie } from 'react-use';

import { Collapsable } from 'components/collapsable/Collapsable';
import { DaoHeader } from 'components/nav-dao/DaoHeader';
import { DaoItem } from 'components/nav-dao/DaoItem';

import { DAO } from 'types/dao';
import { DAO_COOKIE } from 'constants/cookies';

interface DAOListProps {
  toggle: (newState?: boolean) => void;
  isOpen: boolean;
  items: DAO[];
}

export const DaoList: React.VFC<DAOListProps> = ({ items, ...props }) => {
  const [open, toggleState] = useBoolean(false);
  const { isOpen = open, toggle = toggleState } = props;

  const [selectedDaoId, setSelectedDaoCookie] = useCookie(DAO_COOKIE);
  const selectedDao = items?.find(item => item.id === selectedDaoId);

  return (
    <div>
      <Collapsable
        isOpen={isOpen}
        toggle={toggle}
        duration={150}
        renderHeading={(toggleHeading, isHeadingOpen) => (
          <DaoHeader
            logo={selectedDao?.logo}
            isOpen={isHeadingOpen}
            label={selectedDao?.displayName || selectedDao?.name || ''}
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
            count={dao.proposals}
            selected={selectedDao?.id === dao.id}
          />
        ))}
      </Collapsable>
    </div>
  );
};
