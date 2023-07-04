import { h as _ } from 'preact';

import { createToggleComponent } from "components";

const { Toggle } = createToggleComponent<typeof modal>();

const modal = {
  title: 'This is the title',
  body: 'This is the body content',
  footer: 'This is the footer content',
};

export const Modal = () => {
  return (
    <Toggle.Provider item={modal}>
      <div>
        <Toggle.Values>
          {({ hydratedItem }) => (
            <>
              {hydratedItem.metadata.isEnabled && (
                <div>
                  <p>{hydratedItem.data.title}</p>
                  <p>{hydratedItem.data.body}</p>
                  <p>{hydratedItem.data.footer}</p>
                </div>
              )}
            </>
          )}
        </Toggle.Values>
        <div>
          <p>Body content</p>
          <Toggle.Values>
            {({ toggle }) => (
              <button onClick={toggle}>Toggle Modal</button>
            )}
          </Toggle.Values>
        </div>
      </div>
    </Toggle.Provider>
  )
}
