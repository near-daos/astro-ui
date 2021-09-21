import React, { FC, useState } from 'react';
import Image from 'next/image';

type ImageWithFallbackProps = {
  fallbackSrc: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const ImageWithFallback: FC<ImageWithFallbackProps> = props => {
  const { src, fallbackSrc, width, height, alt } = props;
  const [imgSrc, setImgSrc] = useState<string>(src);

  return (
    <Image
      alt={alt}
      width={width}
      height={height}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};
