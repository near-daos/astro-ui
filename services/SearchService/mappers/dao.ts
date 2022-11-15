import get from 'lodash/get';

import { DaoIndex } from 'services/SearchService/types';
import { DAO } from 'types/dao';
import { DaoRole } from 'types/role';

import { toMillis } from 'utils/format';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';
import { fromBase64ToMetadata } from 'services/sputnik/mappers';
import { getParsedPolicy } from 'services/SearchService/mappers/helpers';
import { mapTokenIndexToToken } from 'services/SearchService/mappers/tokens';

export function mapDaoIndexToDao(daoIndex: DaoIndex): DAO {
  const config = get(daoIndex, 'config');

  let meta;

  try {
    meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;
  } catch (err) {
    console.error(`Failed to parse DAO metadata, daoId: ${daoIndex.id}`);

    meta = null;
  }

  const policy =
    typeof daoIndex.policy === 'string'
      ? getParsedPolicy(daoIndex.policy)
      : daoIndex.policy;

  // Get DAO groups
  const daoGroups =
    policy?.roles
      ?.filter((item: DaoRole) => item.kind === 'Group')
      .map((item: DaoRole) => {
        return {
          members: item.accountIds || [],
          name: item.name,
          permissions: item.permissions,
          votePolicy: item.votePolicy,
          slug: item.name,
        };
      }) ?? [];

  const daoMembersList = daoGroups
    .map(({ members }: { members: string[] }) => members)
    .flat()
    .reduce((acc: string[], member: string) => {
      if (!acc.includes(member)) {
        acc.push(member);
      }

      return acc;
    }, []);
  const numberOfMembers = daoMembersList.length;

  return {
    createdAt: new Date(toMillis(daoIndex.createTimestamp)).toISOString(),
    id: daoIndex.id,
    members: numberOfMembers,
    groups: daoGroups,
    activeProposalsCount: daoIndex.activeProposalCount ?? 0,
    totalProposalsCount: daoIndex.totalProposalCount ?? 0,
    totalDaoFunds: daoIndex.totalDaoFunds ?? 0,

    txHash: daoIndex.transactionHash ?? '',
    name: config?.name ?? '',
    description: config?.purpose ?? '',
    displayName: meta?.displayName ?? '',

    tokens: daoIndex.tokens.map(mapTokenIndexToToken),

    links: meta?.links || [],
    logo: meta?.flag ? getAwsImageUrl(meta?.flag) : '/flags/defaultDaoFlag.png',
    flagCover: getAwsImageUrl(meta?.flagCover),
    flagLogo: getAwsImageUrl(meta?.flagLogo),
    legal: meta?.legal || {},
    policy,
    daoMembersList,
    daoVersion: daoIndex.daoVersion ?? null,
    daoVersionHash: '',
    funds: '',
    lastProposalId: daoIndex.lastProposalId,
    totalProposals: daoIndex.totalProposalCount ?? 0,
    delegations: daoIndex.delegations ?? [],
  };
}
