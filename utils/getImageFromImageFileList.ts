import get from 'lodash/get';

export function getImageFromImageFileList(imgFileList: FileList): string {
  if (imgFileList?.length) {
    const img = get(imgFileList, '0');

    return URL.createObjectURL(img);
  }

  return '';
}
