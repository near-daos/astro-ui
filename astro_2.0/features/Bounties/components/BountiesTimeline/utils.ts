function hslToHex(hue: number, sat: number, lig: number) {
  const l = lig / 100;

  const a = (sat * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generateHslaColors(
  saturation: number,
  lightness: number,
  alpha: number,
  amount: number
): string[] {
  const colors: string[] = [];
  const huedelta = Math.trunc(360 / amount);

  for (let i = 0; i < amount; i += 1) {
    const hue = i * huedelta;

    colors.push(hslToHex(hue, saturation, lightness));
  }

  return colors;
}
