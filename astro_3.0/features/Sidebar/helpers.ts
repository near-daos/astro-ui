import { DaoFeedItem } from 'types/dao';

const DEFAULT_DAO_AVATAR = '/avatars/defaultDaoAvatar.png';

export function getDaoAvatar(dao: DaoFeedItem): string {
  if (!dao.flagLogo && !dao.logo) {
    return DEFAULT_DAO_AVATAR;
  }

  const daoLogo = dao.flagLogo || dao.logo;

  if (daoLogo?.indexOf('defaultDaoFlag') !== -1) {
    return DEFAULT_DAO_AVATAR;
  }

  return daoLogo;
}
