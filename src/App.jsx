

    import { useState, useRef } from "react";
    import Display from "./Display";
    import Label from "./Label";
    import Pad from "./Pad";
    import Sticker from "./Sticker";
    import runCalculator from "./calc";


    function App() {

      // Store the update of the math/aritmetic expression
      const [expression, setExpression] = useState([]);


      /** Callback: collecting the mouse input.
       */
      const collectMouseInput = (input) => {
        // console user-input count
        // window.console.count('USER-INPUT');
        //
        setExpression((prevState) => runCalculator([...prevState], input));
      };



      return (
        <>
        <main>
          <Label />
          <Display display={[...expression]} />
          <Pad callback={collectMouseInput} />
          <Sticker />
        </main>
        </>
      );
    }


    export default App;
