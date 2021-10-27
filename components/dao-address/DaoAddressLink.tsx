import React, { MouseEvent } from 'react';
import { nearConfig } from 'config';

interface DaoAddressLinkProps {
  daoAddress: string;
}

export const DaoAddressLink: React.VFC<DaoAddressLinkProps> = ({
  daoAddress,
}) => {
  const daoAddressLink = `${nearConfig.explorerUrl}/accounts/${daoAddress}`;

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <>
      {daoAddress && (
        <a
          href={daoAddressLink}
          onClick={stopPropagation}
          target="_blank"
          rel="noreferrer"
        >
          {daoAddress}
        </a>
      )}
    </>
  );
};
