



export default function Display({ display }) {

    window.console.log('Display:', display);
    const row1 = display.row1;
    const row2 = display.row2;

    return (
        <>
            <section className='display'>
                <figure>
                    { row1 }
                </figure>
                <figure id='display'>
                    { row2 !== '' ? row2 : 0 } 
                </figure>
            </section>
        </>
    );
}