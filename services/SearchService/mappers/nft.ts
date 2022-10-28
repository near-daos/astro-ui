import { NftToken } from 'types/token';
import { NftIndex } from 'services/SearchService/types';

export function mapNftIndexToNftToken(item: NftIndex): NftToken {
  const { id, contractId, baseUri, metadata, contract, tokenId } = item;

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

  return {
    id,
    uri,
    description: metadata.description ?? null,
    isExternalReference,
    contractId,
    contractName: contract.name,
    tokenId,
  };
}
