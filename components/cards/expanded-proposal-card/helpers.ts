import { parseISO, differenceInMilliseconds } from 'date-fns';
import { useEffect } from 'react';
import useCountDown from 'react-countdown-hook';

function formatCountdown(seconds: number) {
  const d = Math.floor(seconds / (24 * 3600));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds - h * 3600) / 60);
  const s = Math.floor(seconds - h * 3600 - m * 60);

  let res = '';

  if (d > 0) {
    res += `${d}d `;
  }

  if (h > 0) {
    res += `${h}h `;
  }

  if (m > 0) {
    res += `${m}m `;
  }

  if (s > 0) {
    res += `${s}s`;
  }

  return res;
}

export function useCountdown(endsAt: string): string | null {
  const start = new Date();
  const end = parseISO(endsAt);

  const diff = differenceInMilliseconds(end, start);

  const [timeLeft, actions] = useCountDown(diff);

  useEffect(() => {
    actions.start();
  }, [actions]);

  return timeLeft > 0 ? formatCountdown(timeLeft / 1000) : null;
}
