import { getSocialLinkIcon } from 'utils/getSocialLinkIcon';

describe('get social link icon', () => {
  it('Should return socialAnyUrl if link is empty or not in dictionary', () => {
    expect(getSocialLinkIcon('')).toStrictEqual('socialAnyUrl');
    expect(getSocialLinkIcon('helloWorld')).toStrictEqual('socialAnyUrl');
  });

  it.each`
    link                | icon
    ${'facebook'}       | ${'socialFacebook'}
    ${'fb'}             | ${'socialFacebook'}
    ${'asdfacebookasd'} | ${'socialFacebook'}
    ${'twitter'}        | ${'socialTwitter'}
    ${'t.com'}          | ${'socialTwitter'}
    ${'discord'}        | ${'socialDiscord'}
    ${'github'}         | ${'socialGithub'}
    ${'instagram'}      | ${'socialInstagram'}
    ${'slack'}          | ${'socialSlack'}
    ${'telegram'}       | ${'socialTelegram'}
    ${'t.me'}           | ${'socialTelegram'}
  `('Should return proper icon for link', ({ link, icon }) => {
    expect(getSocialLinkIcon(link)).toBe(icon);
  });
});
