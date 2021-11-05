import cn from 'classnames';
import styles from 'components/create-flag/create-flag.module.scss';
import 'cropperjs/dist/cropper.css';
import React, { useEffect, VFC } from 'react';
import { Cropper, ReactCropperProps } from 'react-cropper';
import { useWindowSize } from 'react-use';

export interface CreateFlagProps
  extends Omit<ReactCropperProps, 'dragMode' | 'onInitialized'> {
  cropperRef: React.MutableRefObject<Cropper | undefined>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  dragMode?: boolean;
  src: string | undefined;
  className?: string | undefined;
  preview?: string | undefined;
}

export const FlagCropper: VFC<CreateFlagProps> = ({
  dragMode,
  preview,
  cropperRef,
  canvasRef,
  src,
  className,
  ...cropperProps
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
    <div className={styles.wrapper}>
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
        cropBoxMovable={!dragMode}
        cropBoxResizable={false}
        toggleDragModeOnDblclick={false}
        modal={false}
        background={false}
        dragMode={dragMode ? 'move' : 'none'}
        aspectRatio={1}
        center={false}
        guides={false}
        {...cropperProps}
      />
      <canvas style={{ display: 'none' }} ref={canvasRef} />
    </div>
  );
};
