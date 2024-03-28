

/** Identify input
 * @parameter String : from user-input
 * @return String : NUMBER, OPERATOR, EQUALS, CLEAR
 */
const identifyType = (input) => {
	// store type
	let type = null;
	// type conditions
	if (/^[x/+-]$/.test(input)) type = 'OPERATOR';
	else if (/^\-?[0-9]*\.?[0-9]*$/.test(input)) type = 'NUMBER';
	else if (input === '=') type = 'EQUALS';
	else if (input === 'AC') type = 'CLEAR';
	// console
	// window.console.log('USERINPUT', '\tvalue:', input, '\ttype:', type);
	// return
	return type;
};


/** Use or non-use of previous calculation result
 * @parameter array, number: expression array, previous result value
 * 
 * Previous result is used when:
 * a. there exists a previous result in the expression array, and
 * b. the new expression started with an OPERATOR input.
 * 
 * After the follow-up input, the expression array is restarted.
 * Only the result inclusion/non-inclusion, follow-up input remains.
 * 
 * @return array: [updated array, result is reset to null]
 */
const usePrevResult = (expression) => {
	// references
	let array = [...expression];
	const latestIndex = array.length - 1;

	// Boolean: check if there is a result from previous calculation, the presence of the 'EQUALS' sign
	const isPrevResultCalculated = array[latestIndex-2] === '=';
	// execute when above is true
	if (isPrevResultCalculated) {
		// Boolean: check if expression starts with an operator
		const isOperator = identifyType(array[latestIndex]) === 'OPERATOR';
		// include result to start expression when conditions are true: '2' includes result, '1' does not
		const startExp = isOperator ? 2 : 1;
		// start expression with necessary parts only: result(by condition),  follow-up input
		array = array.slice(array.length - startExp);
	}
	
	// console
	window.console.log('\tonResult:', array);
	// return
	return array;
};


/** Collate NUMBER and OPERATOR inputs.
 * @parameter Array: the expression array
 * 
 * 1. Parse expression array to provide a correct collection of NUMBERS and OPERATORS
 *    for a valid math expression.
 * 2. Anticipate for 'Infinity' and 'Nan' from previous result.
 * 3. According to conditions, the subtraction OPERATOR is integrated to a 
 * 	  NUMBER to form a negative NUMBER.
 * 
 * @return Array: an updated expression sequence
 */
