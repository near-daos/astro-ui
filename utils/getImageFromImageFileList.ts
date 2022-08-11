import get from 'lodash/get';

export function getImageFromImageFileList(
  imgFileList: FileList | string
): string {
  if (typeof imgFileList === 'string') {
    return imgFileList;
  }

  if (imgFileList?.length) {
    const img = get(imgFileList, '0');

    return URL.createObjectURL(img);
  }

  return '';
}
