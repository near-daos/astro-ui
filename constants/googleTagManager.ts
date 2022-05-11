export const gtag = (key: string): string => {
  return `https://www.googletagmanager.com/gtag/js?id=${key}`;
};

export const gtagScript = (key: string, accountId: string): string => {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${key}', {
      page_path: window.location.pathname,
      user_id: '${accountId}',
    });

    gtag('set', 'user_properties', {
      account_id: '${accountId}',
    });
`;
};
