export function jsonToBase64Str(data: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}
