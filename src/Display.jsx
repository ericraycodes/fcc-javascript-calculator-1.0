



export default function Display({ display }) {

    // window.console.log('<< Display:', display);

    return (
        <>
            <section className='display'>
                <figure>
                    { display.row1 }
                </figure>
                <figure id='display'>
                    { display.row2 !== '' ? display.row2 : 0 } 
                </figure>
            </section>
        </>
    );
}