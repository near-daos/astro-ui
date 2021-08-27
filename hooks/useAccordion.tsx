import { useList } from 'react-use';

interface UseAccordionParams {
  allowMultiSelect: boolean;
  allowUnSelect: boolean;
  preSelected?: string[];
}

interface ItemProps {
  isOpen: boolean;
  toggle: (nextValue?: boolean) => void;
}

interface UseAccordionReturnT {
  toggleItem: (id: string) => void;
  selected: string[];
  getItemProps: (id: string) => ItemProps;
}

const defaultOptions: UseAccordionParams = {
  allowMultiSelect: false,
  allowUnSelect: false
};

export function useAccordion(
  options: UseAccordionParams = defaultOptions
): UseAccordionReturnT {
  const { preSelected, allowUnSelect, allowMultiSelect } = options;

  const [selected, { push, set, filter, clear }] = useList<string>(preSelected);

  const toggleItem = (id: string) => {
    if (allowMultiSelect) {
      if (selected.includes(id)) {
        filter(item => item !== id);
      } else {
        push(id);
      }
    } else {
      const [currentItem] = selected;

      if (currentItem === id) {
        if (allowUnSelect) {
          clear();
        }
      } else {
        set([id]);
      }
    }
  };

  const getItemProps = (id: string): ItemProps => ({
    toggle: () => toggleItem(id),
    isOpen: selected.includes(id)
  });

  return {
    selected,
    toggleItem,
    getItemProps
  };
}
