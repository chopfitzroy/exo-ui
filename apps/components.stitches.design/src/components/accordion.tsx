import { h } from 'preact';

import { Accordion as HeadlessAccordion } from 'components';

export const Accordion = () => {
  const items = [{
    name: 'Item One',
    value: 1
  }]

  return (
    <HeadlessAccordion items={items}>
      {({ item, meta }) => (
        <div>
          {item.name}
        </div>
      )}
    </HeadlessAccordion>
  )
}
