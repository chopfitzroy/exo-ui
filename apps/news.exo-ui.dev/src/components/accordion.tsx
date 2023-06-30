import { h as _ } from 'preact';

import { createSingleSelectListComponent } from "components";

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

const { SingleSelectList  } = createSingleSelectListComponent<typeof items>();

export const Accordion = () => {
  return (
    <SingleSelectList.Provider items={items} options={{
      onSelect: (item, index, array) => console.log({ item, index, array}),
      initiallySelectedItemIndex: 1
    }}>
      <SingleSelectList.Map>
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
      </SingleSelectList.Map>
    </SingleSelectList.Provider>
  )
}