const collateNumberOperator = (expression) => {
	// reference
	let array = [...expression];

	/** PARSE  SEQUENCE OF NUMBER AND OPERATOR INPUTS
	 * 1. Outputs a correct numeric syntax.
	 * 2. Outputs which latest OPERATOR input is validated with anticipation
	 * 	  of using the subtraction operator as a negative sign.
	 */
	(function() {
		// array latest index access
		const li = array.length - 1;
		
		// identify type of latest input in expression
		const inputType = identifyType(array[li]) === 'NUMBER' ? 'NUMBER' : 'OPERATOR';
		
		/** validate the successive NUMBER input
		 * 1. Can start with only one zero.
		 * 2. Whole numbers will replace the starting zero.
		 */
		if (inputType==='NUMBER') {
			// check if previous input is NUMBER
			const isPrevNumeric = array.length > 1 ? (identifyType(array[li-1]) === 'NUMBER' ? true : false) : false;
			//  when true: combine the numeric inputs
			let numericInput = isPrevNumeric ? array[li-1] + array[li] : array[li];
			window.console.log('\tprev number:', isPrevNumeric, numericInput);

			if (isPrevNumeric) {
				// test for correct numeric terms
				const isNumeric = /^\-?[0-9]+\.?[0-9]*$/.test(numericInput);
				// test if contains decimals
				const hasDecimal = /\./.test(numericInput);
				window.console.log('\thasDecimal:', hasDecimal, numericInput); 

				// when succeeding input/s are numeric
				if (isNumeric) {
					// no parseFloat validation when succeeding input/s have decimal
					numericInput = hasDecimal ? numericInput : parseFloat(numericInput);
					// update changes to array
					array.splice(li-1, 2, numericInput);
				}
				else array.pop();
			}
			// when first numeric input is decimal point
			else if (numericInput === '.') {
				array[li] = '0.';
			}			
		} 
		/** validate the successive OPERATOR input
			 * RULES:
			 * 1. Only the latest succeeding OPERATOR is valid unless it is a 
			 *    subtraction OPERATOR.
			 * 	  example: 1A.) 'x +' => '+' , 1B.) '+ -' => '+ -'
			 * 2. When rule 1b is true and is succeeded by another operator, only that latest
			 * 	  single operator is kept.
			 *    example: '+ - /' => '/'
			 */
		else if (inputType==='OPERATOR' && array.length>1) {
			// Boolean conditions for rules 1a, 1b, and 2
			const isRule1A = identifyType(array[li-1])==='OPERATOR' && identifyType(array[li])==='OPERATOR';
			const isRule1B = identifyType(array[li-1])==='OPERATOR' && array[li]==='-';
			const isRule2 = array.length>2 ? 
					(identifyType(array[li-2])==='OPERATOR' && array[li-1]==='-' && identifyType(array[li])==='OPERATOR' ? true : false)
				: false;
			// window.console.log(isRule1A, isRule1B, isRule2);
			// implement rules
			if (isRule2) array.splice(li-2, 2);
			else if (isRule1A && !isRule1B) array.splice(li-1, 1);
		}
	}) ();

	/** NEGATIVE SIGN INTEGRATION
	 * 1. When the NUMBER follows a subtraction operator; and
	 * 2. When that subtraction operator is the first input in the
	 * 	  expression, or follows an operator in the sequence.
	 */
	(function() {
		// runs when there is two inputs in the array
		if (array.length >= 2) {
			// array latest index
			const li = array.length - 1;

			// condition 1
			const isPrevInputSubtractionOperator = array[li-1]==='-' && identifyType(array[li])==='NUMBER';
			// condition 2
			const doesCondition1FollowsAnOperator = array.length > 2 ? (isPrevInputSubtractionOperator && identifyType(array[li-2])==='OPERATOR' ? true : false) : false;

			/** Conditional output: implement negative integration
			 * There are two conditions separated by the OR '||',
			 * 	1. the subtraction operator as first input in the array,
			 *  2. the subtraction operator follows another operator in the middle of the 
			 * 	   expression.
			 */
			if ((array.length===2 && isPrevInputSubtractionOperator) || doesCondition1FollowsAnOperator) {
				// combine the NUMBER to the previous subtraction operator
				array[li-1] += array[li];
				// remove the NUMBER without the negative sign at the array's last index
				array.pop();
			}
		}
	}) ();

	/** VALIDATE EXPRESSION SEQUENCE
	 * 1. The expression can only start with a NUMBER.
	 */
	(function() {
		if (array.length === 2) {
			// latest array index
			const li = array.length - 1;

			// check for correct start of expression
			const isCorrect = identifyType(array[0])==='NUMBER' || array[0]==='-';
			// remove OPERATOR inputs at the start of the expression
			if (!isCorrect) array.shift();
		}
	}) ();

	// console
	window.console.log('\tcollated:', array);

	// return
	return array;
};


/** VALIDATE EXPRESSION SEQUENCE
 	 * @parameter Array: calculator expression
 	 * 
	 * 1. The expression can only start with a NUMBER.
	 * 2. Before calculation, the expression can only end with a NUMBER.
	 * 3. ParseFloat-validate NUMBERs when followed up by OPERATORs or non-NUMBERs.
	 * 
	 * @return Array: updated change for the calculator expression.
	 */
const validateExpression = (expression) => {
	// copy expression
	const array = [...expression];

	// Validate at the start of expression
	if (array.length === 2) {
		// latest array index
		const li = array.length - 1;

		// check for correct start of expression
		const isCorrect = identifyType(array[0])!=='OPERATOR' || array[0]==='-';
		// remove OPERATOR inputs at the start of the expression
		if (!isCorrect) array.shift();
	}
	// Validate at the end before calculation
	else if (array[array.length-1] === '=') {
		// access array latest index
		const li = array.length - 1;

		// count for how many operators at the end
		let count = identifyType(array[li-1])==='OPERATOR' ? 1 : 0;
		count = count && identifyType(array[li-2])==='OPERATOR' ? 2 : count;

		// remove OPERATORs at the end of expression when there is a count
		if (count) array.splice(array.length - (count+1), count);
		window.console.log('\tprecalculation:', '\tcount:', count);
	}

	/** parseFloat completed NUMBERs 
	 	* 1. Only the NUMBERs that are completed inputs (followed by OPERATORs
	 	*    or non-NUMBERs).
	 	* 2. When there are -0s they are validated to 0s.
	 	*/
	const arr = array.map((e, i, arr) => {
		// avoid parseFloating presumably developing NUMBER input (the latest element)
		const element = identifyType(e)==='NUMBER' && i<arr.length-1 ? parseFloat(e) : e;
		// correct -0s to 0
		return element === -0 ? 0 : element;
	});
	// update array
	array.splice(0, array.length, ...arr);

	// console
	window.console.log('\tvalidated:', array);

	// return
	return array;
};


