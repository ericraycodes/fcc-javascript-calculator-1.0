
// function: validates input. (input, ref, showIO)
const validate = (n, nref) => {
    /**
     * INPUT RULES FOR DIGITS
     * 1. Can start with the negative ( - ) symbol.
     * 2. Can start with only one zero in anticipation of a decimal point and/or one or more decimal digits.
     * 3. Can end with one or more decimal zeroes.
     * 4. Cannot start with multiple zeroes. The starting zero will be replaced by the next whole number before any decimal digits. 
     */

    // The user input attempt
    window.console.log('\tuser-input:', nref.current + n);

};




const calculator = {
    'validate'  : validate,
};


export default calculator;