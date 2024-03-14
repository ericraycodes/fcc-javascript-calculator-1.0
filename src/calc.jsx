

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




// Validate the expression array sequence of components.
const validateExpressionSequence= (DATA) => {
  /**
  * Expression syntax:
  * 1. Starts and ends with an operand.
  * 2. A single operator between operands.
  * 3. Can use the minus operator as a negative operand indicator when not used as operator.
  * 4. When a result of the previous calculation is present, it is used as a start of another expression
  *    when user follows it up with an operator first, otherwise, it is erased.
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
