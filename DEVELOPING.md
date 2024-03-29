
# Coding essentials
- App **functionality-flow** and **data management** must be mapped out completely before starting developing. Details must be specific and comprehensive.
- For **scalability**, pieces of functionality should be *pure, attachable*, and *detachable*.
- It is best practice to store/manage/access **app data** at one place (**global access** when possible) - this help mitigate complexity, overhead, maintenance, etc.
	- **Data structure** must be meaningful.
	- **Objects**: for defining data.
	- **Arrays**: for listing/classifying data.
- Use proper **naming** and **conventions** at the beginning: *state, ref, variable, function*.
- Understand the project: from the *overview* down to the *specifics*.
- Clean group of code right away for *readability/review* and *maintenance*.
- Use recommended **HTML entities**.


# The Calculator App
#### The app
1. The **`<App/>`** parent component:
	- Houses a *ref* for storing calculator data (an object), runs calculator functionalities.
	- Has *state* for rendering display.
1. The **`<Pad/>`** child component for collecting the **input**.
1. The **`<Display/>`** child component for display functionality.

#### The flow of functionality
1. **Captures** the mouse *event* - collecting the input value.
1. Defines the **type** of the single character input: *clear, equals, operand, operator*.
1. Run **functionalities** dependent on mouse input: 
	- Form a validated expression.
		1. Validate the *operand* input. The *operator* input does not need validation.
		1. Store individual input into an *array*
		1. Validate the sequence of the expression.
			- Expressions start and end with an *operand*.
			- There is a single *operator* in between *operands*.
			- The subtraction operator can be used to indicate a *negative operand*.
			- Anticipates the use of previous calculation result to start the next expression.
		1. Reflect calculator activity onto the *display*.
		1. Prepare the calculator for another math expression.
			- empty the expression array.
	- Calculate result of the expression.
		- **Identify** operators in the collection.
		- **Simplify** the collection with MDAS until one numeric result remains.
		- The **result** can be used to start another expression.
	- Clear calculator data.

#### Data structure
1. The app data is housed within one **object** stored in a *ref* hook to store working data.
1. Top level data:
	- **"input"**, stores mouse input with properties:
		- **'value'**, a single character string.
		- **'type'**, the type of input: *operand, operator, clear, equals*.
	- **"component"**, store the collected valid single/group of 'key' with properties:
		- **'value'**, a string of 'key.char' inputs with similar 'key.type'.
		- **'type'**, specify the 'key.type': *operand, operator*.
	- **"expression"**, store the validated mathematical expression input, with properties:
		- **'str'**, a string representation of the 'expression'.
		- **'arr'**, an array of the collection of validated sequence of 'role'(operands and operators).
	- **"calculation**, store the result of the calculation process.
	- **"display**, stores the data to be displayed
		- **"row1"**, reflects the math expression
		- **"row2"**, reflects the user-input and calculation output


#### Mathematical expression syntax rules
1. **Starts** and **ends** with an *operand*.
1. In **between** the *operands* is a single *operator*.

#### Operand (numeric) syntax rules
1. Can start with a negative sign.
1. Can only start one zero.
1. Will insert a zero in between an input of a negative sign and a decimal point.
1. Whole numbers will replace a starting zero.
1. Will accept decimal figures.

#### Operator syntax rules
1. There can only be **one** *operator*.
	- The *subtraction* operator ( - ) is an exception in one case - it can be integrated to an *operand* to input a negative number. For example, '10 + - 2', The '2' will become '-2' when calculating the result.
1. The last *operator* inputted will be collected, except when it is the *subtraction* operator.
	- For example, a sequence of user input of '10 + - * 2', the final expression will be '10 * 2'.
	- Another example, '10 + * / - 2' will become '10 / -2'.

#### Equals functionality: "=" input
1. Expressions that end with an *operator* will be calculated without that *operator* - being removed.
1. Inputting an *operator* after the '=' will start a new expression starting from the *previous result*.


# Pure Functional Programming
- Array methods: [reference](https://stackoverflow.com/questions/65592288/which-functions-in-array-prototype-are-pure-function-in-javascript)

# useRef and useState for Performance
- useRef vs useState: [reference](https://medium.com/web-development-with-sumit/useref-vs-usestate-in-react-330539025245#:~:text=serve%20different%20purposes.-,useRef%20is%20primarily%20used%20to%20access%20and%20manipulate%20the%20DOM,renders%20when%20the%20state%20updates.)
- efficient use of useState and useRef: [reference](https://medium.com/@rishavjaiss14/common-mistakes-react-developers-make-usestate-or-useref-76bca3903a80)


# Styling
The app is styled for smaller mobile device first.

- Fallback font family: [reference](https://granneman.com/webdev/coding/css/fonts-and-formatting/web-browser-font-defaults)