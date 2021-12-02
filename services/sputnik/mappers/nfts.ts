import { NftToken, NftTokenResponse } from 'types/token';

export function mapNftTokenResponseToNftToken(
  data: NftTokenResponse[]
): NftToken[] {
  return data
    .reduce<NftToken[]>((res, item) => {
      const { id, baseUri, metadata, contract } = item;

      if (!metadata) return res;

      const { media, reference } = metadata;

      const isMediaContainsUrl = media?.indexOf('http') === 0;

      let uri;
      let isExternalImage = false;
      let isExternalReference = false;

      if (baseUri && media && !isMediaContainsUrl) {
        uri = `${baseUri}/${media}`;
      } else if (isMediaContainsUrl) {
        uri = media;
        isExternalImage = true;
      } else if (contract.baseUri && !media && reference) {
        uri = `${contract.baseUri}/${reference}`;
        isExternalReference = true;
      } else if (media) {
        uri = `https://cloudflare-ipfs.com/ipfs/${media}`;
      }

      if (uri) {
        res.push({
          id,
          uri,
          description: metadata.description ?? null,
          title: metadata.title ?? null,
          isExternalImage,
          isExternalReference,
        });
      }

      return res;
    }, [])
    .sort((a, b) => {
      if (a.uri > b.uri) return 1;

      if (a.uri < b.uri) return -1;

      return 0;
    });
}
