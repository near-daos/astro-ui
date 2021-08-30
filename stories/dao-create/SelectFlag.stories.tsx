import { Meta, Story } from '@storybook/react';
import { Button } from 'components/button/Button';
import {
  SelectFlag,
  SelectFlagProps
} from 'features/create-dao/components/select-flag/SelectFlag';

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

export const Template: Story<SelectFlagProps> = (args): JSX.Element => {
  const [imgData, setImgData] = useState<string | undefined>();

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
      <div className="cropper-container">
        <SelectFlag id="flag" {...args} onSubmit={data => setImgData(data)} />
      </div>

      <div>
        <Button type="submit" form="flag" size="medium">
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
  sources: ['/flags/flag-1.svg']
};
