import { useEffect } from 'react';
import { SputnikService } from 'services/SputnikService';

const Callback: React.FC = () => {
  useEffect(() => {
    if (window.opener && window.opener.sputnikRequestSignInCompleted) {
      SputnikService.init();
      window.opener?.sputnikRequestSignInCompleted();

      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      window.close();
    }
  }, []);

  return null;
};

export default Callback;
