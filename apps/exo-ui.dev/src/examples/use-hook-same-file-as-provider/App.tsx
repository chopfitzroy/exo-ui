import { createMultiSelectListComponent } from "@vistas/exo-ui";

// @TODO
// - Move this to seperate file and import
const response = [
  {
    name: 'Tomato',
    cost: 0.5,
  },
  {
    name: 'Lettuce',
    cost: 0.25,
  },
  {
    name: 'Cheese',
    cost: 1,
  },
  {
    name: 'Onions',
    cost: 0
  }
];

const { MultiSelectList, useMultiSelectList } = createMultiSelectListComponent<typeof response>();

const CondimentSelect = () => {
  const { hydratedItems, selectedItems } = useMultiSelectList();

  const totalCondiments = selectedItems.length;
  const isMaxCondiments = totalCondiments === 3;

  const totalAdditionalCost = selectedItems.reduce((sum, item) => sum + item.data.cost, 0);

  return (
    <>
      <p>Cost: {totalAdditionalCost}</p>
      {isMaxCondiments && <p>You have reached the maximum number of condiments, please remove existing condiment if you would like to select something else.</p>}
      {hydratedItems.map(({ data, actions, metadata }) => (
        <div key={metadata.index} style={metadata.isSelected ? { border: '2px solid green'} : { border: '2px solid grey' }}>
          <button disabled={isMaxCondiments && !metadata.isSelected } onClick={actions.select}>{data.name}</button>
        </div>
      ))}
    </>
  )
}

export default function App() {
  return (
    <div className="App">
      <MultiSelectList.Provider items={response}>
        <p>Actor ratings:</p>
        <CondimentSelect />
      </MultiSelectList.Provider>
    </div>
  );
}