

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
const collateStoredComponents = (DATA) => {
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

  // reference
  const EXPRESSION = DATA.current.expression;
  const COMPONENT = DATA.current.component;

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
  if (isPrevOperand) array[l-1]["value"] = parseFloat(array[l-1]["value"]);

  // output
  EXPRESSION.arr = [...array];

  // console
  window.console.log('collated:', EXPRESSION.arr.map(obj => obj.value));
};




// Validate the expression array sequence of components.
const validateExpressionSequence= (DATA) => {
  /**
  * Expression syntax:
  * 1. Starts and ends with an operand.
  * 2. A single operator between operands.
  * 3. Can use the minus operator as a negative operand indicator when not used
  *    as operator.
  * 4. When a result of the previous calculation is present, it is used as a
  *    start of another expression when user follows it up with an operator
  *    first, otherwise, it is erased.
  */

  // reference
  const EXPRESSION = DATA.current.expression;



  // console
  window.console.log('sequence:', EXPRESSION.arr.map(obj => obj.value));
};




// Resets the calculator data to initial state.
const clearCalculatorData = (data) => {
  // output
  data.current = {
    "input" : {
      "value" : '',
      "type"  : null,
    },

    "component" : {
      "value" : '',
      "type"  : null,
    },

    "expression" : {
      "str" : '',
      "arr" : [],
    },

    "calculation" : {
      "result"  : null,
      "isValid" : false,
    },

    "display" : {
      "row1" : '',
      "row2" : 0,
    },
  };
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
  "collate" : collateStoredComponents,
};
const exp = {
  "validate"   : validateExpressionSequence,
};
const calc = {
  // "calculate" : solveTheExpression,
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
    // form components: 'operand' or 'operator'.
    comp.form(DATA);

    // display the components
    comp.display(DATA);

    // store components
    comp.store(DATA);

    // correct component
    comp.collate(DATA);

    // correct sequence
    exp.validate(DATA);
  }
  // Calculate the inputted expression.
  else if (INPUT.type === 'equals') {
    // final validation expression
    // exp.finish(data);

    // calculate result
    // exp.calculate(data);
  }
  // Reset the calculator.
  else if (INPUT.type === 'clear') {
    // Sets the calculator data to its initial state.
    calc.reset(DATA);
  }

  // calculator data in console
  window.console.log('DATA STORE:', DATA.current);
}
