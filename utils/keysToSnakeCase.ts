/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import snakeCase from 'lodash/snakeCase';
import isPlainObject from 'lodash/isPlainObject';

export function keysToSnakeCase(obj: any): any {
  if (isPlainObject(obj)) {
    const newObj = {} as any;

    Object.keys(obj).forEach(key => {
      newObj[snakeCase(key)] = keysToSnakeCase(get(obj, key));
    });

    return newObj;
  }

  if (isArray(obj)) {
    return obj.map(index => {
      return keysToSnakeCase(index);
    });
  }

  return obj;
}
