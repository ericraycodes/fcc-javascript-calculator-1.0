



export default function display({ row1, row2 }) {



    return (
        <>
            <section className='display'>
                <figure>{ row1 }</figure>
                <figure id='display'>{ row2 }</figure>
            </section>
        </>
    );
}