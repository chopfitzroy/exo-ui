import { h as _ } from 'preact';

import { createMultiSelectListComponent } from "components";

const items = [{
  name: 'Header',
  value: 'Description'
}];

const { MultiSelectList } = createMultiSelectListComponent<typeof items>();

export const Accordion = () => {
  return (
    <MultiSelectList.Provider items={items}>
      <MultiSelectList.Map>
        {({ item, meta }) => (
          <div onClick={meta.onClick}>
            {item.name}
            {meta.isSelected && (
              <div>
                {item.value}
              </div>
            )}
          </div>
        )}
      </MultiSelectList.Map>
    </MultiSelectList.Provider>
  )
}
