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

interface SelectFlagState {
  background: number;
  cropData: Cropper.CropBoxData;
}

export const SelectFlag: FC<SelectFlagProps> = ({
  sources,
  id,
  className,
  onSubmit
}) => {
  const cropperRef = useRef<Cropper>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useMedia('(max-width: 640px)');
  const [historyData, setHistoryData] = useState<{
    currentIndex: number;
    stack: SelectFlagState[];
  }>({
    currentIndex: 0,
    stack: [
      {
        background: 0,
        cropData: {
          left: 400,
          top: 150,
          width: 300,
          height: 300
        }
      }
    ]
  });

  const saveState = (newBackground: number | undefined = undefined) => {
    const cropper = cropperRef.current;

    if (cropper != null) {
      setHistoryData(({ currentIndex, stack }) => {
        const newItem = {
          background: newBackground || stack[currentIndex].background,
          cropData: cropper.getCropBoxData()
        };

        const slice = stack.slice(0, currentIndex + 1);
        const newValue = [...slice, newItem];

        return {
          currentIndex: newValue.length - 1,
          stack: newValue
        };
      });
    }
  };

  const undo = () => {
    if (historyData.currentIndex === 0) return;

    const selectFlagState = historyData.stack[historyData.currentIndex - 1];

    cropperRef.current?.setCropBoxData(selectFlagState.cropData);
    setHistoryData(({ currentIndex, stack }) => ({
      currentIndex: currentIndex - 1,
      stack
    }));
  };

  const redo = () => {
    if (historyData.currentIndex >= historyData.stack.length - 1) return;

    const selectFlagState = historyData.stack[historyData.currentIndex + 1];

    cropperRef.current?.setCropBoxData(selectFlagState.cropData);
    setHistoryData(({ currentIndex, stack }) => ({
      currentIndex: currentIndex + 1,
      stack
    }));
  };

  const currentBackgroundIndex =
    sources[historyData.stack[historyData.currentIndex].background];

  const shiftBackground = () => {
    const selectFlagState = historyData.stack[historyData.currentIndex];
    const i = selectFlagState.background;
    const isLastSource = i === sources.length - 1;

    saveState(isLastSource ? 0 : i + 1);
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
          disabled={historyData.currentIndex === 0}
          onClick={undo}
          size="medium"
          icon="navBack"
        />
        <IconButton onClick={shiftBackground} size="medium" icon="navRefresh" />
        <IconButton
          onClick={redo}
          disabled={historyData.currentIndex === historyData.stack.length - 1}
          size="medium"
          icon="navForward"
        />
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
          cropend={() => saveState()}
          dragMode={isMobile}
          src={currentBackgroundIndex}
          cropperRef={cropperRef}
          canvasRef={canvasRef}
        />
      </form>
    </div>
  );
};
