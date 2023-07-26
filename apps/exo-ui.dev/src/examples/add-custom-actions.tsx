import { createSingleSelectListComponent } from "@vistas/exo-ui";

// @TODO
// - Move this to seperate file and import
const response = [
  {
    name: "Tom Hanks",
    rating: "Over 9000"
  },
  {
    name: "Tom Holland",
    rating: "Double Rainbow"
  }
];

const { SingleSelectList, useSingleSelectList } = createSingleSelectListComponent<typeof response>();

const Accordions = () => {
  const { hydratedItems } = useSingleSelectList();

  const customItems = hydratedItems.map(item => ({
    ...item,
    custom: {
      select: () => {
        // @NOTE
        // - Prevent user from closing open accordion
        if (item.metadata.isSelected) return;
        item.actions.select();
      }
    }
  }))

  return (
    <>
      {customItems.map(({ data, custom, metadata }) => (
        <div>
          <button onClick={custom.select}>{data.name}</button>
          {metadata.isSelected && <p>Is rated: {data.rating}</p>}
        </div>
      ))}
    </>
  )
}

export default function App() {
  return (
    <div className="App">
      <SingleSelectList.Provider items={response} options={{
        initiallySelectedItemIndex: 0
      }}>
        <p>Actor ratings:</p>
        <Accordions />
      </SingleSelectList.Provider>
    </div>
  );
}