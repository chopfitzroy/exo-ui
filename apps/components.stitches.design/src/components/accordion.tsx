import { h as _ } from 'preact';

import { faker } from '@faker-js/faker';
import { Accordion as HeadlessAccordion } from 'components';

const createAccordion = () => {
  return {
    id: faker.datatype.uuid(),
    name: faker.internet.userName(),
    value: faker.lorem.paragraph()
  };
}

const items = Array.from({ length: 10 }).map(createAccordion);

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
