import React, { FC, useState } from 'react';
import cn from 'classnames';

import { IconButton } from 'components/button/IconButton';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';

import { Icon } from 'components/Icon';

import styles from './NFTActions.module.scss';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

interface Props {
  contractId: string;
  tokenId: string;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const NFTActions: FC<Props> = ({
  contractId,
  tokenId,
  toggleCreateProposal,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={async e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <GenericDropdown
          isOpen={open}
          onOpenUpdate={setOpen}
          parent={
            <div className={styles.root}>
              <IconButton icon="kebabVertical" className={styles.rootIcon} />
            </div>
          }
        >
          <ul className={styles.menu}>
            <li
              className={cn(styles.menuItem)}
              onClick={async () => {
                setOpen(false);

                if (!toggleCreateProposal) {
                  return;
                }

                toggleCreateProposal({
                  initialValues: {
                    smartContractAddress: contractId,
                    methodName: 'nft_transfer',
                    json: JSON.stringify(
                      {
                        token_id: tokenId,
                        receiver_id: 'RECEIVER_ID',
                        memo: 'OPTIONAL MEMO',
                      },
                      null,
                      2
                    ),
                    deposit: '0.000000000000000000000001',
                  },
                });
              }}
            >
              <Icon name="proposalSendFunds" className={styles.icon} />
              <span>Transfer NFT</span>
            </li>
          </ul>
        </GenericDropdown>
      </div>
    </>
  );
};
