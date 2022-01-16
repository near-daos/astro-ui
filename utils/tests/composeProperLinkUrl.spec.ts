import { composeProperLinkUrl } from 'utils/composeProperLinkUrl';

describe('compose proper link url', () => {
  it('Should not add http if http/https is presented in url', () => {
    const urlOne = 'http://helloworld.com';
    const urlTwo = 'http://helloworld.com';

    expect(composeProperLinkUrl(urlOne)).toStrictEqual(urlOne);
    expect(composeProperLinkUrl(urlTwo)).toStrictEqual(urlTwo);
  });

  it('Should add http if not presented in url', () => {
    const url = 'helloworld.com';

    expect(composeProperLinkUrl(url)).toStrictEqual(`http://${url}`);
  });
});
