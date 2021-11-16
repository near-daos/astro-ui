import get from 'lodash/get';
import { MessageParams } from 'yup/es/types';

function getImageSize(fileList?: FileList) {
  const size = get(fileList, '0.size') || 0;

  return size;
}

export function requiredImg(fileList?: FileList): boolean {
  return !!fileList?.length;
}

export function validateImgSize(fileList?: FileList): boolean {
  const BYTES_IN_KB = 1024;
  const MAX_IMG_SIZE_IN_KB = 200;

  const size = getImageSize(fileList);

  return size / BYTES_IN_KB <= MAX_IMG_SIZE_IN_KB;
}

export function getImgValidationError(params: MessageParams): string {
  const size = getImageSize(params?.value);

  return `Image size can not exceed 200kb. Current size is ${size} bytes.`;
}
