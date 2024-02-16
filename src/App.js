import React, { useState } from 'react';
import './App.css';
import InputButton from './InputButton';
import InputType from './InputTypes';

const DIVISION = String.fromCharCode(0x00F7);
const PLUSORMINUS = String.fromCharCode(0x207A)+ String.fromCharCode(0x2215) + String.fromCharCode(0x208B);

const defaultEquation = {
  equInputs: [],
  lastInput: InputType.EMPTY,
  parenthesisL: 0,
  parenthesisR: 0,
  equString: ""
};

function App() {

  const [equation, setEquation] = useState(defaultEquation);

  function clearEquation() {
    setEquation({
      equInputs: [],
      lastInput: InputType.EMPTY,
      parenthesisL: 0,
      parenthesisR: 0,
      equString: ""
    });
  }

  function input(value, type) {
    let updatedEquation;

    switch (type) {
      case InputType.DIGIT:
        updatedEquation = inputDigit(value, equation);
        break;
      case InputType.PARENTHESIS:
        updatedEquation = inputParenthesis(equation);
        break;
      case InputType.OPERATOR: 
        updatedEquation = inputOperator(value, equation);
        break;
      case InputType.DECIMAL:
        updatedEquation = inputDecimal(value, equation);
        break;
      case InputType.NEGATIVE:
        updatedEquation = inputNegative(equation);
        break;
      case InputType.EXPONENT:
        updatedEquation = inputExponent(equation);
        break;
      default:
        break;
    }

    setEquation({
      equInputs : updatedEquation.equInputs,
      lastInput: updatedEquation.lastInput,
      parenthesisL: updatedEquation.parenthesisL,
      parenthesisR: updatedEquation.parenthesisR,
      equString: updatedEquation.equInputs.join(" ")
    });

  }

  function inputDigit(value, equation) {

    if (equation.lastInput === InputType.DIGIT || equation.lastInput === InputType.DECIMAL) {
      let index = equation.equInputs.length - 1;
      equation.equInputs[index] = equation.equInputs[index].concat(value);
    } else {
      equation.equInputs.push(value);
    }
    equation.lastInput = InputType.DIGIT;

    return equation;
    
  }

  function inputOperator(value, equation) {

    if (equation.lastInput !== InputType.DIGIT) {
      alert("Invalid input");
      return equation;
    }

    equation.equInputs.push(value);
    equation.lastInput = InputType.OPERATOR;

    return equation;
  }

  function inputParenthesis(equation) {
    let parenthesisL = equation.parenthesisL;
    let parenthesisR = equation.parenthesisR;
    let lastInput = equation.lastInput;

    if (parenthesisL === parenthesisR && (lastInput === InputType.PARENTHESISR || lastInput === InputType.DIGIT)) {
      equation.equInputs.push("x");
      equation.equInputs.push("(");
      equation.lastInput = InputType.PARENTHESISL;
      equation.parenthesisL += 1;

    } else if (lastInput === InputType.EMPTY || lastInput === InputType.PARENTHESISL || lastInput === InputType.OPERATOR) {
      equation.equInputs.push("(");
      equation.lastInput = InputType.PARENTHESISL;
      equation.parenthesisL += 1;
    } else {
      equation.equInputs.push(")");
      equation.lastInput = InputType.PARENTHESISR;
      equation.parenthesisR += 1;
    }

    return equation;
    
  }

  function inputDecimal(value, equation) {
    if (equation.lastInput !== InputType.DIGIT) {
      equation.equInputs.push("0.");
    } else {
      let index = equation.equInputs.length - 1;
      equation.equInputs[index] = equation.equInputs[index].concat(value);
    }

    equation.lastInput = InputType.DECIMAL;

    return equation;
    
  }

  function inputNegative(equation) {
    
    if(equation.lastInput === InputType.DIGIT) {
      let index = equation.equInputs.length - 1;
      equation.equInputs[index] = String(equation.equInputs[index] * -1);

    } else {
      equation.equInputs.push("-");
      equation.lastInput = InputType.DIGIT;

    }

    return equation;

  }

  function inputExponent(equation) {
    if (equation.lastInput !== InputType.DIGIT) {
      alert("Invalid input");
      return equation;
    }
    equation.equInputs.push("^");
    equation.equInputs.push("(");
    equation.lastInput = InputType.PARENTHESISL;
    equation.parenthesisL += 1;

    return equation;
    
  }


  function evaluateTrigger() {
    let updatedEquation = evaluate(equation);
    console.log(updatedEquation);
    // Probably want to set lastInput to digit
    setEquation({
      equInputs : updatedEquation.equInputs,
      lastInput: updatedEquation.lastInput,
      parenthesisL: updatedEquation.parenthesisL,
      parenthesisR: updatedEquation.parenthesisR,
      equString: updatedEquation.equInputs.join(" ")
    });
    
  }

  function evaluate(equation) {
    // pemdas
    console.log("please let me pause here")
    equation = parenthesis(equation);
    equation = exponent(equation);
    equation = multiplication(equation);
    equation = division(equation);
    equation = addition(equation);
    equation = subtraction(equation);
    return equation;
  }

  function parenthesis(equation) {

    if (equation.parenthesisL === 0 && equation.parenthesisL === 0) {
      return equation;
    } 

    do {
      let start, end;
      [start, end] = getFirstPair(equation);
      console.log("start: ", start);
      console.log("end: ", end);
      // evaluate equation between the two
      console.log(equation.equInputs.slice(start,end+1));
      let tempEquation = {...equation};
      tempEquation.equInputs = equation.equInputs.slice(start + 1,end);
      [tempEquation.parenthesisL, tempEquation.parenthesisR] = parenthesisCount(tempEquation.equInputs);
      tempEquation.equString = tempEquation.equInputs.join(" ");

      let result = evaluate(tempEquation);
      equation.equInputs = equation.equInputs.slice(0, start).concat(result.equInputs).concat(equation.equInputs.slice(end + 1, equation.equInputs.length));
      [equation.parenthesisL, equation.parenthesisR] = parenthesisCount(equation.equInputs);
      equation.equString = equation.equInputs.join(" ");

    } while(equation.parenthesisL > 0);
    
    return equation;
 
  }

  function parenthesisCount(inputList) {
    let parenthesisL = 0, parenthesisR = 0;
    for (let i = 0; i < inputList.length; i++) {
      if(inputList[i] === "(") {
        parenthesisL++;
      }
      if(inputList[i] === ")") {
        parenthesisR++;
      }
    }

    return [parenthesisL, parenthesisR];

  }

  function getFirstPair(equation) {
    let pCount = {left: 0, right: 0};
    let start = equation.equInputs.findIndex((element) => element === "(");
    let end = -1;

    for (let i = start; i < equation.equInputs.length; i++) {
      if (equation.equInputs[i] === "(") {
        pCount.left++;
      }
      if (equation.equInputs[i] === ")") {
        pCount.right++;
      }
      if (pCount.left === pCount.right) {
        end = i;
        break;
      }
    }

    return [start, end];
    
  }

  function exponent(equation) {
    let inputs = equation.equInputs;

    while (inputs.includes("^")) {
      let index = inputs.indexOf("^");
      let soln = Math.pow(inputs[index-1],inputs[index+1]);
      inputs = inputs.slice(0, index-1).concat(soln).concat(inputs.slice(index+2, inputs.length))
    }

    equation.equInputs = inputs;
    equation.equString = inputs.join(" ");

    return equation;
  }

  function multiplication(equation) {

    let inputs = equation.equInputs;

    while (inputs.includes("x")) {
      let index = inputs.indexOf("x");
      let product = inputs[index-1] * inputs[index+1];
      inputs = inputs.slice(0, index-1).concat(product).concat(inputs.slice(index+2, inputs.length))
    }

    equation.equInputs = inputs;
    equation.equString = inputs.join(" ");

    return equation;
  }

  function division(equation) {

    let inputs = equation.equInputs;

    while (inputs.includes(DIVISION)) {
      let index = inputs.indexOf(DIVISION);
      let quotient = inputs[index-1] / inputs[index+1];
      inputs = inputs.slice(0, index-1).concat(quotient).concat(inputs.slice(index+2, inputs.length))
    }

    equation.equInputs = inputs;
    equation.equString = inputs.join(" ");

    return equation;
  }

  function addition(equation) {

    let inputs = equation.equInputs;
    
    while (inputs.includes("+")) {
      let index = inputs.indexOf("+");
      let sum = Number(inputs[index-1]) + Number(inputs[index+1]);
      inputs = inputs.slice(0, index-1).concat(sum).concat(inputs.slice(index+2, inputs.length))
    }

    equation.equInputs = inputs;
    equation.equString = inputs.join(" ");

    return equation;
  }

  function subtraction(equation) {

    let inputs = equation.equInputs;

    while (inputs.includes("-")) {
      let index = inputs.indexOf("-");
      let difference = inputs[index-1] - inputs[index+1];
      inputs = inputs.slice(0, index-1).concat(difference).concat(inputs.slice(index+2, inputs.length))
    }

    equation.equInputs = inputs;
    equation.equString = inputs.join(" ");

    return equation;
  }

  return (
    <div className="App">
      <h1>Calculator</h1>
      <h2 id="inputScreen" className="input-screen" >{equation.equString}</h2>
      <div className='input-selectors'>
        <button className="input-btn" onClick={clearEquation} >C</button>
        <InputButton onInputClick={input} value={"()"} type={InputType.PARENTHESIS} />
        <InputButton onInputClick={input} value={"^"} type={InputType.EXPONENT}/>
        <InputButton onInputClick={input} value={DIVISION} type={InputType.OPERATOR} />
        <InputButton onInputClick={input} value={"7"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value={"8"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value={"9"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value="x" type={InputType.OPERATOR}/>
        <InputButton onInputClick={input} value={"4"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value={"5"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value={"6"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value="-" type={InputType.OPERATOR}/>
        <InputButton onInputClick={input} value={"1"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value={"2"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value={"3"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value="+" type={InputType.OPERATOR}/>
        <InputButton onInputClick={input} value={PLUSORMINUS} type={InputType.NEGATIVE}/>
        <InputButton onInputClick={input} value={"0"} type={InputType.DIGIT}/>
        <InputButton onInputClick={input} value={"."} type={InputType.DECIMAL}/>
        <button className="input-btn submit" onClick={evaluateTrigger}>=</button>
      </div>

    </div>
  );
}

export default App;
