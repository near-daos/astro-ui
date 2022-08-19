import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useIntercomAdjust(): void {
  const router = useRouter();
  const [adjusted, setAdjusted] = useState(false);

  useEffect(() => {
    // workaround to align intercom button
    if (!adjusted) {
      const intercom: HTMLElement | null =
        document.querySelector('.intercom-launcher');

      if (intercom) {
        intercom.style.bottom = '75px';

        setAdjusted(true);
      }
    }
  }, [adjusted, router.pathname]);
}
