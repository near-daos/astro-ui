import { useMountedState } from 'react-use';
import { useEffect, useState } from 'react';

export function useIsValidImage(image: string): boolean {
  const [valid, setValid] = useState(false);
  const isMounted = useMountedState();

  useEffect(() => {
    if (!image) {
      return;
    }

    const img = new Image();

    img.onload = () => {
      if (isMounted()) {
        setValid(true);
      }
    };

    img.src = image;
  }, [image, isMounted]);

  return valid;
}
