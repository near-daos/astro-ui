/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import * as cookie from 'cookie';
import {
  Cookie,
  CookieChangeListener,
  CookieChangeOptions,
  CookieGetOptions,
  CookieParseOptions,
  Cookies,
  CookieSetOptions,
} from './types';
import { hasDocumentCookie, parseCookies, readCookie } from './utils';

export class CookieService {
  private cookies: { [name: string]: Cookie };

  private changeListeners: CookieChangeListener[] = [];

  private HAS_DOCUMENT_COOKIE = false;

  constructor(cookies?: Cookies, options?: CookieParseOptions) {
    this.cookies = parseCookies(cookies, options);

    new Promise(() => {
      this.HAS_DOCUMENT_COOKIE = hasDocumentCookie();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    }).catch(() => {});
  }

  public initServerSideCookies(
    cookies: Cookies,
    options?: CookieParseOptions
  ): void {
    this.cookies = parseCookies(cookies, options);
  }

  public get(name: string, options?: CookieGetOptions): any;

  public get<T>(name: string, options?: CookieGetOptions): T;

  public get(
    name: string,
    options: CookieGetOptions = {},
    parseOptions?: CookieParseOptions
  ): string {
    this._updateBrowserValues(parseOptions);

    return readCookie(this.cookies[name], options);
  }

  public getAll(options?: CookieGetOptions): any;

  public getAll<T>(options?: CookieGetOptions): T;

  public getAll(
    options: CookieGetOptions = {},
    parseOptions?: CookieParseOptions
  ): { [name: string]: any } {
    this._updateBrowserValues(parseOptions);

    const result: { [name: string]: any } = {};

    Object.keys(this.cookies).forEach(name => {
      result[name] = readCookie(this.cookies[name], options);
    });

    return result;
  }

  public set(name: string, value: Cookie, options?: CookieSetOptions): void {
    let valueObjectOrString = value;

    if (typeof valueObjectOrString === 'object') {
      valueObjectOrString = JSON.stringify(value);
    }

    this.cookies = {
      ...this.cookies,
      [name]: valueObjectOrString,
    };

    if (this.HAS_DOCUMENT_COOKIE) {
      document.cookie = cookie.serialize(name, valueObjectOrString, options);
    }

    this._emitChange({
      name,
      value: valueObjectOrString,
      options,
    });
  }

  public remove(name: string, options?: CookieSetOptions): void {
    const finalOptions = {
      ...options,
      expires: new Date(1970, 1, 1, 0, 0, 1),
      maxAge: 0,
    };

    this.cookies = { ...this.cookies };
    delete this.cookies[name];

    if (this.HAS_DOCUMENT_COOKIE) {
      document.cookie = cookie.serialize(name, '', finalOptions);
    }

    this._emitChange({
      name,
      value: undefined,
      options: finalOptions,
    });
  }

  public addChangeListener(callback: CookieChangeListener): void {
    this.changeListeners.push(callback);
  }

  public removeChangeListener(callback: CookieChangeListener): void {
    const idx = this.changeListeners.indexOf(callback);

    if (idx >= 0) {
      this.changeListeners.splice(idx, 1);
    }
  }

  private _updateBrowserValues(parseOptions?: CookieParseOptions) {
    if (!this.HAS_DOCUMENT_COOKIE) {
      return;
    }

    this.cookies = cookie.parse(document.cookie, parseOptions);
  }

  private _emitChange(params: CookieChangeOptions) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.changeListeners.length; ++i) {
      this.changeListeners[i](params);
    }
  }
}

export const cookieService = new CookieService();
