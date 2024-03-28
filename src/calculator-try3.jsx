

/** Collect and define user-input.
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
/** Setup components: 'operand' or 'operator'
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
/** Form a validated mathematical expression.
  * 1. Starts with an 'OPERAND'.
  * 2. A single 'OPERATOR' in between single-'OPERANDS'.
  * 3. Integrates a negative sign to an 'OPERAND'.
  * 4. Ends with an 'OPERAND'. ('EQUALS' functionality)
  */
const formExpression = (DATA) => {
  // references
  const EXPRESSION = DATA.current.expression;
  const COMPONENT = DATA.current.component;

  // access array
  const array = [...EXPRESSION.arr];

  // COLLATE COMPONENTS
  (function() {
    let idx = array.length - 1;

    // SEQUENCE OF OPERANDS
    // check if there is a sequence of operand components
    const isSequenceOperands = idx > 0 ? (array[idx-1]["type"]==='OPERAND' && array[idx]["type"]==='OPERAND' ? true : false) : false;
    // conditional output: remove the latter component when 'true'
    if (isSequenceOperands) array.splice(idx-1, 1);

    // SEQUENCE OF OPERATORS
    // check if there is a sequence of operand components
    const isSequenceOperators = idx > 0 ? (array[idx-1]["type"]==='OPERATOR' && array[idx]["type"]==='OPERATOR' ? true : false) : false;
    // check if the second operator is minus operator
    const is2ndSubtractionOperator = isSequenceOperators && array[idx]["value"]==='-';
    // check if there is a third operator
    const is3rdOperatorPresent = idx > 1 ? (array[idx-2]["type"]==='OPERATOR' && array[idx-1]["type"]==='OPERATOR' && array[idx]["type"]==='OPERATOR' ? true : false) : false;
    // conditional output: a third operator negates the previous operator and negative
    if (is3rdOperatorPresent) array.splice(idx-2, 2);
    // condition output: the latter operator is kept, when 2nd operator is a potential negative sign both are kept
    else if (isSequenceOperators && !is2ndSubtractionOperator) array.splice(idx-1, 1);

    // console: collate operands and operators
    window.console.log('\tcollate operands:', array.map(obj => obj.value));
  }) ();

  // EXPRESSION STARTS WITH OPERAND
  (function() {
    // check if first component is operand
    const isStartNotOperand = array.length === 2 ? (!(array[0]["type"]==='OPERAND' || array[0]["value"]==='-') ? true : false) : false;
    // only keep operand as first component
    if (isStartNotOperand) array.splice(0, 1);
    // console: collate operands and operators
    window.console.log('\tstart operands:', array.map(obj => obj.value));
  }) ();

  // NEGATIVE OPERANDS
  (function() {
    // access array index
    const idx = array.length - 1;

    // check if operand is set to negative
    const isOperandNegative = idx > 0 ?
      array[idx-1]["value"]==='-' && array[idx]["type"]==='OPERAND' ?
        Boolean(array[idx-2]) ?
          (array[idx-2]["type"]==='OPERATOR' ? true: false) : true
        : false
      : false;

    // conditional output: integrate negative to operand when condition is true
    if (isOperandNegative) {
      const value =  array[idx-1]["value"] + array[idx]["value"];
      // integrate with incoming inputs
      COMPONENT.value = value;
      // update the array component sequence
      array.splice(idx-1, 2, COMPONENT);
    }

    // console
    window.console.log('\tnegatives:', array.map(obj => obj.value));
  }) ();

  // parseFloat completed operand components
  (function() {
    // array index
    const idx = array.length - 1;

    if (idx > 0) {
      const value = array[idx-1]["value"];
      // parseFloat when there is a completed operand
      const parseFloatedValue = array[idx-1]["type"]==='OPERAND' && array[idx]["type"]==='OPERATOR' ? parseFloat(value) : value;
      // check against a negative zero
      array[idx-1]["value"] = parseFloatedValue === -0 ? 0 : parseFloatedValue;
    }

    // console
    window.console.log('\tparseFloats:', array.map(obj => obj.value));
  }) ();

  // REASSIGN OUTPUT TO THE EXPRESSION ARRAY
  EXPRESSION.arr = array.map(obj => {
    return {
      "value" : obj.value,
      "type"  : obj.type,
    };
  });
  // REFLECT THE EXPRESSION AS STRING
  EXPRESSION.str = EXPRESSION.arr.map(obj => obj.value).join(' ');
};





/** Reset the calculator data. Clear calculator data.
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
/** Display the calculator activity.
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


/** Decide how to utilize the previous calculation result.
  * 1. The expression array is empty - a start of another expression.
  * 2. Previous results are used to start another calculation when input
  *    an 'operator' follows as input; otherwise, it is not used and erased.
  */
