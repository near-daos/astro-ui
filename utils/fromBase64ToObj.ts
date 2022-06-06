export function fromBase64ToObj<T>(str: string): T {
  return JSON.parse(Buffer.from(str, 'base64').toString('utf-8'));
}
