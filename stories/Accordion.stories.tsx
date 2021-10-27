import { Meta } from '@storybook/react';
import { IconButton } from 'components/button/IconButton';
import { Collapsable } from 'components/collapsable/Collapsable';
import { useAccordion } from 'hooks/useAccordion';
import React from 'react';

export default {
  title: 'Components/Accordion',
} as Meta;

const dummyContent = (
  <p>
    Rich in mystery Vangelis rich in heavy atoms circumnavigated how far away
    kindling the energy hidden in matter. Ship of the imagination consectetur
    the only home we have ever known courage of our questions vel illum qui
    dolorem eum fugiat quo voluptas nulla pariatur muse about. Sea of
    Tranquility across the centuries qui dolorem ipsum quia dolor sit amet two
    ghostly white figures in coveralls and helmets are softly dancing sed quia
    consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt the
    only home we have ever known and billions upon billions upon billions upon
    billions upon billions upon billions upon billions.
  </p>
);

const items = [
  {
    id: 'test-1',
    label: 'Test Label 1',
    content: dummyContent,
  },
  {
    id: 'test-2',
    label: 'Test Label 2',
    content: dummyContent,
  },
  {
    id: 'test-3',
    label: 'Test Label 3',
    content: dummyContent,
  },
  {
    id: 'test-4',
    label: 'Test Label 4',
    content: dummyContent,
  },
];

const Header: React.FC<{
  label: string;
  isOpen: boolean;
  toggle: () => void;
}> = ({ isOpen, label, toggle }) => {
  return (
    <section
      tabIndex={-1}
      role="button"
      onClick={() => toggle()}
      onKeyDown={e => e.key === 'Spacebar' && toggle()}
      className="header"
    >
      <style jsx>{`
        .header {
          cursor: pointer;
        }
      `}</style>
      {label}
      <IconButton
        iconProps={{
          style: {
            transform: isOpen ? undefined : 'rotate(-90deg)',
            transition: 'all 100ms',
            marginBottom: '5px',
          },
        }}
        icon="buttonArrowDown"
        size="medium"
        type="button"
      />
    </section>
  );
};

type TemplateParams = {
  allowMultiSelect: false;
  allowUnSelect: false;
};

export const Template = (args: TemplateParams): JSX.Element => {
  const { getItemProps } = useAccordion(args);

  return (
    <div className="accordion">
      <style jsx>{`
        .accordion {
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {items.map(({ id, label, content }) => {
        return (
          <Collapsable
            key={id}
            {...getItemProps(id)}
            renderHeading={(toggle, isOpen) => (
              <Header label={label} isOpen={isOpen} toggle={toggle} />
            )}
          >
            {content}
          </Collapsable>
        );
      })}
    </div>
  );
};

Template.storyName = 'Accordion';
Template.args = {
  allowMultiSelect: false,
  allowUnSelect: true,
};
