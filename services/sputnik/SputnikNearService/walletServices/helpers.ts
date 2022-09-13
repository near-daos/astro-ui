import { KeyPair } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  FinalExecutionError,
  SenderWalletExtensionResult,
  SenderWalletTransactionResult,
} from 'services/sputnik/SputnikNearService/walletServices/types';
import { httpService } from 'services/HttpService';

export const getSignature = async (
  keyPair: KeyPair
): Promise<string | null> => {
  const publicKey = keyPair.getPublicKey();
  const msg = Buffer.from(publicKey.toString());

  const { signature } = keyPair.sign(msg);
  const signatureBase64 = Buffer.from(signature).toString('base64');

  const isValid = keyPair.verify(msg, signature);

  if (!isValid) {
    // eslint-disable-next-line no-console
    console.log('Failed to create valid signature');

    return null;
  }

  return signatureBase64;
};

export async function triggerTransactionCallback(
  resp: FinalExecutionOutcome
): Promise<void> {
  const transactionHashes = resp.transaction.hash;
  const signerId = resp.transaction.signer_id;

  await httpService.get(
    `/transactions/wallet/callback/${signerId}?transactionHashes=${transactionHashes}&noRedirect=true`
  );
}

export function isFinalExecutionOutcomeResponse(
  _params: FinalExecutionOutcome[] | void
): _params is FinalExecutionOutcome[] {
  const resp = _params as FinalExecutionOutcome[];

  return resp?.length > 0 && !!resp[0]?.transaction;
}

export function isFinalExecutionOutcome(
  _params: FinalExecutionOutcome | void
): _params is FinalExecutionOutcome {
  return (_params as FinalExecutionOutcome)?.transaction !== undefined;
}

export function isExtensionError(
  _params: SenderWalletTransactionResult | SenderWalletExtensionResult
): _params is SenderWalletExtensionResult {
  return (_params as SenderWalletExtensionResult)?.error !== undefined;
}

export function isError(
  _params: FinalExecutionOutcome[] | FinalExecutionError
): _params is FinalExecutionError {
  return (_params as FinalExecutionError)?.error?.kind !== undefined;
}
