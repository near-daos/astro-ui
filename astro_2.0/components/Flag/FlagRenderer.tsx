import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import styles from './FlagRenderer.module.scss';

interface FlagRendererProps {
  flag: string | undefined;
  logo?: string | undefined;
  size: 'xs' | 'sm' | 'lg';
}

function isSafariBrowser(): boolean {
  return (
    navigator &&
    navigator.userAgent.indexOf('Safari') !== -1 &&
    navigator.userAgent.indexOf('Chrome') === -1
  );
}

export const FlagRenderer: FC<FlagRendererProps> = ({ flag, logo, size }) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const wrapperRef = useRef<HTMLDivElement>();

  function getImageDimensions(flagSize: string) {
    switch (flagSize) {
      case 'lg': {
        return [238, 272];
      }
      case 'sm': {
        return [68, 78];
      }
      case 'xs': {
        return [47, 53];
      }
      default: {
        return [238, 272];
      }
    }
  }

  function getImagePathId(flagSize: string) {
    switch (flagSize) {
      case 'lg': {
        return '_ASTRO_flag';
      }
      case 'sm': {
        return '_ASTRO_flagMinimized';
      }
      case 'xs': {
        return '_ASTRO_flagXS';
      }
      default: {
        return '_ASTRO_flag';
      }
    }
  }

  const imageDimensions = useMemo(() => getImageDimensions(size), [size]);

  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    if (!flag) return;

    const img = new Image();

    if (isSafariBrowser()) {
      img.crossOrigin = 'Anonymous';
    }

    img.onload = () => {
      setImage(img);
    };

    img.src = flag;
  }, [flag]);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;

      if (!canvas) return;

      const [width, height] = imageDimensions;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      const scale = canvas.height / image.height;

      ctx?.drawImage(
        image,
        0, // sx
        0, // sy
        image.width, // sWidth
        image.height, // sHeight
        0,
        0,
        image.width * scale,
        image.height * scale
      );
    }
  }, [image, imageDimensions]);

  if (!flag) return null;

  return (
    <div
      className={styles.root}
      ref={wrapperRef as React.LegacyRef<HTMLDivElement>}
    >
      <svg className="svg" width="0" height="0">
        <clipPath id="_ASTRO_flag">
          <path d="M240.01 0L50.4101 67.7595V105.35L0 123.366V272L189.599 204.24V166.65L240.01 148.634V0Z" />
        </clipPath>
        <clipPath id="_ASTRO_flagMinimized">
          <path d="M68.8249 0L14.4555 19.4307V30.2124L0 35.3785V78.0007L54.3694 58.57V47.7883L68.8249 42.6222V0Z" />
        </clipPath>
        <clipPath id="_ASTRO_flagXS">
          <path d="M46.4118 0L9.74793 13.103V20.3722L0 23.856V52.5981L36.6639 39.4951V32.2259L46.4118 28.7421V0Z" />
        </clipPath>
      </svg>
      {size === 'lg' && <div className={styles.background} />}
      {size === 'sm' && <div className={styles.backgroundSmall} />}
      {size === 'xs' && <div className={styles.backgroundXS} />}
      <canvas
        ref={canvasRef as React.LegacyRef<HTMLCanvasElement>}
        style={{
          clipPath: `url(#${getImagePathId(size)})`,
        }}
      />
      {logo && size === 'lg' && (
        <div
          className={styles.logo}
          style={{ backgroundImage: `url(${logo})` }}
        />
      )}
    </div>
  );
};
