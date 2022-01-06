import { useRouter } from 'next/router';
import React, { useMemo, VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';
import { MemberStats } from 'services/sputnik/mappers';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { GroupsPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/GroupsPageContent';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

export interface GroupPageProps {
  daoContext: DaoContext;
  membersStats: MemberStats[];
}

const GroupPage: VFC<GroupPageProps> = ({ daoContext, membersStats }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const groupQueryName = router.query.group as string;
  const groupName =
    groupQueryName === 'all'
      ? t('allMembers')
      : groupQueryName.replace('-', ' ');

  const breadcrumbsConfig = useGetBreadcrumbsConfig(daoContext.dao, {
    id: groupQueryName,
    label: groupName,
  });

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.GROUPS,
      breadcrumbsConfig.SINGLE_GROUP,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeCreateGroup}
    >
      <GroupsPageContent
        daoContext={daoContext}
        membersStats={membersStats}
        pageTitle={groupName}
      />
    </NestedDaoPageWrapper>
  );
};

export default GroupPage;
