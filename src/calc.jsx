

// Collect and define user-input.
  /*
  * 1. Collect the input text.
  * 2. Identity whether: component, 'clear' functionality, or 'equals' functionality.
  */
const setInput =(DATA, USERINPUT) => {
  // references
  const INPUT = DATA.current.input;
  // collect input
  INPUT.value = USERINPUT;
  // identify type
  let type = null;
  if (/[0-9.x/+-]/.test(USERINPUT)) type = 'COMPONENT';
  else if (USERINPUT === 'AC') type = 'CLEAR';
  else if (USERINPUT === '=') type = 'EQUALS';
  // define input
  INPUT.type = type;
  // console
  window.console.log('INPUT:', INPUT);
}
// Setup components: 'operand' or 'operator'
  /*
  * 1. 'Operands' and 'operators' are separated.
  * 2. An 'operand' is validated for a proper mathematical syntax.
  * 3. An 'operator' needs no validation.
  * 4. Formed components are gathered to the expressions array.
  */
const setComponent = (DATA) => {
  // references
  const INPUT = DATA.current.input;
  const COMPONENT = DATA.current.component;
  const EXPRESSION = DATA.current.expression;

  // variable: access expression array
  const array = [...EXPRESSION.arr]
  const idx = array.length - 1;

  // check the component role of input: 'operand' / 'operand'
  const isOperand = /[0-9.]/.test(INPUT.value);
  const isOperator = /[x/+-]/.test(INPUT.value);

  // FORM COMPONENT
  // when 'operand' - needs validate
  if (isOperand) {
    // check if previous component gathered is not an 'operand'
    const isNotOperand = COMPONENT.type!=='OPERAND';
    // set COMPONENT property for a fresh 'operand' component
    if (isNotOperand) {
      COMPONENT.value = '';
      COMPONENT.type = 'OPERAND';
    }

    // VALIDATE 'OPERAND'
      /*
      * 1. Can start only with a single zero as initial input, especially when user inputs a decimal point.
      * 2. A whole number replaces the starting zero.
      * 3. Accepts decimal figures. (validated later)
      * 4. Accepts a negative sign.
      */
    // hold on to user input attempt
    const userinput = COMPONENT.value + INPUT.value;

    // condition for a numeric syntax
    const isNumeric = /^\-?[0-9]+?\.?[0-9]*$/.test(userinput);
    // check if first 'operand' input is a decimal point.
    const is1stInputDecimalPoint = COMPONENT.value==='' && INPUT.value==='.';

    // output: when user input attempt is numeric; decimals are validated later
    if (isNumeric) COMPONENT.value = /\./.test(userinput) ? userinput : parseFloat(userinput);
    // output: when decimal point is first input
    if (is1stInputDecimalPoint) COMPONENT.value = '0.';
  }
  // when 'operator' - no validation
  else if (isOperator) {
    // output: store input to the component property
    COMPONENT.value = INPUT.value;
    COMPONENT.type = 'OPERATOR';
  }
  // console: COMPONENT
  window.console.log('COMPONENT:', COMPONENT);

  // output: collect component to expression array
  EXPRESSION.arr = array.concat({ "value" : COMPONENT.value, "type" : COMPONENT.type });
  // console: EXPRESSION ARRAY
  window.console.log('\tcollection:', EXPRESSION.arr.map(obj => obj.value));
};
// Form a validated mathematical expression.
  /*
  * 1. Starts with an 'OPERAND'.
  * 2. A single 'OPERATOR' in between single-'OPERANDS'.
  * 3. Integrates a negative sign to an 'OPERAND'.
  * 4. Ends with an 'OPERAND'. ('EQUALS' functionality)
  */
const formExpression = (DATA) => {
  // references
  const EXPRESSION = DATA.current.expression;
  // access array
  const array = [...EXPRESSION.arr];

  // COLLATE COMPONENTS
  

};





// Reset the calculator data. Clear calculator data.
  /*
  * 1. Empties the calculator data.
  */
const clearCalculatorData = (DATA) => {
  // output: this is more efficient than assigning a new object to the data with similar values
  DATA.current.input.value = null;
  DATA.current.input.type = null;

  DATA.current.component.value = null;
  DATA.current.component.type = null;

  DATA.current.expression.str = null;
  DATA.current.expression.arr = [];

  DATA.current.result.value = null;
  DATA.current.result.type = null;

  DATA.current.display.row1 = '';
  DATA.current.display.row2= 0;

  // clear the console
  window.console.clear();
};
// Display the calculator activity.
  /*
  * 1. Display the expression and complete equation.
  * 2. Display the component formation and result of simplification.
  */
const displayCalculatorActivity = (DATA) => {
  // references
  const DISPLAY = DATA.current.display;
  const EXPRESSION = DATA.current.expression;
  const COMPONENT = DATA.current.component;
  // output
  DISPLAY.row1 = EXPRESSION.str;
  DISPLAY.row2 = COMPONENT.value;
};


// Decide how to utilize the previous calculation result.
  /*
  * 1. The expression array is empty - a start of another expression.
  * 2. Previous results are used to start another calculation when input
  *    an 'operator' follows as input; otherwise, it is not used and erased.
  */
const purposePreviousResult = (DATA) => {
  // reference
  const RESULT = DATA.current.result;
  const EXPRESSION = DATA.current.expression;

  // access array
  const array = [...EXPRESSION.arr];

  // check if previour result is available
  const isResult = RESULT.value !== null;
  // check if follow up input is an operator
  const isOperator = array.length === 1 ? (array[0]["type"] === 'OPERATOR' ? true : false) : false;

  // conditional output: start the expression with prev result
  if (isOperator && isResult) {
    // insert the result at the start
    const obj = {
      "value" : RESULT.value,
      "type"  : 'OPERAND',
    };
    array.unshift(obj);
    // update the expression array
    EXPRESSION.arr = array.map(obj => {
      return {
        "value" : obj.value,
        "type"  : obj.type,
      };
    });
    // console
    window.console.log('\tprev result:', EXPRESSION.arr.map(obj => obj.value));
  }
};



// MAIN FUNCTION
  /*
  */
export default function runCalculator(DATA, USERINPUT) {

  // COLLECT, DEFINE USER INPUT
  set.input(DATA, USERINPUT);

  // 3 MAIN FUNCTIONALITIES
  const INPUT = DATA.current.input;
  // Form a math expression
  if (INPUT.type === 'COMPONENT') {
    // previous calculation result inclusion
    get.result(DATA);

    // compose 'components'
    set.component(DATA);

    // form a validated expression
    set.expression(DATA);

    // display activity
    set.display(DATA);
  }
  // Simplify the expression
  else if (INPUT.type === 'EQUALS') {
    window.console.log('simplifying...');
  }
  // Reset the calculator data
  else if (INPUT.type === 'CLEAR') {
    // clears calculator data
    set.reset(DATA);
  }

  // CONSOLE: CALCULATOR DATA
  window.console.log('CALCULATOR:', DATA.current);
}




// objects
const set = {
  "input"       : setInput,

  "component"   : setComponent,
  "expression"  : formExpression,
  "reset"       : clearCalculatorData,
  "display"     : displayCalculatorActivity,
}
const get = {
  "result"      : purposePreviousResult,
  // "calculation" : simplifyExpression,
}
