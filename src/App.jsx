

import { useState } from "react";


import Display from "./Display";
import Label from "./Label";
import Pad from "./Pad";
import Sticker from "./Sticker";



function App() {

  // Store the input and output data.
  const [overView, setOverView] = useState('');
  const [liveIO, setLiveIO] = useState(0);


  // Function: setting 'calculation' state.
  const showIO = (data) => {
    setLiveIO(data);
  };
  // Function: setting 'input' state.
  const showOverView = (data) => {
    setOverView(data);
  }


  return (
    <>
    <main>
      <Label />
      <Display 
        row1={overView}
        row2={liveIO}
      />
      <Pad 
        showIO={showIO}
        showOverView={showOverView}
      />
      <Sticker />
    </main>
    {/* { window.console.count('<App/>') } */}
    </>
  )
}


export default App
