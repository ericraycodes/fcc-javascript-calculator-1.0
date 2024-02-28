

import { useState } from "react";


import Display from "./Display";
import Label from "./Label";
import Pad from "./Pad";
import Sticker from "./Sticker";



function App() {

  // Store the input and output data.
  const [input, setInput] = useState('temporary input');
  const [calculation, setCalculation] = useState('temporary output');


  // Function: setting 'calculation' state.
  const showCalculation = (data) => {
    setCalculation(data);
    window.console.log('\tstoring calculation...');
  };
  // Function: setting 'input' state.
  const showInput = (data) => {
    setInput(data);
    window.console.log('>> USER:', data);
  }


  return (
    <>
    <main>
      <Label />
      <Display 
        input={input}
        calculation={calculation}
      />
      <Pad 
        showInput={showInput}
        showCalculation={showCalculation}
      />
      <Sticker />
    </main>
    { window.console.count('<App/>') }
    </>
  )
}


export default App
