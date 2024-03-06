

import { useState, useRef } from "react";
import Display from "./Display";
import Label from "./Label";
import Pad from "./Pad";
import Sticker from "./Sticker";
import calc from "./calc";


function App() {

  // Display state
  const [display, setDisplay] = useState({
    "row1" : '',
    "row2" : ''
  });
  // Store calculator's input data. This will not change between renders.
  const calculatorData = useRef({
    "key" : {
      "char" : '',
      "type" : null
    },

    "role" : {
      "str"       : '',
      "type"      : null,
      "isValid"   : false,
      "doCollect" : false
    },

    "expression" : {
      "str" : '',
      "arr" : [],
    },

    "result" : {
      "operatorIndex" : null,
      "answer"        : null,
      "isSimplified"  : false
    },

    "doClear" : false
  });


  // Function: collecting the mouse input.
  const collectMouseInput = (data) => {
    calcData.current.key.char = data;

    // Run calculator
    calc.run(calculatorData);

    setDisplay({
      "row1" : '',
      "row2" : ''
    });
  };



  return (
    <>
    <main>
      <Label />
      <Display display={display} />
      <Pad callback={collectMouseInput} />
      <Sticker />
    </main>
    {/* { window.console.count('<App/>') } */}
    </>
  )
}


export default App
