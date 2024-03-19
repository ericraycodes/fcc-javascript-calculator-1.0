

// Collect input as object with type: 'operand' or 'operator'.
const collectUserInput = (data, userInput) => {
  // reference
  const input = data.current.input;
  // identify input type
  let type = null;
  if (/[0-9.]/.test(userInput)) type = 'operand';
  else if (/[x/+-]/.test(userInput)) type = 'operator';
  else if (userInput === '=') type = 'equals';
  else if (userInput === 'AC') type = 'clear';
  // output: This is much faster than assign through on object literal.
  input.value = userInput;
  input.type = type;
  // console
  window.console.log('input:', input);
};




// Form components by validating series of inputs.
const formAComponent = (DATA) => {
  /**
  * 1. Component values are strings.
  * 2. Operands can be a multi-character string.
  * 3. Operators are single-character string.
  */

  // reference
  const INPUT = DATA.current.input;
  const COMPONENT = DATA.current.component;

  // variable
  let component = null;

  // separate component types
  if (INPUT.type !== COMPONENT.type) {
    COMPONENT.value = '';
    COMPONENT.type = INPUT.type;
  }

  // when 'operand'
  if (INPUT.type === 'operand') {
    /**
    * Operand rules:
    * 1. A decimal point '.' will be '0.'.
    * 2. Can start a single zero as first input, or when followed by decimal figures.
    * 3. The zero will be removed when followed by whole numbers.
    */

    // variable
    const inputSeries = COMPONENT.value + INPUT.value;

    // test: Is the first input a decimal point?
    const isDecimalPoint = inputSeries === '.';
    // test: Is the series of numeric input valid? The parseFloat() will take care of zeroes.
    const isNumeric = /^\-?[0-9]+?\.?[0-9]*$/.test(inputSeries);
    // test: Is there a presence of a decimal point?
    const isThereADecimalPoint = /\./.test(inputSeries);
    // tests in console
    // window.console.log('\ttests:\t', 'dp.', isDecimalPoint, 'n.', isNumeric, 'df.', isThereADecimalPoint);

    // conditional operand values
    if (isDecimalPoint) {
      // adds a zero in front of the decimal point
      component = '0.';
    } else if (isNumeric) {
      // converts to float to regularize starting zeroes
      // strings with decimals are not converted to retain tail of zeroes after the decimal, but will still be validated later
      component = isThereADecimalPoint ? inputSeries : parseFloat(inputSeries);
      // window.console.log('\tnumeric:', parseFloat(inputSeries));
    } else {
      component = COMPONENT.value;
    }

    // erase the result of previous calculation
    const CALCULATION = DATA.current.calculation;
    CALCULATION.value = null;
    CALCULATION.type = null;
  }
  // when 'operator'
  else if (INPUT.type === 'operator') {
    // collect the operator
    component = INPUT.value;
  }

  // output
  COMPONENT.value = component;

  // console
  window.console.log('component:', COMPONENT);
};
// Displats components on the calculator.
const shareComponentAsDisplayData = (DATA) => {
  // output
  DATA.current.display.row2 = DATA.current.component.value;
};
// Store valid components to expression array.
const storeComponentToExpressionArray = (DATA) => {
  // references
  const COMPONENT = DATA.current.component;
  const EXPRESSION = DATA.current.expression;

  // concat component to array
  const array = EXPRESSION.arr.concat({
    "value" : COMPONENT.value,
    "type"  : COMPONENT.type,
  });

  // output
  EXPRESSION.arr = [...array];

  // console
  window.console.log('collection:', EXPRESSION.arr.map(obj => obj.value));
};
// Collate expression array of components to rules.
/**
* Rules:
* 1. There is only an alternate sequence of single 'operands' and 'operators'.
* 2. There can only be one 'operand' in alternation with 'operators'.
* 3. There can only be one 'operator' and a possible negative sign when followed
*    by an 'operand'. The previously inputted 'operator' and negative sign
*    (when present) will be removed when followed by another 'operator' input.
* 4. The negative sign (subtraction operator, '-') can only be placed (inputted)
*    before an 'operand' - regardless of 'operators'.
* 5. The negative sign and proceeding 'operand' will be integrated when present.
*/
const collateComponentSequence = (DATA) => {
  // reference
  const EXPRESSION = DATA.current.expression;
  const COMPONENT = DATA.current.component;
  const CALCULATION = DATA.current.calculation;

  // access array
  const array = [...EXPRESSION.arr];
  const n = array.length - 1;

  // collate when a sequence of two or more similar component types are present
  if (n >= 1) {

    // for an 'operator'
    if (COMPONENT.type === 'operator') {
      // check if 'operator' can be used as a negative sign
      const canNegativeSign = array[n]["value"] === '-';
      // collate 1: A sequence of two 'operator' component input. The second 'operator' must not be a negative sign.
      const areTwoOperators = array[n-1]["type"]==='operator' && array[n]["type"]==='operator';

      // collate a sequence of 3
      if (n >= 2) {
        // collate 2: A sequence of two 'operator' component input. The second 'operator' must not be a negative sign.
        const areThreeOperators = array[n-2]["type"]==='operator' && array[n-1]["value"]==='-' && array[n]["type"]==='operator';
        areThreeOperators ? array.splice(n-2, 2) : null;
      }
      // collate a sequence of 2: as first or following component
      (n===1 && areTwoOperators && canNegativeSign) || (areTwoOperators && !canNegativeSign) ? array.splice(n-1, 1) : null;
    }
    // for an 'operand'
    else if (COMPONENT.type === 'operand') {
      // NEGATIVE INTEGRATION
      // check: if 'operand' can be a negative in a sequence
      const canNegative = array[n-1]["value"]==='-' && array[n]["type"]==='operand';
      // check: for possible negatives at the start of the expression
      const isNegativeStart = n===1 && canNegative ? true : false;
      // check: for a possible negative operand setup, example: a sequence of '1 + - 1' will be '1 + -1';
      const isNegativeSetup = n >= 3 ? ( array[n-2]["type"]==='operator' && canNegative ? true : false) : false;
      // integrate negatives
      if (isNegativeStart || isNegativeSetup) {
        // update the actual developing component for operands
        COMPONENT.value = array[n-1]["value"] + array[n]["value"];
        array[n]["value"] = COMPONENT.value;
      }

      // FOR OPERANDS
      // check: if there is two 'operand' components in the array; when true, only the latter can remain
      const areTwoOperands = array[n-1]["type"]==='operand' && array[n]["type"]==='operand';

      // filter out invalid component elements in the array
      if (isNegativeStart || isNegativeSetup || areTwoOperands) array.splice(n-1, 1);
    }
  }

  // parseFloat the stringed operands
  const l = array.length - 1;
  const isPrevOperand = l >= 1 ? (array[l-1]["type"]==='operand' && array[l]["type"]==='operator' ? true : false ) : false;
  if (isPrevOperand) {
    array[l-1]["value"] = parseFloat(array[l-1]["value"]);
    // check and correct against a negative zero
    if (array[l-1]["value"] === -0) array[l-1]["value"] = 0;
  }

  // output
  EXPRESSION.arr = [...array];

  // console
  window.console.log('collated:', EXPRESSION.arr.map(obj => obj.value));
};