const purposePreviousResult = (DATA) => {
  // reference
  const RESULT = DATA.current.result;
  const EXPRESSION = DATA.current.expression;
  const INPUT = DATA.current.input;

  // access array
  const array = [...EXPRESSION.arr];

  // check if previour result is available
  const isResult = RESULT.value !== null;
  // check if follow up input is an operator
  const isOperator = array.length===0 && /[x/+-]/.test(INPUT.value) ? true : false;

  // conditional output: start the expression with prev result
  if (isOperator && isResult) {
    // insert the result at the start
    const obj = {
      "value" : RESULT.value,
      "type"  : 'OPERAND',
    };
    array.unshift(obj);
    window.console.log('prev:', array);
    // update the expression array
    EXPRESSION.arr = array.map(obj => {
      return {
        "value" : obj.value,
        "type"  : obj.type,
      };
    });
    // console
    window.console.log('\tprev result:', EXPRESSION.arr.map(obj => obj.value), isResult, isOperator);
  }
  // result is emptied
  if (array.length === 1) {
    RESULT.value = null;
    RESULT.type = null;
  }
};
/** Find the result from simplifiying the expression.
  * 1. MDAS rule.
  * 2. Store result.
  * 3. Reflect the result to the display.
  * 4. Empty expression array.
  */
const simplifyExpression = (DATA) => {
  // references
  const EXPRESSION = DATA.current.expression;
  const RESULT = DATA.current.result;
  const COMPONENT = DATA.current.component;
  const INPUT = DATA.current.input;
  const DISPLAY = DATA.current.display;

  // condition against spamming '=' button
  const isFirstEquals = RESULT.value === null;
  // run on the first 'equals'
  if (isFirstEquals) {
    // parseFloat operands, validate end of expression sequence
    (function() {
      // copy expression array
      const array = EXPRESSION.arr.map(obj => {
        return {
          "value" : obj.value,
          "type"  : obj.type,
        };
      });
      // // validate expression
      const isEndComponentOperator = array[array.length-1]["type"]==='OPERATOR';
      if (isEndComponentOperator) array.splice(array.length-1, 1);
      // parseFloat operands
      EXPRESSION.arr = array.map(obj => {
        obj.value = obj.type === 'OPERAND' ? parseFloat(obj.value) : obj.value;
        return obj;
      });
      // update string expression
      EXPRESSION.str = EXPRESSION.arr.map(obj => obj.value).join(' ');
      // console
      window.console.log('\texp validation:', EXPRESSION.arr.map(obj => obj.value));
    }) ();

    // SIMPLIFY THE EXPRESSION
    (function() {
      // copy expression array
      const array = EXPRESSION.arr.map(obj => {
        return {
          "value" : obj.value,
          "type"  : obj.type,
        };
      });

      // MDAS
      const mdas = ['x', '/', '+', '-'];
      mdas.forEach(operator => {

        // loop through the expression array to seek operators in MDAS priority
        let i = null;
        for (i=1; i<array.length; i++) {
          // check match of mdas and expression operator
          const match = operator === array[i]["value"];
          // run the operation when match
          if (match) {
            // access components;
            const operand1 = array[i-1]["value"];
            const operand2 = array[i+1]["value"];
            // execute operation
            let result = null;
            switch (operator) {
              case 'x': result = operand1 * operand2; break;
              case '/': result = operand1 / operand2; break;
              case '+': result = operand1 + operand2; break;
              case '-': result = operand1 - operand2; break;
            }
            // update expression array
            array[i+1]["value"] = result;
            array.splice(i-1, 2);
            // loop from the beginning again
            i = 0;
          }
        }
      });

      // check for overall-final result
      const isResultFinal = array.length===1 && array[0]["type"]==='OPERAND';
      // run when result is final
      if (isResultFinal) {
        // store result data
        const finalResult = array[0]["value"];
        RESULT.value = finalResult;
        RESULT.type = 'NUMERIC';
        // empty expression array, input, component for the next calculation
        EXPRESSION.arr = [];
        COMPONENT.value = null;
        COMPONENT.type = null;
        INPUT.value = null;
        INPUT.type = null;
      }
    }) ();

    // manage decimal figures of the result
    (function() {
      const result = RESULT.value;
      // round off result to four decimal figures
      const roundedResult = Math.round(result * 10000) / 10000;
      RESULT.value = roundedResult;
      // console
      window.console.log('\tdecimal-round-off:', RESULT.value, '\tinitial:', result);
    }) ();

    // REFLECT SOLVED EXPRESSION, RESULT TO DISPLAY
    (function() {
      const completeEquation = `${EXPRESSION.str} = ${RESULT.value}`;
      // updating these data references below reflect to display
      DISPLAY.row1 = completeEquation;
      // the COMPONENT is later used for including the result to start another expression
      DISPLAY.row2 = RESULT.value;
      // console: DISPLAY
      window.console.log(
        'DISPLAY',
        '\tROW1:', DISPLAY.row1,
        '\tROW2:', DISPLAY.row2
      );
    }) ();
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
    // calculate
    get.calculation(DATA);
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
  "calculation" : simplifyExpression,
}
