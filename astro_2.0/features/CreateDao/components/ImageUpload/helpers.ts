import * as yup from 'yup';
import { getImgValidationError, validateImgSize } from 'utils/imageValidators';

const schema = yup.object().shape({
  value: yup.mixed().test('fileSize', getImgValidationError, validateImgSize),
});

export async function validateAsset(data: { value: FileList }): Promise<{
  values: Record<string, unknown> | null;
  errors: Record<string, { type: string; message: string }> | null;
}> {
  try {
    await schema.validate(data, {
      abortEarly: false,
    });

    return {
      values: { value: data.value },
      errors: null,
    };
  } catch (e) {
    return {
      values: null,
      errors: e.inner.reduce(
        (
          allErrors: Record<string, string>,
          currentError: { path: string; type?: string; message: string }
        ) => {
          return {
            ...allErrors,
            value: {
              type: currentError.type ?? 'validation',
              message: currentError.message,
            },
          };
        },
        {}
      ),
    };
  }
}
