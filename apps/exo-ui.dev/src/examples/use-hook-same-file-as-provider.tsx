import { createSingleSelectListComponent } from "@vistas/exo-ui";

// @TODO
// - Move this to seperate file and import
const response = [
  {
    name: "Tom Hanks",
    rating: 100,
    details: "Truly brilliant",
  },
  {
    name: "Tom Holland",
    rating: 101,
    details: "A nation treasure",
  }
];

const { SingleSelectList, useSingleSelectList } = createSingleSelectListComponent<typeof response>();

const Accordions = () => {
  const { hydratedItems, selectedItem } = useSingleSelectList();

  const isRatingOver100 = Number(selectedItem?.data.rating) > 100;
  const titleStyle = isRatingOver100 ? {color: 'red'} : {color: 'blue'};

  return (
    <>
      <p style={titleStyle}>Rating: {selectedItem?.data.rating}</p>
      {hydratedItems.map(({ data, actions, metadata }) => (
        <div key={metadata.index}>
          <button onClick={actions.select}>{data.name}</button>
          {metadata.isSelected && <p>{data.details}</p>}
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