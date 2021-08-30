import { IconButton } from 'components/button/IconButton';
import { FlagCropper } from 'components/create-flag/FlagCropper';
import React, { FC, useRef, useState } from 'react';
import { Cropper } from 'react-cropper';
import { useMedia } from 'react-use';
import selectFlagStyles from './select-flag.module.scss';

export interface SelectFlagProps {
  id?: string;
  sources: string[];
  onSubmit?: (dataUrl: string) => void;
  className?: string | undefined;
}

export const SelectFlag: FC<SelectFlagProps> = ({
  sources,
  id,
  className,
  onSubmit
}) => {
  const [currentSource, setCurrentSource] = useState(0);
  const cropperRef = useRef<Cropper>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useMedia('(max-width: 640px)');

  const changeBackground = () => {
    setCurrentSource(i => {
      const isLastSource = i === sources.length - 1;

      return isLastSource ? 0 : i + 1;
    });
  };

  const crop = () => {
    const croppedCanvas = cropperRef.current?.getCroppedCanvas({
      minHeight: 1024,
      minWidth: 1024,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    });

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx && croppedCanvas) {
      canvas.width = 300;
      canvas.height = 300;

      const maskShape = [
        new Path2D('M60 140.525L202.2 89.7052V201.181L60 252V140.525Z'),
        new Path2D(
          'M97.8076 98.8197L240.007 48V159.475L97.8076 210.295V98.8197Z'
        )
      ];

      ctx.fillStyle = 'white';
      maskShape.forEach(shape => ctx.fill(shape));

      ctx.globalCompositeOperation = 'source-in';

      ctx.drawImage(croppedCanvas, 0, 0, 300, 300);

      return canvas.toDataURL('image/png');
    }

    return null;
  };

  const handleSumbit = (callback?: (dataURL: string) => void) => {
    const data = crop();

    if (data != null) callback?.(data);
  };

  return (
    <div className={selectFlagStyles.root}>
      <div className={selectFlagStyles.actions}>
        <IconButton
          disabled
          onClick={() => setCurrentSource(i => i - 1)}
          size="medium"
          icon="navBack"
        />
        <IconButton
          onClick={changeBackground}
          size="medium"
          icon="navRefresh"
        />
        <IconButton disabled size="medium" icon="navForward" />
      </div>
      <form
        className={className}
        id={id}
        onSubmit={e => {
          e.preventDefault();
          handleSumbit(onSubmit);
        }}
      >
        <FlagCropper
          dragMode={isMobile}
          src={sources[currentSource]}
          cropperRef={cropperRef}
          canvasRef={canvasRef}
        />
      </form>
    </div>
  );
};
