import { ReactNode, useState } from 'react';

interface AccordionOptions {
  closeAllOthersOnExpand: boolean;  
}

interface ChildrenProps<T> {
  item: T,
  meta: {
    index: number;
    active: boolean;
    isLast: boolean;
    isFirst: boolean;
    onClick: () => void;
  }
}

interface AccordionProps <T>{
  items: T[];
  children: (props: ChildrenProps<T>) => ReactNode;
  options?: AccordionOptions;
}

const defaultAccordionOptions = {
  closeAllOthersOnExpand: false
}

export const Accordion = <T = never>({ items, children, options = defaultAccordionOptions }: AccordionProps<T>) => {
  const [activeAccordions, setActiveAccordions] = useState<number[]>([]);

  const hydrated = items.map((item, index, payload) => {
    const active = activeAccordions.includes(index);
    const isLast = payload.length === index + 1;
    const isFirst = index === 0;

    const onClick = () => setActiveAccordions(current => {      
      const exists = current.includes(index);
      
      if (options.closeAllOthersOnExpand) {
        return exists ? [] : [index];
      }

      const filtered = current.filter(item => item !== index);

      return exists ? filtered : [...filtered, index];
    });

    const meta = {
      index,
      active,
      isLast,
      isFirst,
      onClick,
    }

    return {
      item,
      meta
    }
  });

  return <>{hydrated.map(item => children(item))}</>;
}