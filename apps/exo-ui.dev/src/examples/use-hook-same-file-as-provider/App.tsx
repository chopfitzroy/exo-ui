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

  const totalAdditionalCost = selectedItems
    .reduce((sum, item) => sum + item.data.cost, 0)
   .toLocaleString("en",{ useGrouping: false, minimumFractionDigits: 2 });

  return (
    <>
      <div className="p-4">
        <p className="text-center">Cost: ${totalAdditionalCost}</p>
        {isMaxCondiments && <p className="text-center text-orange-800">You have reached the maximum number of condiments, please remove existing condiment if you would like to select something else.</p>}
      </div>
      <div className="flex items-center justify-center p-4">
        {hydratedItems.map(({ data, actions, metadata }) => (
          <button
            key={metadata.index}
            onClick={actions.select}
            disabled={isMaxCondiments && !metadata.isSelected}
            className={`py-2 px-4 mx-2 rounded-lg border-2 font-bold ${metadata.isSelected
              ? "text-green-800 bg-green-100 border-green-800"
              : "text-sky-800 bg-sky-100 border-sky-800"}`}>
            {data.name}
          </button>
        ))}
      </div>
    </>
  )
}

export default function App() {
  return (
    <div className="App">
      <MultiSelectList.Provider items={response}>
        <CondimentSelect />
      </MultiSelectList.Provider>
    </div>
  );
}