import { KeyPair } from 'near-api-js';

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
