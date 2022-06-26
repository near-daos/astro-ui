/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import camelCase from 'lodash/camelCase';
import isPlainObject from 'lodash/isPlainObject';

export function keysToCamelCase(obj: any): any {
  if (isPlainObject(obj)) {
    const newObj = {} as any;

    Object.keys(obj).forEach(key => {
      newObj[camelCase(key)] = keysToCamelCase(get(obj, key));
    });

    return newObj;
  }

  if (isArray(obj)) {
    return obj.map(index => {
      return keysToCamelCase(index);
    });
  }

  return obj;
}
