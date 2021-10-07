import * as cookie from 'cookie';
import { Cookie, Cookies, CookieGetOptions, CookieParseOptions } from './types';

export function hasDocumentCookie(): boolean {
  // Can we get/set cookies on document.cookie?
  return typeof document === 'object' && typeof document.cookie === 'string';
}

export function cleanCookies(): void {
  document.cookie.split(';').forEach(c => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
}

export function parseCookies(
  cookies?: Cookies,
  options?: CookieParseOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (typeof cookies === 'string') {
    return cookie.parse(cookies, options);
  }

  if (typeof cookies === 'object' && cookies !== null) {
    return cookies;
  }

  return {};
}

export function isParsingCookie(value: Cookie, doNotParse?: boolean): boolean {
  let isParsing = doNotParse;

  if (typeof isParsing === 'undefined') {
    // We guess if the cookie start with { or [, it has been serialized
    isParsing =
      !value || (value[0] !== '{' && value[0] !== '[' && value[0] !== '"');
  }

  return !isParsing;
}

function cleanupCookieValue(value: Cookie): Cookie {
  // express prepend j: before serializing a cookie
  if (value && value[0] === 'j' && value[1] === ':') {
    return value.substr(2);
  }

  return value;
}

export function readCookie(
  value: Cookie,
  options: CookieGetOptions = {}
): Cookie {
  const cleanValue = cleanupCookieValue(value);

  if (isParsingCookie(cleanValue, options.doNotParse)) {
    try {
      return JSON.parse(cleanValue);
    } catch (e) {
      // At least we tried
    }
  }

  // Ignore clean value if we failed the deserialization
  // It is not relevant anymore to trim those values
  return value;
}
