export async function getImagesFromLinks(links: NodeList): Promise<string[]> {
  if (!links) {
    return [];
  }

  const urls = Array.from(links).map(item => (item as HTMLAnchorElement).href);

  return Promise.allSettled(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          resolve(url);
        };

        img.onerror = () => {
          reject();
        };

        img.src = url;
      });
    })
  )
    .then(result => {
      return result
        .filter(item => item.status === 'fulfilled')
        .map(item => (item as PromiseFulfilledResult<string>).value);
    })
    .catch(() => {
      return [];
    });
}
