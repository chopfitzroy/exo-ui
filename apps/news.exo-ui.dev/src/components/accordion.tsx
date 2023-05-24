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
        {({ data, actions, metadata }) => (
          <div onClick={actions.select}>
            {data.name}
            {metadata.isSelected && (
              <div>
                {data.value}
              </div>
            )}
          </div>
        )}
      </MultiSelectList.Map>
    </MultiSelectList.Provider>
  )
}
