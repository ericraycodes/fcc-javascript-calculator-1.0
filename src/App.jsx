

import Display from "./Display";
import Label from "./Label";
import Pad from "./Pad";
import Sticker from "./Sticker";



function App() {

  return (
    <>
    <main>
      <Label />
      <Display />
      <Pad />
      <Sticker />
    </main>
    { window.console.count('<App/>') }
    </>
  )
}


export default App
