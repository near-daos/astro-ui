import Image, { ImageProps } from 'next/image';
import React, { useState, VFC } from 'react';

interface ImageWithFallbackProps {
  fallbackSrc: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  loading?: ImageProps['loading'];
}

export const ImageWithFallback: VFC<ImageWithFallbackProps> = ({
  alt,
  fallbackSrc,
  height,
  loading,
  src,
  width,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);

  return (
    <Image
      alt={alt}
      width={width}
      height={height}
      src={imgSrc}
      loading={loading}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};
