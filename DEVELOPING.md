
# HTML Entities
HTML entities are used for best practice.


# The Calculator App
##### The app is mainly divided into two parts:
- Display
- Input buttons: numbers, operators, clear, equals.

##### The flow of functionality:
1. The calculator will **display** properly syntaxed user-input(mouse event) through buttons.
1. The calculator will validate for a proper **arithmetic mathematical expression**.
1. The calculator will **store** and **identify** the elements within the mathematical expression.
1. The **clear-functionality** reverts to the calculator's initial state.
1. The **equals-functionality** provides the answer to the mathematical expression.
1. The calculator will process mathematical expressions following **MDAS** rule.

##### Calculator Number syntax:
1. Validate for the negative symbol.
1. Validate for only one zero at the start of the digit in anticipation of a decimal point.
1. Validate for optional input of whole numbers before the decimal point, replaces the starting zero.
1. Validate for decimal figures after the decimal point.
1. The validated and collected *numeric* inputs are stored as a single mathematical element in between *operators* within the mathematical expression.


# useRef and useState for Performance
- useRef vs useState: [reference](https://medium.com/web-development-with-sumit/useref-vs-usestate-in-react-330539025245#:~:text=serve%20different%20purposes.-,useRef%20is%20primarily%20used%20to%20access%20and%20manipulate%20the%20DOM,renders%20when%20the%20state%20updates.)
- efficient use of useState and useRef: [reference](https://medium.com/@rishavjaiss14/common-mistakes-react-developers-make-usestate-or-useref-76bca3903a80)


# Styling
The app is styled for smaller mobile device first.

- Fallback font family: [reference](https://granneman.com/webdev/coding/css/fonts-and-formatting/web-browser-font-defaults)