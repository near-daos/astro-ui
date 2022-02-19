import { NftToken, NftTokenResponse } from 'types/token';

export function mapNftTokenResponseToNftToken(
  data: NftTokenResponse[]
): NftToken[] {
  return data
    .reduce<NftToken[]>((res, item) => {
      const { id, contractId, baseUri, metadata, contract, tokenId } = item;

      if (!metadata) {
        return res;
      }

      const { media, reference } = metadata;

      const isMediaContainsUrl = media?.indexOf('http') === 0;

      const uri = [];
      const isExternalReference = false;

      if (baseUri && media && !isMediaContainsUrl) {
        uri.push({ uri: `${baseUri}/${media}`, isExternalReference: false });
      }

      if (isMediaContainsUrl) {
        uri.push({ uri: media, isExternalReference: false });
      }

      if (contract?.baseUri && !media && reference) {
        uri.push({
          uri: `${contract?.baseUri}/${reference}`,
          isExternalReference: true,
        });
      }

      if (contract.baseUri && media && !isMediaContainsUrl) {
        uri.push({
          uri: `${contract?.baseUri}/${media}`,
          isExternalReference: false,
        });
      }

      if (media) {
        uri.push({
          uri: `https://cloudflare-ipfs.com/ipfs/${media}`,
          isExternalReference: false,
        });
      }

      if (uri) {
        res.push({
          id,
          uri,
          description: metadata.description ?? null,
          isExternalReference,
          contractId,
          contractName: contract.name,
          tokenId,
        });
      }

      return res;
    }, [])
    .sort((a, b) => {
      if (a.uri > b.uri) {
        return 1;
      }

      if (a.uri < b.uri) {
        return -1;
      }

      return 0;
    });
}
