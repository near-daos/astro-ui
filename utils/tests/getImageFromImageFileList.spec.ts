import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

describe('get image from image file list', () => {
  beforeAll(() => {
    window.URL.createObjectURL = jest.fn().mockImplementation((file: File) => {
      return new Promise(resolve => {
        const reader = new FileReader();

        reader.addEventListener(
          'load',
          () => {
            resolve(reader.result);
          },
          false
        );

        reader.readAsText(file);
      });
    });
  });

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.URL.createObjectURL.mockRestore();
  });

  it('Should return empty string if file list is empty', () => {
    expect(getImageFromImageFileList([] as unknown as FileList)).toStrictEqual(
      ''
    );
  });

  it('Should get content if file provided', () => {
    const content = 'Hello World!';

    const blob = new Blob([content]);
    const file = new File([blob], 'data.txt', { type: 'text/plain' });

    expect(
      getImageFromImageFileList([file] as unknown as FileList)
    ).resolves.toStrictEqual(content);
  });
});