// Manage calculation result.
const manageResult = (DATA) => {
  /**
  * 1. When previous result is present, it can be used to start another expression
  *    when user starts the expression with an 'operator'.
  * 2. Otherwise, the result will not be used.
  * 3. The calculation data is cleared either way for storage of another result.
  */

  // reference
  const CALCULATION = DATA.current.calculation;
  const COMPONENT = DATA.current.component;
  const EXPRESSION = DATA.current.expression;

  // variable
  const array = [...EXPRESSION.arr];
  const i = array.length - 1;

  // CONDITIONS
  // check if there is a previous result present
  const isResult = CALCULATION.result!==null && CALCULATION.type!==null;
  // check if the user's first input is an operator
  const isFirstCompOperator = i===0 && array[0]["type"]==='operator' ? true : false;

  // OUTPUT
  // start the expression when conditions are met
  if (isResult && isFirstCompOperator) {
    // inser result as 'operand' component
    const obj = {
      "value" : CALCULATION.result,
      "type"  : 'operand',
    };
    array.unshift(obj);
  }
  // reset the calculation data
  CALCULATION.result = null;
  CALCULATION.type = null;

  // console
  window.console.log('prev result:', CALCULATION);
};
// Validate the proper sequenc of a math expression in the array.
const correctExpression = (DATA) => {
  /**
  * 1. The expression can only start with an 'operand'.
  * 2. The expression can only end with an 'operand' for calculation.
  * 3. Append the 'equals' symbol at the end of expression.
  */

  // reference
  const EXPRESSION = DATA.current.expression;
  const INPUT = DATA.current.input;
  const CALCULATION = DATA.current.calculation;

  // access expression array
  const array = [...EXPRESSION.arr];

  // when input is not for calculation
  if (INPUT.type !== 'equals') {
    // check if first component is 'operator'
    const isOperator = array.length === 2 ? (array[0]["type"]==='operator' ? true : false) : false;
    // remove first component when operator
    if (isOperator) array.shift();
  }
  // when input is for calculation
  else if (INPUT.type==='equals' && CALCULATION.result===null) {
    // check if last component is an 'operator'
    const isOperator = array[array.length - 1]["type"] === 'operator';
    // remove last component when 'operator'
    if (isOperator) array.pop();
    // check if last component is 'operand'
    const isOperand = array[array.length - 1]["type"] === 'operand';
    // parseFloat the last component when operand
    if (isOperand) array[array.length - 1]["value"] = parseFloat(array[array.length - 1]["value"]);
    // append the '=' symbol at the end of expression
    array.splice(array.length, 0, {
        "value" : '=',
        "type"  : 'equals',
    });
  }

  EXPRESSION.arr = [...array];

  // console
  window.console.log('sequence:', EXPRESSION.arr.map(obj => obj.value));
};




