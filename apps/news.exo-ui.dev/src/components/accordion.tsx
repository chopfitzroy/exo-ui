import { h as _ } from 'preact';

import { createMultiSelectListComponent } from "components";

const items = [{
  name: 'Header one',
  value: 'Description one'
}, {
  name: 'Header two',
  value: 'Description two'
}, {
  name: 'Header three',
  value: 'Description three'
}];

const { MultiSelectList } = createMultiSelectListComponent<typeof items>();

export const Accordion = () => {
  return (
    <MultiSelectList.Provider items={items} options={{
      initiallySelectedItemsIndexes: [0, 2]
    }}>
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
