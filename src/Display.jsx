



export default function Display({ display }) {

    // display contents
    const expString = display.join(' ');

    // content to render
    const row1 = expString;
    const row2 = expString === '' ? 0 : display[display.length-1];
    window.console.log('DISPLAY', '\n\t', 'row1:', row1, '\n\t', 'row2:', row2 );

    return (
        <>
            <figure className='display'>
                <div>
                    { row1 }
                </div>
                <div id='display'>
                    { row2 }
                </div>
            </figure>
        </>
    );
}
