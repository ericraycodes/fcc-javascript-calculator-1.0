
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
  if (/[0-9.-]+/.test(str))     type = 'operand';
  else if (/[/X+-]/.test(str))  type = 'operator';
  return type;
};

// Form an expression.
const formExpression = (data) => {
  // reference
  const expression = data.current.expression;

  // output: join valid expression as string
  expression.str = expression.arr.join(' ');

  window.console.log('\texpression:', expression);
};
// Calculate the answer of the expression.
const calculateExpression = (data) => {
  window.console.log('\tresult pending...');
};
// Clear the calculator data.
const resetCalculatorData = (data) => {
  // output
  data.current = {
    "input" : { "value" : '', "type" : null, },
    "element" : { "str" : '', "type" : null, "isValid" : false, "doCollect" : false, },
    "expression" : { "str" : '', "arr" : [], },
    "result" : { "operatorIndex" : null, "answer" : null, "isSimplified" : false, },
    "doClear" : false,
  };
  window.console.clear();
};
// Collect validated inputs. Classify as 'operand' or 'operator'.
const validateOperand = (data) => {
  /**
     * OPERAND SYNTAX RULES
     * 1. Can integrate the subtraction operator ( - ) to enter a negative integer and decimal.
     * 2. Cannot start with multiple zeroes.
     * 3. The starting zero will be replaced by the next whole number before any decimal digits.
     * 4. Can start with only one zero for decimal figures.
     * 5. Can end with one or more decimal zeroes.
     */

  // reference
  const element = data.current.element;
  const input = data.current.input;

  // collect the user input
  const userInput = element.str + input.value;

  // validate for correct numeric syntax
  const rgx1 = /^0?[1-9]+[0-9]*(.[0-9]*)?$/;
  const rgx2 = /^0?.([0-9]*)?$/;
  const test1 = rgx1.test(userInput);
  const test2 = rgx2.test(userInput);
  if (test1 || test2) element.str = userInput;

  // test the user input if a Number.
  // const test = Boolean(parseFloat(userInput)) || input.value==='0';
  window.console.log('\toperand test:', test1, test2, userInput);
  // if (test) {
  //   element.str = userInput;
  // }


  // OUTPUT: validated operand in element.

};
const validateOperator = (data) => {
  /**
     * OPERATOR INPUT RULES
     * 1. There is only one 'operator' in between 'operands'.
     * 2. Among a series of 'operator' inputs, only the last input is valid (or second to the minus operator).
     * 3. Special case: subtraction operator (-) can be used to input a 'negative number'.
     */
};




const calc = {
  "defInputType"  : defineInputType,
  "setInputType"  : setInputType,
  "defElementType": defineElementType,

  "formulate"     : formExpression,
  "calculate"     : calculateExpression,
  "reset"         : resetCalculatorData,

  "operand"       : validateOperand,

  // "expression"    : validate,
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
  input.value = mouseInput;
  calc.setInputType(data);

  // RUN MAIN FUNCTIONALITIES
  // form an expression
  if (input.type==='operand' || input.type==='operator') {
    // validate 'operand' elements, 'operator' no validation needed
    if (input.type==='operand') calc.operand(data);


    // collect valid elements
    // calc.element(data);
    window.console.log('\telement:', element);
  }
  // calculate the expression
  else if (input.type === 'equals') {
    calc.calculate(data);
  }
  // clear/reset calculator data
  else if (input.type === 'clear') {
    calc.reset(data);
  }

  window.console.log(data.current);
}
