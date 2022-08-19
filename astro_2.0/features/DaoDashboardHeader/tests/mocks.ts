import { DAO } from 'types/dao';

export const daoDescription = 'DAO description';

export const dao = {
  id: 'daoId',
  displayName: 'displayName',
  daoMembersList: ['DM1', 'DM2'],
  flagCover: 'flagCover',
  flagLogo: 'flagLogo',
  members: 2,
  description: daoDescription,
  links: ['DL1', 'DL2'],
  daoVersion: {
    version: [2, 0],
    hash: 'qwerty',
  },
  policy: {
    roles: [],
  },
} as unknown as DAO;