// Display the computational data in calculator display.
/**
* 1. Display the component input in row2.
* 2. Display the expression in string in row1.
*/
const displayInput = (DATA) => {
  /**
  * 1. Display the component input in row2.
  * 2. Display the expression in string in row1.
  */

  // reference
  const COMPONENT = DATA.current.component;
  const EXPRESSION = DATA.current.expression;
  const DISPLAY = DATA.current.display;

  // OUTPUT
  DISPLAY.row1 = EXPRESSION.arr.map(obj => obj.value).join(' ');
  DISPLAY.row2 = COMPONENT.value;

  // console
  window.console.log('display:', DISPLAY);
};
// Calculate the result of the math expression.
/**
* 1. Apply MDAS on math operation priority.
* 2. The result is stored.
*/
const solveTheExpression = (DATA) => {
  // reference
  const EXPRESSION = DATA.current.expression;
  const CALCULATION = DATA.current.calculation;

  // access array: equals and result proof
  const arr = EXPRESSION.arr.filter(obj => obj.type==='operand' || obj.type==='operator');
  const array = arr.map(obj => {
    return { "value": obj.value, "type": obj.type };
  });

  //  MDAS simplification
  ['x', '/', '+', '-'].forEach(operator => {

    // loop through the expression to match MDAS
    let i = null;
    for (i=0; i<array.length; i++) {
      // check a match of 'operator'
      const isMatch = operator === array[i]["value"];
      if (isMatch) {
        // apply math operations according to matches
        let result = null;
        switch (operator) {
          case 'x': result = array[i-1]["value"] * array[i+1]["value"]; break;
          case '/': result = array[i-1]["value"] / array[i+1]["value"]; break;
          case '+': result = array[i-1]["value"] + array[i+1]["value"]; break;
          case '-': result = array[i-1]["value"] - array[i+1]["value"]; break;
        }
        // update the array
        array.splice(i-1, 3, {
          "value" : result,
          "type"  : 'operand'
        });
        // console
        window.console.log('\toperation:', operator, '\tindex:', i);
        window.console.log('\tsimplifying:', array.map(obj => obj.value));
        // search operators through through the array from the start again
        i = 0;
      }
    }
  });

  // OUTPUT: store the final result to calculator data
  CALCULATION.result = array[array.length - 1]["value"];
  CALCULATION.type = 'number';

  // console
  window.console.log('result:', CALCULATION);
};
// Prepare the calculator for another calculation.
/**
* 1. When 'equals' is inputted, the result is displayed in the display.
* 2. When another expression is being formulated, the expression array is emptied.
*/
const prepareCalculator = (DATA) => {
  // reference
  const EXPRESSION = DATA.current.expression;
  const COMPONENT = DATA.current.component;
  const CALCULATION = DATA.current.calculation;
  const INPUT = DATA.current.input;

  // check if 'equals' and 'result' is already displayed (anti 'equals' spam)
  const isSpam1 = EXPRESSION.arr.some(obj => obj.type==='equals');
  const isSpam2 = EXPRESSION.arr.some(obj => obj.type==='result');
  // condition for displaying result: result and 'equals'
  const isDisplay = CALCULATION.result!==null && INPUT.type==='equals';
  // reflecting the final result
  if (isDisplay && !(isSpam1 && isSpam2)) {
    // append the result to create a complete equation
    const resultObj = {
      "value" : CALCULATION.result,
      "type"  : 'result',
    };
    EXPRESSION.arr.splice(EXPRESSION.arr.length, 0, resultObj);
    // reflect the result to display
    COMPONENT.value = resultObj.value;
    COMPONENT.type = resultObj.type;
  }

  // console
  window.console.log('')
};
// Resets the calculator data to initial state.
const clearCalculatorData = (data) => {

  // output: this is more efficient than assigning a new object to the data with similar values
  data.current.input.value = '';
  data.current.input.type = null;

  data.current.component.value = '';
  data.current.component.type = null;

  data.current.expression.str = '';
  data.current.expression.arr = [];

  data.current.calculation.result = null;
  data.current.calculation.type = null;

  data.current.display.row1 = '';
  data.current.display.row2= 0;

  // clear the console
  window.console.clear();
};



