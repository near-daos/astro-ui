import cn from 'classnames';
import 'cropperjs/dist/cropper.css';
import React, { useEffect, useRef, VFC } from 'react';
import { Cropper } from 'react-cropper';
import { useWindowSize } from 'react-use';
import styles from './create-flag.module.scss';

export type CreateFlagProps = {
  cropperRef: React.MutableRefObject<Cropper | undefined>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  dragMode?: boolean;
  src?: string | undefined;
  className?: string | undefined;
  preview?: string | undefined;
};

const FlagCropper: VFC<CreateFlagProps> = ({
  dragMode,
  preview,
  cropperRef,
  canvasRef,
  src,
  className
}) => {
  const { width, height } = useWindowSize();

  useEffect(() => {
    const cropper = cropperRef?.current;

    if (cropper != null) {
      const cropBoxData = cropper.getCropBoxData();

      cropper.reset();
      cropper.setCropBoxData(cropBoxData);
    }
  }, [width, height, cropperRef]);

  return (
    <>
      <Cropper
        responsive
        src={src}
        viewMode={1}
        autoCropArea={0.5}
        onInitialized={(instance: Cropper) => {
          // eslint-disable-next-line no-param-reassign
          cropperRef.current = instance;
        }}
        className={cn(styles.root, className)}
        scalable={false}
        zoomable={false}
        movable={dragMode}
        preview={preview}
        cropBoxResizable={false}
        toggleDragModeOnDblclick={false}
        modal={false}
        background={false}
        dragMode={dragMode ? 'move' : 'none'}
        aspectRatio={1}
        center={false}
        guides={false}
      />
      <canvas style={{ display: 'none' }} ref={canvasRef} />
    </>
  );
};

const maskShape = [
  new Path2D('M60 140.525L202.2 89.7052V201.181L60 252V140.525Z'),
  new Path2D('M97.8076 98.8197L240.007 48V159.475L97.8076 210.295V98.8197Z')
];

interface UseFlagCropperReturn {
  node: JSX.Element;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  cropperRef: React.MutableRefObject<Cropper | undefined>;
  crop: () => void;
}

export type UseFlagCropperParams = Omit<
  CreateFlagProps,
  'cropperRef' | 'canvasRef'
>;

export function useFlagCropper(
  args: UseFlagCropperParams
): UseFlagCropperReturn {
  const cropperRef = useRef<Cropper>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const node = (
    <FlagCropper {...args} cropperRef={cropperRef} canvasRef={canvasRef} />
  );

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

      ctx.fillStyle = 'white';
      maskShape.forEach(shape => ctx.fill(shape));

      ctx.globalCompositeOperation = 'source-in';

      ctx.drawImage(croppedCanvas, 0, 0, 300, 300);
    }
  };

  return {
    node,
    cropperRef,
    canvasRef,
    crop
  };
}
