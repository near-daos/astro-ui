export const composeProperLinkUrl = (link: string): string => {
  const protocolPattern = /^((http|https):\/\/)/;

  return protocolPattern.test(link) ? link : `http://${link}`;
};
