

import { useRef } from "react";
import { useEffect } from "react"
import calc from "./calc";
import calculator from "./calculator";



export default function Pad({ showIO, showOverView }) {

  // Reference to the section.
  const padRef = useRef(null);
  // Store input
  const inputRef = useRef('');
  // Store valid digits input
  const numRef = useRef('');


  // Attach a delegated event listener to the component.
  useEffect(() => {
    padRef.current.addEventListener('mouseup', onMouseUp);
    return () => padRef.current.removeEventListener('mouseup', onMouseUp);
  }, []);


  // Callback: onMouseUp
  const onMouseUp = (event) => {
    window.console.log(event);

    // capture the mouse-event input
    const input = event.target.innerText;

    // run according to input
    if (input === 'AC') {
      showIO(0);
      numRef.current = '';
      window.console.clear();
      window.console.log('>> AC: clear');
    } else {
      const validInput = calc.validate(input, numRef)
      showIO(validInput);
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