/** CALCULATING THE ANSWER OF THE EXPRESSION
 	* @parameter Array : math expression
 	*  
 	* 1. Use the MDAS rule for applying math operations inputted in the expression.
 	* 2. Manage decimal figures' precision to at least to 4 digits.
 	* 3. Append the answer/result to the end of the expression when done.
 	* 
 	* @return Array : A math 'equation'. The expression is completed with a result.
 	*/
const calculateExpression = (expression) => {
	// calculator expression
	// const array = [...expression];
	const array = expression.filter(e => e !== '=');

	// apply MDAS
	['x', '/', '+', '-'].forEach(mdas => {

		// identify/seek math operation in the expression
		let i = null;
		for (i=0; i<array.length; i++) {

			// check for MDAS match in the expression OPERATOR
			const operator = array[i];
			const isMDASMatch = mdas === operator;
			// when there is a match
			if (isMDASMatch) {
				window.console.log('\toperator:', operator, '\tindex:', i);
				// reference NUMBERS for operation
				const num1 = array[i-1];
				const num2 = array[i+1];
				// store result of operation
				let result = null;

				// apply the operation according to matching operator and operands
				switch (mdas) {
					case 'x' : result = num1 * num2; break;
					case '/' : result = num1 / num2; break;
					case '+' : result = num1 + num2; break;
					case '-' : result = num1 - num2; break;
				}

				// update simplified changes to expression array
				array.splice(i-1, 3, result);

				// seek through the updated expression array again from the start
				i = 0;

				// console
				window.console.log('\tresult:', result, '\t', array);
			}
		}
	});

	// manage decimal precision
	const precision = Math.round(array[0] * 10000) / 10000;
	array.splice(0, 1, precision);


	// console
	window.console.log('\tresult:', array);
	// return
	return array;
};




/** MAIN FUNCTION
 * @parameter Array	 : EXPRESSION is state - collect only, do not mutate.
 * @paremeter String : USERINPUT is user-mouse-input - collect only.
 *
 * 1. Collect expression state.
 * 2. Collect input. Identify input.
 * 3. Perform tasks:
 * 		- Form an expression.
 * 		- Calculate the expression.
 * 		- Reset the calculator.
 *
 * @return Array : the updated math expression.
 */
export default function runCalculator(EXPRESSION, USERINPUT) {
	// REFERENCES
	// parameters
	let expression = [...EXPRESSION]
	const input = USERINPUT;

	// CALCULATOR TASKS
	// identify input type
	const inputType = identifyType(input);
	// Task A: forming an expression
	if (inputType==='NUMBER' || inputType==='OPERATOR') {

		// step 1: store input to the expression array
		expression.push(input);
		window.console.log('\tconcat input:', expression);

		// step 2: result inclusion or non-inclusion
		expression = usePrevResult(expression);

		// step 3: collate inputs
		expression = collateNumberOperator(expression);

		// step 4: validate expression
		expression = validateExpression(expression);
	}
	// Task B: calculating the expression
	else if (inputType === 'EQUALS') {

		// anti-spam condition
		const isNoEquals = !/[=]/.test(expression.join(''));

		if (isNoEquals) {
			// step 1: append the '=' sign
			expression.push('=');
		
			// step 2: final validation to the expression
			expression = validateExpression(expression);

			// step 3: calculate the answer
			const result = calculateExpression(expression);

			// step 4: append result to expression
			expression = expression.concat(result);
		}	
	}
	// Task C: reset the calculator data
	else if (inputType === 'CLEAR') {
		// empties the expression array
		expression = [];
		// clears the console
		window.console.clear();
	}

	// console
	window.console.log('CALCULATOR', expression);
	// return
	return expression;
}
