export function getImageFromImageFile(img: File): string {
  if (img) {
    return URL.createObjectURL(img);
  }

  return '';
}
