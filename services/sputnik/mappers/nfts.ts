import { NftToken, NftTokenResponse } from 'types/token';

export function mapNftTokenResponseToNftToken(
  data: NftTokenResponse[]
): NftToken[] {
  return data
    .reduce<NftToken[]>((res, item) => {
      const { id, baseUri, metadata } = item;

      let uri;

      if (baseUri) {
        uri = `${baseUri}/${metadata.media}`;
      } else if (metadata.media.indexOf('http') === 0) {
        uri = metadata.media;
      } else {
        uri = `https://cloudflare-ipfs.com/ipfs/${metadata.media}`;
      }

      res.push({
        id,
        uri,
        description: metadata.description ?? null,
        title: metadata.title ?? null,
      });

      return res;
    }, [])
    .sort((a, b) => {
      if (a.uri > b.uri) return 1;

      if (a.uri < b.uri) return -1;

      return 0;
    });
}
