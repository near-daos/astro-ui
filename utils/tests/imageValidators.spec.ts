import { MessageParams } from 'yup/es/types';

import {
  requiredImg,
  validateImgSize,
  getImgValidationError,
} from 'utils/imageValidators';

describe('image validators', () => {
  describe('requiredImg', () => {
    it('Should return false if FileList is empty', () => {
      const result = requiredImg([] as unknown as FileList);

      expect(result).toBeFalsy();
    });

    it('Should return true if FileList is not empty', () => {
      const result = requiredImg([1] as unknown as FileList);

      expect(result).toBeTruthy();
    });
  });

  describe('validateImgSize', () => {
    it('Should return true for files that are smaller than 204800 kB', () => {
      const fileList = [{ size: 20000 }];

      const result = validateImgSize(fileList as unknown as FileList);

      expect(result).toBeTruthy();
    });

    it('Should not return error if no file provided', () => {
      const result = validateImgSize([] as unknown as FileList);

      expect(result).toBeTruthy();
    });

    it('Should return false for files that are bigger than 204800 kB', () => {
      const fileList = [{ size: 2048000 }];

      const result = validateImgSize(fileList as unknown as FileList);

      expect(result).toBeFalsy();
    });
  });

  describe('getImgValidationError', () => {
    it('Should produce proper validation error', () => {
      const params = {
        value: [{ size: 2048000 }],
      };

      const message = getImgValidationError(params as MessageParams);

      expect(message).toBe(
        'Image size can not exceed 200kb. Current size is 2048000 bytes.'
      );
    });
  });
});
