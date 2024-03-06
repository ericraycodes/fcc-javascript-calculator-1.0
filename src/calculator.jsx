

// Classify operands and operators
const specifyKeyType = (key) => {
    // conditions
    if (key.char === "AC") { key.type = 'clear'; }
    else if (key.char === "=") { key.type = 'equals'; }
    else if (/[0-9.]/.test(key.char)) { key.type = 'operand'; }
    else if (/[+-X/]/.test(key.char)) { key.type = 'operator'; }
    window.console.log('\tkey:', key);
};
// Operands and Operators input
const sequenceExpression = (dataCurrent) => {
    /**
     * EXPRESSION SYNTAX
     * 1. Validated to start and end with 'operands'.
     * 2. A sequence of alternate 'operands' and 'operators'.
     * 
     * EXPRESSION SEQUENCE
     * 1. A change in mouse-input key-type defines the sequence.
     */

    // reference
    const expression = dataCurrent.expression;

    // classify inputs: operands / operators
    calc.classify(dataCurrent);

    // validate inputs
    if (dataCurrent.key.type === 'operands') {calc.operands(dataCurrent);}

    // expression input
    expression.sequence += dataCurrent.input.str;

    window.console.log('\texpression:', expression);
};
// simplify the validated expression
const simplifyExpression = (dataCurrent) => {
    window.console.log('RESULT Pending...');
};
// Clear the calculator data
const clearDisplay = (dataCurrent) => {
    window.console.clear();
    dataCurrent.key = { char: '', type: null };
    dataCurrent.input = { str: '', type: null };
    dataCurrent.collection = { arr: [], };
    dataCurrent.expression = { sequence: '', isValid: false };
};
// Classify between operands and operators
const classifyInput = (dataCurrent) => {
    /**
     * CLASSIFY OPERANDS AND OPERATORS
     * 1. Through parseFloat(), operands convert to numeric values while operands are NaN.
     * 2. Classification is generally identified by the 'input.type' and 'key.type' property.
     * 3. During classification, the 'input.str' is emptied.
     */

    // reference
    const collection = dataCurrent.collection;

    // collect valid input
    if (dataCurrent.input.type !== dataCurrent.key.type) {
        window.console.log('collecting to array...');
        dataCurrent.collection = collection.concat(dataCurrent.input.str);
        dataCurrent.expression.str = collection.join(' ');
        dataCurrent.input.str = '';
    }

    window.console.log('\tcollection:', collection);
};
// validate numeric / operands
const validateOperands = (dataCurrent) => {
    /**
     * OPERAND SYNTAX RULES
     * 1. Can integrate the subtraction operator ( - ) to enter a negative integer and decimal.
     * 2. Cannot start with multiple zeroes.
     * 3. The starting zero will be replaced by the next whole number before any decimal digits. 
     * 4. Can start with only one zero for decimal figures.
     * 5. Can end with one or more decimal zeroes.
     */

    // reference
    const input = dataCurrent.input;
    const key = dataCurrent.key;
    // input attempt
    const attempt = input.str + key.char;

    // accept the subtraction operator for a negative operand.
    if (key.char==='-' && input.str==='') {

    }
};

// -----
const validateNumericInput = (n, ref) => {
    /**
     * INPUT RULES FOR DIGITS
     * 1. Can integrate the subtraction operator ( - ) to enter a negative integer and decimal.* 
     * 2. Cannot start with multiple zeroes.
     * 3. The starting zero will be replaced by the next whole number before any decimal digits. 
     * 4. Can start with only one zero for decimal figures.
     * 5. Can end with one or more decimal zeroes.
     */


    const input = ref.current.input;

    // Update input type
    input.type = 'operand';

    // The user input attempt
    window.console.log('\tvalidate user-input:', input.value + n, input.type);

    // Validate 1: a negative symbol and a zero.
    const regex1 = /^\-?0?$/;
    const test1 = regex1.test(input.value + n);
    window.console.log('\ttest1:', test1);
        // valid test1
        if (test1) {
            // collect the input to the ref
            input.value += n;
        }
    
    // Validate 2: whole numbers, remove a preceeding zero.
    const regex2 = /^(\-?0?)?[1-9][0-9]*?$/;
    const test2 = regex2.test(input.value + n);
    window.console.log('\ttest2:', test2);
        // valid test2
        if (test2) {
            // check for preceeding zero (non value)
            const ifZero = (input.value.at(0)==='-' && input.value.at(1)==='0') || input.value.at(0)==='0';
            if (ifZero) {
                window.console.log('\t\ttest2 preceeding zero:', ifZero);
                // remove non value zero before the whole number.
                window.console.log('\t\tremoving zero...')
                const index0 = input.value.indexOf('0');
                input.value = input.value.slice(0, index0);
            }
            // collect input to ref
            input.value += n;
        }
    
    // Validate 3: decimals
    const regex3 = /^\-?[0-9]+\.[0-9]*$/;
    const test3 = regex3.test(input.value + n);
    window.console.log('\ttest3:', test3);
        if (test3) {
            input.value += n;
        }
};
// Collect the operators
// const collectOperator = (dataCurrent) => {
//     const key = dataCurrent.key;
//     dataCurrent.input = {
//         'str'   : dataCurrent.input.str + key.char,
//         'type'  : 'operator'
//     };

// };




// MAIN FUNCTION
const runCalculator = (dataRef) => {

    // SPECIFY MOUT-INPUT TYPE
    const key = dataRef.key;
    window.console.log('\tmouse-input:', key);
    calc.keyType(key)

    // RUN FUNCTIONALITES
    if (key.type==='operand' || key.type==='operator') {calc.expression(dataRef);}
    else if (key.type === 'equals') {calc.equals(dataRef);}
    else if (key.type === 'clear') {calc.clear(dataRef);}

    window.console.log(dataRef);
};




// Export
const calc = {
    'run'           : runCalculator,
    'keyType'       : specifyKeyType,
    'expression'    : sequenceExpression,
    'equals'        : simplifyExpression,
    'clear'         : clearDisplay,
    'classify'      : classifyInput,
    'operands'      : validateOperands,
    // 'operator'      : collectOperator,
};
export default calc;