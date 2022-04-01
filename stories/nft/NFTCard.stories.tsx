import { Meta, Story } from '@storybook/react';
import { NFTCard } from 'astro_2.0/features/pages/nft/NtfCard';
import React, { FC } from 'react';
import { StaticImageData } from 'next/image';
import example1 from './assets/example-1.png';
import example2 from './assets/example-2.png';
import example3 from './assets/example-3.png';
import example4 from './assets/example-4.png';
import example5 from './assets/example-5.png';
import example6 from './assets/example-6.png';
import example7 from './assets/example-7.png';

export default {
  title: 'Features/NFT/NFTCard',
} as Meta;

const Demo: FC<{ cards: StaticImageData[] }> = ({ cards }) => {
  return (
    <div className="root">
      <style jsx>{`
        .root {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
      `}</style>
      {cards.map(img => {
        return (
          <NFTCard
            key={img.src}
            image={[{ uri: img.src, isExternalReference: false }]}
            contractId="vhorin.sputnikv2.testnet"
            tokenId="1"
          />
        );
      })}
    </div>
  );
};

export const Template: Story<{ cards: StaticImageData[] }> = (
  args
): JSX.Element => <Demo {...args} />;

Template.storyName = 'NFTCard';

Template.args = {
  cards: [example1, example2, example3, example4, example5, example6, example7],
};
