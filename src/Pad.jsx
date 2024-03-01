

import { useRef } from "react";
import { useEffect } from "react"
import calc from "./calc";




export default function Pad({ showIO, showExpression }) {

  // Reference to the section.
  const padRef = useRef(null);
  // Store the whole arithmetic mathematical expression
  const expRef = useRef([]);
  // Store valid numerical input
  const inputRef = useRef({ input: '', isNumber: false });


  // Attach a delegated event listener to the component.
  useEffect(() => {
    padRef.current.addEventListener('mouseup', onMouseUp);
    return () => padRef.current.removeEventListener('mouseup', onMouseUp);
  }, []);


  // Callback: onMouseUp
  const onMouseUp = (event) => {
    window.console.log(event.target);

    // capture the mouse-event input
    const input = event.target.innerText;

    // #clear input
    if (input === 'AC') {
      showIO(0);
      showExpression('');
      inputRef.current.input = '';
      inputRef.current.isNumber = false;
      window.console.clear();
      window.console.log('>> AC: clear');
    } 
    // #equals input
    else if (/\=/.test(input)) {
      window.console.log('\t#equals');
      const expression = expRef.current.join(' ');
      window.console.log('\texpRef:', expRef, expression);
      showExpression(expression);
    }
    // numeric input
    else if (/[0-9.]/.test(input) || (input==='-' && inputRef.current.input==='')) {
      inputRef.current.isNumber = true;
      const validInput = calc.validateNumericInput(input, inputRef.current);
      showIO(validInput);
    }
    // operator input
    else if (/[+-X/]/.test(input) && inputRef.current.input!=='') {
      window.console.log('\toperator');
    }
  };


  return (
    <>
    <section className='pad' ref={padRef}>
      <button id='clear'  >AC</button>
      <button id='equals' >&#61;</button>
      <div className='digits'>
        <button id='zero'   >0</button>
        <button id='one'    >1</button>
        <button id='two'    >2</button>
        <button id='three'  >3</button>
        <button id='four'   >4</button>
        <button id='five'   >5</button>
        <button id='six'    >6</button>
        <button id='seven'  >7</button>
        <button id='eight'  >8</button>
        <button id='nine'   >9</button>
        <button id='decimal'>&#46;</button>
      </div>
      <div className='operators'>
        <button id='add'        >&#43;</button>
        <button id='subtract'   >&#45;</button>
        <button id='multiply'   >X</button>
        <button id='divide'     >&#47;</button>
      </div>
    </section>
    {/* { window.console.count('<Pad/>') } */}
    </>
  )
}
