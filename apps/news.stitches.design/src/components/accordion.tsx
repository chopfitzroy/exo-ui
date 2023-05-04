import { h as _ } from 'preact';

import { Accordion as HeadlessAccordion } from 'components';

const items = [{
  name: 'Header',
  value: 'Description'
}];

export const Accordion = () => {
  return (
    <HeadlessAccordion items={items}>
      {({ item, meta }) => (
        <div onClick={meta.onClick}>
          {item.name}
          {meta.active && (
            <div>
              {item.value}
            </div>
          )}
        </div>
      )}
    </HeadlessAccordion>
  )
}
