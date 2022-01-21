// TODO check code and replace redundant methods that only call this method.
export function jsonToBase64Str(data: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}
