import React, { FC, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useAsyncFn, useMount, useMountedState } from 'react-use';

import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Loader } from 'components/loader';
import dynamic from 'next/dynamic';

import { DaoContext } from 'types/context';
import { CustomFcTemplate } from 'types/proposal';
import { DaoFeedItem } from 'types/dao';

import { useWalletContext } from 'context/WalletContext';
// import { SputnikHttpService } from 'services/sputnik';

import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import styles from './CustomFunctionCallTemplatesPageContent.module.scss';

const CustomFcTemplateCard = dynamic(
  import(
    'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard'
  ),
  {
    ssr: false,
  }
);

interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
  accountDaos: DaoFeedItem[];
}

export const CustomFunctionCallTemplatesPageContent: FC<Props> = ({
  daoContext,
  accountDaos,
}) => {
  const router = useRouter();
  const { stateFilter } = router.query;
  const { tokens } = useDaoCustomTokens();
  // const { userPermissions, dao } = daoContext;

  const isMounted = useMountedState();
  const { accountId } = useWalletContext();
  const [templates, setTemplates] = useState<CustomFcTemplate[]>([]);

  const [{ loading }, getTemplates] = useAsyncFn(async () => {
    // const res = await SputnikHttpService.getCustomFcTemplates(
    //   daoContext.dao.id
    // );
    const res = [
      {
        id: '1',
        isActive: true,
        name: 'My custom template',
        payload: {
          methodName: 'create',
          deposit: '1',
          smartContractAddress: 'saturn.sputnikv2.testnet',
          json: '{"key": "value" }',
        },
      } as CustomFcTemplate,
    ];

    if (isMounted()) {
      setTemplates(res);
    }
  }, [accountId, isMounted]);

  useMount(async () => {
    await getTemplates();
  });

  const filterOptions = useMemo(() => {
    const keys = ['Active', 'Inactive'];

    return keys.map(key => ({
      label: key,
      value: key,
    }));
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>DAO Settings</div>
      <div className={styles.sideFilter}>
        <SideFilter
          queryName="stateFilter"
          list={filterOptions}
          title="Custom Function Call templates"
          className={styles.daoConfigFilter}
        />
      </div>
      <div className={styles.content}>
        {loading ? (
          <Loader />
        ) : (
          templates
            .filter(item => {
              if (stateFilter === 'Active') {
                return item.isActive;
              }

              if (stateFilter === 'Inactive') {
                return !item.isActive;
              }

              return true;
            })
            .map(item => (
              <CustomFcTemplateCard
                key={item.id}
                daoContext={daoContext}
                daoTokens={tokens}
                template={item}
                accountDaos={accountDaos}
              />
            ))
        )}
      </div>
    </div>
  );
};
