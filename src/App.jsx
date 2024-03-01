

import { useState } from "react";


import Display from "./Display";
import Label from "./Label";
import Pad from "./Pad";
import Sticker from "./Sticker";



function App() {

  // Store the input and output data.
  const [expression, setExpression] = useState('');
  const [liveIO, setLiveIO] = useState(0);


  // Function: setting 'calculation' state.
  const showIO = (data) => {
    setLiveIO(data);
  };
  // Function: setting 'input' state.
  const showExpression = (data) => {
    setExpression(data);
    window.console.log('state | expression:', data);
  }


  return (
    <>
    <main>
      <Label />
      <Display 
        row1={expression}
        row2={liveIO}
      />
      <Pad 
        showIO={showIO}
        showExpression={showExpression}
      />
      <Sticker />
    </main>
    {/* { window.console.count('<App/>') } */}
    </>
  )
}


export default App
