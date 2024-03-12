

// Collect mouse-input
const collectInput = (data, input) => {
  // output
  data.current.input.value = input;
};


// Define the mouse-event input key.
const defineInputType = (value) => {
  let type = null;
  if (/[0-9.]/.test(value))      type = 'operand';
  else if (/[X/+-]/.test(value)) type = 'operator';
  else if (value === '=')        type = 'equals';
  else if (value === 'AC')       type = 'clear';
  // return statement
  return type;
};
const setInputType = (data) => {
  const input = data.current.input;
  const type = calc.defInputType(input.value);
  // output
  input.type = type;
  window.console.log('\tinput:', input);
};
// Define the type of a string.
const defineElementType = (str) => {
  let type = null;
  if (/[0-9.]+/.test(str))     type = 'operand';
  else if (/[/X+-]/.test(str))  type = 'operator';
  return type;
};
const setElementType = (data) => {
  const element = data.current.element;
  const type = elem.defineType(element.str);
  // output
  element.type = type;
};


// Collect validated inputs. Classify as 'operand' or 'operator'.
const validateElements = (data) => {
  /**
     * OPERAND SYNTAX INPUT RULES
     * 1. Can start with only one zero to anticipate decimals and when followed by decimals, e.g., '0.1'.
     * 2. The starting zero will be replaced by the next whole number input, e.g., '0 1' will be '1'.
     * 3. Can end with one or more decimal zeroes in the anticipation of a non-zero decimal figure input.
     */

  // reference
  const element = data.current.element;
  const input = data.current.input;

  // OPERATORS: single character syntax, no validation needed.
  if (input.type !== element.type) {
    data.current.element = {
      "str"   : '',
      "type"  : input.type,
    };
  }

  // OPERANDS: syntax validation
  if (input.type === 'operand') {
    // collect the user input
    const userInput = element.str + input.value;

    // validate for correct numeric syntax
    const test1 = /^[0-9]*\.?[0-9]*$/.test(userInput);
    // check for the presence of decimals
    const test2 = /^([0-9]*)?\./.test(userInput);

    // test is ok
    if (test1) {
      // collect valid input
      element.str = userInput;

      // convert to number when no decimal figure
      if (!test2) {
        element.str = parseFloat(element.str);
        // convert back to string
        element.str = `${element.str}`;
      }
    }
    // add zero before a decimal point
    if (element.str==='.') element.str = '0.';
  }
  // OPERATORS: no validation.
  else if (input.type === 'operator') {
    data.current.element = {
      "str"   : input.value,
      "type"  : input.type,
    };
  }
  window.console.log('\telements:', element, input.type);
};
// Collect elements to the expression array.
const collectElements = (data) => {
  const expression = data.current.expression;
  const element = data.current.element;
  // output
  expression.arr = expression.arr.concat({
    "str"   : element.str,
    "type"  : element.type,
  });
  window.console.log('\telements:', expression.arr.map(obj => obj.str));
};
// Collate the element.
const collateElements = (data) => {
  // reference
  const input = data.current.input;
  const element = data.current.element;
  const expression = data.current.expression;

  // access expression array
  const arrLastIndex = expression.arr.length - 1;

  if (arrLastIndex)
  // operators: redundant 'operator' types

  window.console.log('\tcollate arr:', arrLastIndex, expression.arr);
};


// Form an expression.
const formExpression = (data) => {
  /**
   * EXPRESSION SEQUENCE RULES
   * 1. Starts and ends with an 'operand'.
   * 2. There is only one 'operator' in between 'operands'.
   * 3. Among a series of 'operator', only the latest operator-element is valid (or second latest to the minus operator).
   * 4. Special case: the subtraction operator (-) can be used to integrate to an 'operand' to form a 'negative number'.
   */

  // reference
  const expression = data.current.expression;



  window.console.log('\texpression:', expression.arr);
};


// Calculate the answer of the expression.
const calculateExpression = (data) => {
  window.console.log('\tresult pending...');
};


// Clear the calculator data.
const setCalculatorClear = (data) => {
  data.current.doClear = true;
};
const resetCalculatorData = (data) => {
  // output
  if (data.current.doClear) {
    data.current = {
      "input" : { "value" : '', "type" : null, },
      "element" : { "str" : '', "type" : null, },
      "expression" : { "str" : '', "arr" : [], },
      "result" : { "operatorIndex" : null, "answer" : null, "isSimplified" : false, },
      "doClear" : false,
    };
    window.console.clear();
  }
};




// OBJECTS
const calc = {
  "input"           : collectInput,
  "defInputType"    : defineInputType,
  "setInputType"    : setInputType,

  "calculate"       : calculateExpression,

  "setClear"        : setCalculatorClear,
  "reset"           : resetCalculatorData,
};
const elem = {
  "defineType"      : defineElementType,
  "setType"         : setElementType,

  "validate"        : validateElements,
  "collect"         : collectElements,
  "collate"         : collateElements,
};
const expression = {
  "formulate"       : formExpression,
};




/**
 * MAIN FUNCTION
 *
 * @param {*} calculatorData - the Calculator data object stored in a ref hook, the only data store.
 * @param {*} mouseInput - a string captured from a mouse-event, the only user-input.
 *
 * The general OUTPUT of every functionality is to access and/or update calculator data
 * in response to user-input.
 *
 * The MAIN OUTPUT of the app is to produce result from calculating a validated input of expression.
 */
export default function runCalculator(calculatorData, mouseInput) {

  // REFERENCES
  const data = calculatorData;
  const input = data.current.input;
  const element = data.current.element;

  // COLLECT AND DEFINE TYPE OF MOUSE-INPUT
  calc.input(data, mouseInput);
  calc.setInputType(data);

  // RUN MAIN FUNCTIONALITIES
  // form an expression
  if (input.type==='operand' || input.type==='operator') {

    // form elements
    elem.validate(data);

    // collect elements
    elem.collect(data);
    // collate elements
    // elem.collate(data);


  }
  // calculate the expression
  else if (input.type === 'equals') {
    calc.calculate(data);
  }
  // clear/reset calculator data
  else if (input.type === 'clear') {
    calc.setClear(data);
    calc.reset(data);
  }

  // data store
  window.console.log(data.current);
}
