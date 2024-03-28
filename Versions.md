# VERSION 3
Used **useRef** hook to store mutable calculator data with objects as data structure.

### The problem
- It does not pass the fCC test suite.







# VERSION 4
Will use the **useState** to store calculator data.

### React state essentials: updating array
1. Create a copy of the state's array. This will be used as an argument passed into the necessary functions to process.
1. Or, create a callback within the setState function.
[reference] (https://www.technetexperts.com/react-usestate-array-not-updating-a-common-problem-solved/)

### Information
- Arithmetic *expression/equation* (e.g., `'3 + 5 x 6 - 2 / 4'`), consists of:
	- *numbers*: positive and negative whole and/or decimal numbers,
	- *operators*: arithmetic operators and equals (`x, /, +, -`),
	- *equality* sign: `=`,
	- *result* value: a single value equal simplification of terms by arithmetic operation.
### Data
- *Array* for the arithmetic expression.
	- *String* elements, the *numbers* and *operators*.
- *Variable* holds the *result* value.
### State / prop
- *expression* state for updating expression
- *display* prop - contains the value of the *expression* state, for rendering display:
	- displays the inputted *expression* and the complete *equation*,
	- displays the latest component *(number, operator, result)* within the `#display` element.
### Logic of functionality
1. Capture mouse-input.
1. Identify the applicable task:
	- **Form**an expression: numbers & operators.
	- **Complete** / **simplify** the expression, **calculate** the result: equals operator.
	- **Clear** / **reset** the calculator data.
### Calculator tasks
- **Expression**:
	1. Store input into the *array*.
	1. *Inclusion / non-inclusion* of the previous calculation result to start the *expression*.
		1. access the *result* in the expression array, expect valuse like 'Infinity' and 'NaN'.
		1. restart the *expression* array for a new expression.
	1. *Validate* for the correct sequence of *expression*.
	1. By condition(s), *integrate a negative sign* to numbers.
- **Calculation**:
	1. Necessary *correction* to the expression before calculation.
	1. *Calculate result* using MDAS rule.
	1. Manage precision of result's decimal figures not less than four digits.
- **Clear**: resets the *expression* state to its initial state.

