export type PkAndSignature =
  | { publicKey: string | null; signature: string | null }
  | Record<string, never>;
