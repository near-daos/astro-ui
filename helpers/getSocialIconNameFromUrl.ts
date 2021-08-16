import { IconName } from 'components/Icon';

const websiteRegex = /.+\/\/|www.|\..+/g;

const dict: Partial<Record<IconName, string[]>> = {
  socialFacebook: ['facebook', 'fb'],
  socialTwitter: ['twitter', 't.co'],
  socialDiscord: ['discord'],
  socialGithub: ['github'],
  socialInstagram: ['instagram'],
  socialSlack: ['slack'],
  socialTelegram: ['telegram.org', 't.me']
};

export function getSocialIconNameFromUrl(url?: string): IconName {
  if (url?.length === 0) return 'socialAnyUrl';

  const website = url?.replace(websiteRegex, '');

  if (website != null && website.length > 0) {
    const entries = Object.entries(dict) as [IconName, string[]][];

    // eslint-disable-next-line no-restricted-syntax
    for (const [icon, urls] of entries) if (urls.includes(website)) return icon;
  }

  return 'socialAnyUrl';
}
