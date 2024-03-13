

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

  // Separate 'operator' and 'operand' in a single element string.
  // element.str = element.type === input.type ? element.str : '';
  if (element.type !== input.type) element.str = '';

  // OPERATORS: single character syntax, no validation needed.
  if (input.type === 'operator') {
    element.str = input.value;
    element.type = input.type;
  }
  // OPERANDS: syntax validation
  else if (input.type === 'operand') {
    // set element type.
    element.type = input.type;

    // collect the user input
    const userInput = element.str + input.value;

    // validate for correct numeric syntax
    const test1 = /^\-?[0-9]*\.?[0-9]*$/.test(userInput);
    // check for the presence of decimals
    const test2 = /^\-?([0-9]*)?\./.test(userInput);

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

  window.console.log('\telement:', element);
};
// Collect elements to the expression array.
const storeElements = (data) => {
  const expression = data.current.expression;
  const element = data.current.element;
  // output
  expression.arr = expression.arr.concat({
    "str"   : element.str,
    "type"  : element.type,
  });
  window.console.log('\tstore:\t', expression.arr.map(obj => obj.str));
};
// Collate the element.
const collateElements = (data) => {
  // reference
  const element = data.current.element;
  const expression = data.current.expression;

  // access array
  const array = [...expression.arr];
  const last = array.length - 1;
  const doesExist1 = Boolean(array[last - 1]);
  const operatorSequence1 = Boolean(array[last - 2]) && array[last-2]["type"]==='operator';
  // window.console.log('\tlast index - 2:', doesExist2);

  // Check for two element items within the array.
  if (doesExist1) {
    // for two redundant elements, remove the former when the latter can't be a negative ('-') indicator.
    const similarType2 = array[last-1]["type"] === array[last]["type"];
    if (similarType2 && array[last]["str"]!=='-') {
      // conditional output
      expression.arr = array.toSpliced(last - 1, 1);
    }
  }
  // Validate a sequence of three 'operator' input.
  if (operatorSequence1 && array[last-1]["str"]==='-' && array[last]["type"]==='operator') {
    // conditional output
    expression.arr = array.toSpliced(last - 2, 2);
  }

  window.console.log('\tcollated:', expression.arr.map(obj => obj.str));
};


// Correct the expression seqence.
const validateSequence = (data) => {
  /**
   * EXPRESSION SEQUENCE RULES
   * 1. Starts and ends with an 'operand'.
   * 2. There is only one 'operator' in between 'operands'.
   * 3. Special case: the subtraction operator (-) can be used to integrate to an 'operand' to form a 'negative number'.
   */

  // reference
  const expression = data.current.expression;

  // access array
  const array = [...expression.arr];
  const n = array.length - 1;

  // conditions
  const isOperator0 = array[0]["type"]==='operator' && array[0]["str"]!=='-';
  const does1Exist = Boolean(array[1]);

  // Conditional Output: remove 'operators' in front of the sequence, except a single 'negative' indicator.
  if (array[0]["type"]==='operator') {
    if (isOperator0) expression.arr = array.toSpliced(0, 1);
    if (does1Exist && array[0]["str"]==='-') {
      if (array[1]["str"]==='-') {
        expression.arr = array.toSpliced(1, 1);
      }
    }
  }

  // Conditional Output: parseFloat 'operand' before the latest inputted 'operator'
  const isPrevOperandExist = Boolean(array[n-1]);
  if (isPrevOperandExist) {
    if (array[n-1]["type"]==='operand' && array[n]["type"]==='operator') {
      expression["arr"][n-1]["str"] = `${parseFloat(array[n-1]["str"])}`;
    }
  }

  window.console.log('\tsequence:', expression.arr.map(obj => obj.str));
};
// Integrate the negative indicator to 'operands'.
const integrateNegativeIndicator = (data) => {
  // reference
  const expression = data.current.expression;
  const element = data.current.element;

  // access array
  const array = [...expression.arr];
  const n = array.length - 1;

  // condition 1: the first operand
  if (n === 1) {
    if (array[0]["str"]==='-' && array[1]["type"]==='operand') {
      element.str = array[0]["str"] + array[1]["str"];
      const negativeOperand = {
        "str"   : element.str,
        "type"  : 'operand',
      };
      // output
      expression.arr = [negativeOperand];
    }
  }
  // condition 2: following operands
  else if (n >= 3) {
    if (array[n-2]["type"]==='operator' && array[n-1]["str"]==='-' && array[n]["type"]==='operand') {
      element.str = array[n-1]["str"] + array[n]["str"];
      const negativeOperand = {
        "str"   : element.str,
        "type"  : 'operand',
      };
      // output
      expression.arr = [...array.toSpliced(n-1, 2, negativeOperand)];
    }
  }

  window.console.log('\tnegative:', expression.arr.map(obj => obj.str));
};
// Strings up the expression.
const stringUpExpression = (data) => {
  // reference
  const expression = data.current.expression;
  const string = expression.arr.map(obj => obj.str).join(' ');
  expression.str = string;

  window.console.log('\tstring:', string);
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
  "store"           : storeElements,
  "collate"         : collateElements,
};
const exp = {
  "formulate"       : validateSequence,
  "negate"          : integrateNegativeIndicator,
  "display"         : stringUpExpression,
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

    // store elements to array
    elem.store(data);

    // collate elements
    elem.collate(data);

    // correct the sequence
    exp.formulate(data);

    // integrate negative indicators to operands
    exp.negate(data);

    // string up the expression array for display
    exp.display(data);
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
