
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

    // Validate 1: a negative symbol and a zero.
    const regex1 = /^\-?0?$/;
    const test1 = regex1.test(nref.current + n);
    window.console.log('\ttest1:', test1);
        // valid test1
        if (test1) {
            // collect the input to the ref
            nref.current += n;
        }
    
    // Validate 2: whole numbers, remove a preceeding zero.
    const regex2 = /^(\-?0?)?[1-9][0-9]*?$/;
    const test2 = regex2.test(nref.current + n);
    window.console.log('\ttest2:', test2);
        // valid test2
        if (test2) {
            // check for preceeding zero (non value)
            const ifZero = (nref.current.charAt(0)==='-' && nref.current.charAt(1)==='0') || nref.current.charAt(0)==='0';
            if (ifZero) {
                window.console.log('\t\ttest2 preceeding zero:', ifZero);
                // remove non value zero before the whole number.
                const index0 = nref.current.indexOf('0');
                nref.current = nref.current.slice(0, index0);
            }
            // collect input to ref
            nref.current += n;
        }
    
    // Validate 3: decimals
    const regex3 = /^\-?[0-9]+\.[0-9]*$/;
    const test3 = regex3.test(nref.current + n);
    window.console.log('\ttest3:', test3);
        if (test3) {
            nref.current += n;
        }
    
    // return collected valid string input
    window.console.log('\tinput collected:', nref);
    return nref.current;
};




const calc = {
    'validate'  : validate,
};


export default calc;