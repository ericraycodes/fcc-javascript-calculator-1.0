


export default function Pad() {

  return (
    <>
    <div>
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
    </div>
    { window.console.count('<Pad/>') }
    </>
  )
}