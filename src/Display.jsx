



export default function Display({ display }) {

    // window.console.log('<< Display:', display);
    const displayRow2 = display.row2 !== '' ? display.row2 : 0;

    return (
        <>
            <section className='display'>
                <figure>
                    { display.row1 }
                </figure>
                <figure id='display'>
                    { displayRow2 } 
                </figure>
            </section>
        </>
    );
}