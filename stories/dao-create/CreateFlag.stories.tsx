import { Meta, Story } from '@storybook/react';
import { Button } from 'components/button/Button';
import {
  useFlagCropper,
  UseFlagCropperParams
} from 'features/create-dao/components/create-flag/FlagCropper';
import React, { useState } from 'react';

export default {
  title: 'Features/DAO Create/Dao Create Flag',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'bg',
      values: [
        {
          name: 'bg',
          value: '#E8E0FF'
        }
      ]
    }
  }
} as Meta;

export const Template: Story<UseFlagCropperParams> = (args): JSX.Element => {
  const [imgData, setImgData] = useState<string | undefined>();

  const { node, crop, canvasRef } = useFlagCropper({
    ...args
  });

  const handleCrop = () => {
    crop();
    setImgData(canvasRef.current?.toDataURL('image/png'));
  };

  return (
    <div className="root">
      <style jsx>{`
        .root {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 24px;
          height: 100%;
          width: 100%;
        }

        .cropper-container {
          width: 60%;
          flex-basis: 60%;
        }

        .images-container {
          height: 300px;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        #mask-test {
          width: 300px;
          height: 300px;
          outline: 1px solid lightslategray;
        }
      `}</style>
      <div className="cropper-container">{node}</div>
      <div>
        <Button size="medium" onClick={handleCrop}>
          Crop!
        </Button>
      </div>

      <div className="images-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {imgData && <img alt="Result" width={300} height={300} src={imgData} />}
      </div>
    </div>
  );
};

Template.storyName = 'Dao Create Flag';

Template.args = {
  src: '/flags/flag-1.svg',
  dragMode: false
};