/** functions in objects */
const input = {
  "collect"   : collectUserInput,
};
const comp = {
  "form"    : formAComponent,
  "display" : shareComponentAsDisplayData,
  "store"   : storeComponentToExpressionArray,
  "collate" : collateComponentSequence,
};
const exp = {
  "insertResult"  : manageResult,
  "validate"      : correctExpression,
};
const calc = {
  "display"   : displayInput,
  "calculate" : solveTheExpression,
  "prepare"  : prepareCalculator,
  "reset"     : clearCalculatorData,
};




/** MAIN CALCULATOR FUNCTION */
export default function runCalculator(DATA, userInput) {
  // references
  const INPUT = DATA.current.input;
  // Collect the user input, define its type.
  input.collect(DATA, userInput);

  // Run main functionalities of the calculator.
  // Form an expression.
  if (INPUT.type==='operand' || INPUT.type==='operator') {
    // clean up calculator from previous calculation data
    // calc.clean(DATA);

    // form components: 'operand' or 'operator'.
    comp.form(DATA);

    // display the components
    comp.display(DATA);

    // store components
    comp.store(DATA);

    // correct component
    comp.collate(DATA);

    // utilize previous calculation result
    exp.insertResult(DATA);

    // correct sequence
    exp.validate(DATA);
  }
  // Calculate the inputted expression.
  else if (INPUT.type === 'equals') {
    // final validation expression
    exp.validate(DATA);

    // calculate result
    calc.calculate(DATA);

    // preparation for another expression
    calc.prepare(DATA);
  }
  // Reset the calculator.
  else if (INPUT.type === 'clear') {
    // Sets the calculator data to its initial state.
    calc.reset(DATA);
  }

  // Display functionality
  calc.display(DATA);

  // calculator data in console
  window.console.log('DATA STORE:', DATA.current);
}
