// NOTE:
// This is the starter file for a blog post "How to build a calculator". You can follow the lesson at https://zellwk.com/blog/calculator-part-1

// # START EDITING YOUR JAVASCRIPT HERE
// ===============

const calculate = (n1, operator, n2) => {
    const firstNum = parseFloat(n1);
    const secondNum = parseFloat(n2);
    if (operator === "add") return firstNum + secondNum;
    if (operator === "subtract") return firstNum - secondNum;
    if (operator === "multiply") return firstNum * secondNum;
    if (operator === "divide") return firstNum / secondNum;
};

const getKeyType = (key) => {
    const { action } = key.dataset;
    if (!action) return "number";
    if (
        action === "add" ||
        action === "subtract" ||
        action === "multiply" ||
        action === "divide"
    )
        return "operator";
    // For everything else, the action name and what it is is the same, no need to rephrase.
    return action;
};

const createResultString = (key, displayedNum, state) => {
    const keyContent = key.textContent;
    const firstValue = state.firstValue;
    const modValue = state.modValue;
    const operator = state.operator;
    const previousKeyType = state.previousKeyType;
    const keyType = getKeyType(key);

    if (keyType === "number") {
        return displayedNum === "0" ||
            previousKeyType === "operator" ||
            previousKeyType === "calculate"
            ? keyContent
            : displayedNum + keyContent; //concatenate, not addition
    }

    if (keyType === "decimal") {
        if (!displayedNum.includes(".")) return displayedNum + ".";
        if (previousKeyType === "operator" || previousKeyType === "calculate")
            return "0.";
        return displayedNum; //if it's already a decimal, so even if we hit "." again, it will return the same number.
    }

    if (keyType === "operator") {
        // *declare at the start already
        // const firstValue = calculator.dataset.firstValue;
        // const operator = calculator.dataset.operator;

        return firstValue &&
            operator &&
            previousKeyType !== "operator" &&
            previousKeyType !== "calculate"
            ? calculate(firstValue, operator, displayedNum)
            : displayedNum;
    }

    if (keyType === "clear") return 0;

    if (keyType === "calculate") {
        // *declare at the start already
        // const firstValue = calculator.dataset.firstValue;
        // const operator = calculator.dataset.operator;
        // const modValue = calculator.dataset.modValue; //store the secondValue fop future calculation when user press "="; how it works: result from first calculation will go into the firstVale of second calculation, and the second value will continue to calculate with the result which is now the firstValue. This is created to temporarily hold the secondValue
        return firstValue
            ? previousKeyType === "calculate"
                ? calculate(displayedNum, operator, modValue)
                : calculate(firstValue, operator, displayedNum)
            : displayedNum;
    }
};

const updateCalculatorState = (
    key,
    calculator,
    calculatedValue,
    displayedNum
) => {
    const keyType = getKeyType(key);
    // const firstValue = calculator.dataset.firstValue;
    // const operator = calculator.dataset.operator;
    // const previousKeyType = calculator.dataset.previousKeyType;
    // const modValue = calculator.dataset.modValue;
    // calculator.dataset.previousKeyType = keyType;
    //* use destructing oject instead of the above code:
    const { firstValue, operator, previousKeyType, modValue } =
        calculator.dataset;

    calculator.dataset.previousKeyType = keyType;

    if (keyType === "operator") {
        // code look similar to the above createResultString function, but it's not the same. This function is to manipulate the class of the key, while the above function is to calculate the result
        calculator.dataset.operator = key.dataset.action;
        calculator.dataset.firstValue =
            firstValue &&
            operator &&
            previousKeyType !== "operator" &&
            previousKeyType !== "calculate"
                ? calculatedValue
                : displayedNum;
    }

    if (keyType === "clear" && key.textContent === "AC") {
        // AC: All Clear; CE: Current Entry

        calculator.dataset.firstvalue = "";
        calculator.dataset.modValue = "";
        calculator.dataset.operator = "";
        calculator.dataset.previousKeyType = "";
        // we didn't mention secondValue because secondvalue = displayedNum, and displaedNum is already set to 0; look below.
    }

    if (keyType === "calculate") {
        calculator.dataset.modValue =
            firstValue && previousKeyType === "calculate"
                ? modValue
                : displayedNum;
    }
};

const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key);

    // Remove .is-depressed class from all keys
    // Put on top because we want to remove the class before adding it to the clicked key
    Array.from(key.parentNode.children).forEach((k) =>
        k.classList.remove("is-depressed")
    ); // Array.from() creates a new Array copy of the HTMLElement

    if (keyType === "operator") key.classList.add("is-depressed"); //.classList: we can manipulate the class of "key"

    if (keyType === "clear" && key.textContent !== "AC") {
        key.textContent = "AC";
    }

    if (keyType !== "clear") {
        const clearButton = calculator.querySelector("[data-action=clear]"); // querySelector works like you use ctrl+f to find element and select it, before you can manipulate it; cause even if it's there, you see it, you can't manipulate it unless you do the above.
        clearButton.textContent = "CE";
    }
};

const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".calculator__keys");
const display = document.querySelector(".calculator__display");

keys.addEventListener("click", (e) => {
    if (!e.target.matches("button")) return;
    // e.target is the any clicked "keys"; does it match "button"?
    const key = e.target; //e.target = <button> element HTML
    const displayedNum = display.textContent;
    const resultString = createResultString(
        key,
        displayedNum,
        calculator.dataset
    );

    display.textContent = resultString;

    updateCalculatorState(key, calculator, resultString, displayedNum);
    updateVisualState(key, calculator);
});
