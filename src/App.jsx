

    import { useState, useRef } from "react";
    import Display from "./Display";
    import Label from "./Label";
    import Pad from "./Pad";
    import Sticker from "./Sticker";
    import runCalculator from "./calc";


    function App() {

      // Display state
      const [display, setDisplay] = useState({
        "row1" : '',
        "row2" : ''
      });
      // Store calculator's data. This will not change between renders.
      const DATA = useRef({
        "input" : {
          "value" : '',
          "type"  : null,
        },

        "component" : {
          "value" : '',
          "type"  : null,
        },

        "expression" : {
          "str" : '',
          "arr" : [],
        },

        "calculation" : {
          "result"  : null,
          "type"    : null,
        },

        "display" : {
          "row1" : '',
          "row2" : 0,
        }

      });


      // Function: collecting the mouse input.
      const collectMouseInput = (userInput) => {

        // Run calculator
        runCalculator(DATA, userInput);

        // Update display
        setDisplay({
          "row1" : DATA.current.display.row1,
          "row2" : DATA.current.display.row2,
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
