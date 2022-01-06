import { IconName } from 'components/Icon';

const dict: Partial<Record<IconName, string[]>> = {
  socialFacebook: ['facebook', 'fb'],
  socialTwitter: ['twitter', 't.co'],
  socialDiscord: ['discord'],
  socialGithub: ['github'],
  socialInstagram: ['instagram'],
  socialSlack: ['slack'],
  socialTelegram: ['telegram', 't.me'],
};

export function getSocialLinkIcon(link?: string): IconName {
  if (link == null || link?.length === 0) {
    return 'socialAnyUrl';
  }

  const entries = Object.entries(dict) as [IconName, string[]][];

  // eslint-disable-next-line no-restricted-syntax
  for (const [icon, urls] of entries) {
    if (urls.some(url => link.indexOf(url) !== -1)) {
      return icon;
    }
  }

  return 'socialAnyUrl';
}
