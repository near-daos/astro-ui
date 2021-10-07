// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Cookie = any;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Cookies = string | object | null;

export interface CookieGetOptions {
  doNotParse?: boolean;
}

export interface CookieSetOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'none' | 'lax' | 'strict';
  encode?: (value: string) => string;
}
export interface CookieChangeOptions {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  options?: CookieSetOptions;
}

export interface CookieParseOptions {
  decode: (value: string) => string;
}

export type CookieChangeListener = (options: CookieChangeOptions) => void;
