import { createSingleSelectListComponent } from '@vistas/exo-ui';

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const { SingleSelectList } = createSingleSelectListComponent<typeof list>();

export default () => (
  <SingleSelectList.Provider items={list} options={{
    initiallySelectedItemIndex: 0
  }}>
    <SingleSelectList.Values>
      {({ hydratedItems }) => (
        <div className="flex items-center justify-center p-4">
          {hydratedItems.map(({ data, actions, metadata }) => (
            <button onClick={actions.select} className={`mx-2 ${metadata.isSelected ? 'text-red-500' : 'text-blue-500'}`}>
              {data}
            </button>
          ))}
        </div>
      )}
    </SingleSelectList.Values>
  </SingleSelectList.Provider>
)
