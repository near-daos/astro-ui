import { useMedia } from 'react-use';

export function useDeviceType(): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const isMobile = useMedia('(max-width: 640px) and (orientation: portrait)');
  const isTablet = useMedia('(max-width: 768px) and (orientation: portrait)');
  const isDesktop = useMedia('(min-width: 769px)');

  return {
    isMobile,
    isDesktop,
    isTablet,
  };
}
