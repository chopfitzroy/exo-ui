import {SettingsModal, useSettingsModal} from './Provider';

function Modal() {
  const {} = useSettingsModal();
  return <p>I am the modal</p>;
}

export default function App() {
  return (
    <SettingsModal.Provider>
      <Modal />
    </SettingsModal.Provider>
  )
}