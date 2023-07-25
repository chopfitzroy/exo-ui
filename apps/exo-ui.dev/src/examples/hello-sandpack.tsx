import { createSingleSelectListComponent } from "@junket/components";

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

const { SingleSelectList } = createSingleSelectListComponent<typeof response>();

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <SingleSelectList.Provider items={response}>
        <p>Accordions</p>
        <SingleSelectList.Map>
          {({ data, actions, metadata }) => (
            <div>
              <button onClick={actions.select}>{data.name}</button>
              {metadata.isSelected && <p>Is rated: {data.rating}</p>}
            </div>
          )}
        </SingleSelectList.Map>
      </SingleSelectList.Provider>
    </div>
  );
}