let value1;
let value2;
let ketqua;
const inputElement = document.querySelector("#input");
const inputElement2 = document.querySelector("#input2");
const inputElement3 = document.querySelector("#input3");
const inputElement4 = document.querySelector("#input4");
const outputElement = document.querySelector("#output");
const envElement = document.querySelector("#env");
const submitBtn = document.querySelector(".submit-btn");
const submitBtn2 = document.querySelector(".submit-btn2");

const environment = {
  PI: Math.PI,
  E: Math.E,
  X: 0,
};

function tokenize(input) {
  let scanner = 0;
  const tokens = [];
  while (scanner < input.length) {
    const char = input[scanner];
    if (/[0-9]/.test(char)) {
      let digits = "";
      while (scanner < input.length && /[0-9\.]/.test(input[scanner])) {
        digits += input[scanner++];
      }
      const number = parseFloat(digits);
      tokens.push(number);
      continue;
    }
    if (/[+\-/*(),^<>=]/.test(char)) {
      tokens.push(char);
      scanner++;
      continue;
    }
    if (char === " ") {
      scanner++;
      continue;
    }
    if (/[A-Z]/.test(char)) {
      let name = "";
      while (scanner < input.length && /[A-Z]/.test(input[scanner])) {
        name += input[scanner++];
      }
      tokens.push(name);
      continue;
    }
    throw new Error(`Invalid token ${char} at position ${scanner}`);
  }

  return tokens;
}

function toRPN(tokens) {
  const operators = [];
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (typeof token === "number" || /^[X-Z]/.test(token)) {
      out.push(token);
      continue;
    }
    if (/[+\-/*<>=^A-Z]/.test(token)) {
      while (shouldUnwindOperatorStack(operators, token)) {
        out.push(operators.pop());
      }
      operators.push(token);
      continue;
    }
    if (token === "(") {
      operators.push(token);
      continue;
    }
    if (token === ")") {
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        out.push(operators.pop());
      }
      operators.pop();
      continue;
    }
    if (token === ",") {
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        out.push(operators.pop());
      }
      continue;
    }
    throw new Error(`Invalid token ${token}`);
  }
  for (let i = operators.length - 1; i >= 0; i--) {
    out.push(operators[i]);
  }
  return out;
}

const precedence = {
  "^": 3,
  "*": 2,
  "/": 2,
  "+": 1,
  "-": 1,
};

function shouldUnwindOperatorStack(operators, nextToken) {
  if (operators.length === 0) {
    return false;
  }

  const lastOperator = operators[operators.length - 1];
  return (
    /[A-Z]/.test(lastOperator) ||
    (precedence[lastOperator] &&
      precedence[lastOperator] >= precedence[nextToken])
  );
}

function evalRPN(rpn) {
  const stack = [];

  for (let i = 0; i < rpn.length; i++) {
    const token = rpn[i];
    if (/[+\-/*^<>=]/.test(token)) {
      stack.push(operate(token, stack));
      continue;
    }
    if (/X|PI|E/.test(token)) {
      const value = environment[token];
      if (value === undefined) {
        throw new Error(`${token} is undefined`);
      }
      stack.push(value);
      continue;
    }
    if (/^[A-Z]/.test(token)) {
      stack.push(apply(token, stack));
      continue;
    }
    if (typeof token === "number") {
      stack.push(token);
      continue;
    }
    throw new Error(`Invalid token ${token}`);
  }
  return stack.pop();
}

function operate(operator, stack) {
  const b = stack.pop();
  const a = stack.pop();

  switch (operator) {
    case "+":
      return a + b;
    case "-": {
      if (a === undefined) return 0 - b;
      return a - b;
    }
    case "*":
      return a * b;
    case "/":
      return a / b;
    case "^":
      return Math.pow(a, b);
    case "<":
      return a < b;
    case ">":
      return a > b;
    case "=":
      return a === b;
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}

function apply(func, stack) {
  if (func === "SQRT") {
    const a = stack.pop();
    return Math.sqrt(a);
  }

  if (func === "COS") {
    const a = stack.pop();
    return Math.cos(a);
  }

  if (func === "SIN") {
    const a = stack.pop();
    return Math.sin(a);
  }

  if (func === "TAN") {
    const a = stack.pop();
    return Math.tan(a);
  }

  if (func === "COT") {
    const a = stack.pop();
    return 1 / Math.tan(a);
  }

  if (func === "LOG") {
    const b = stack.pop();
    const a = stack.pop();
    if((a<=0)||(b<=0)||(a==1)){
      // outputElement.innerText='Kiểm '
     
      return;
    }
    return Math.log(b) / Math.log(a);
  }
  throw new Error(`Undefined function: ${func}`);
}

function evaluate(input) {
  return evalRPN(toRPN(tokenize(input)));
}




function bisection(a, b, tol) {
  
  environment.X=a;
  let m =evaluate(inputElement.value)
  environment.X=b;
  let p =evaluate(inputElement.value)
  if(m*p>=0){
    
    return;
  }
  let c = a;
  while (b - a >= tol) {
    c = (a + b) / 2;
 
  environment.X=c;
  let n =evaluate(inputElement.value)
    if (n === 0) break;
    else if (m*n < 0) b = c;
    else a = c;
  }
  environment.X=c;
  if(evaluate(inputElement.value)>1){
    return;
  }
  return c;
}

submitBtn.onclick = () => {
  if(inputElement2.value==='E'){
    environment.X=Math.E;

  }
  else if(inputElement2.value==='PI'){
    environment.X=Math.PI;
  }
 
  else {
    environment.X = inputElement2.value * 1 ;
  }

 if(!evaluate(inputElement.value)){
  outputElement.innerText= 'Kiểm tra lại giá trị đầu vào'
 }
 else {
  outputElement.innerText = `Giá trị của biểu thức là: ${evaluate(
    inputElement.value
  ).toFixed(7)} `;
 }
  
};

inputElement3.onchange = (event) => {
  value1 = event.target.value * 1;
};

inputElement4.onchange = (event) => {
  value2 = event.target.value * 1;
};
submitBtn2.onclick = function caculatorX() {
  let step = 1 / 256;
  environment.X= value1 ;
  // let valueBegin = evaluate(inputElement.value);

  // if (valueBegin === 0) {
  //   outputElement.innerText = `Nghiệm của phương trình là X1 =${value1}`;
  // }
  for (let i = value1; i < value2; i += step) {
   
    environment.X = i;
    let stampValue = evaluate(inputElement.value);
  
    environment.X= i+step;
    let stampValue2 = evaluate(inputElement.value);
   
  
    if (stampValue === 0) {
      outputElement.innerText = `Nghiệm của phương trình là X= ${i}`;
      return;
    } else if (stampValue2 * stampValue < 0) {
      ketqua = bisection(i, i+step, 0.000000000001);
      if(ketqua===undefined){
        continue;
      }
      outputElement.innerText = `Nghiệm của phương trình là X= ${ketqua.toFixed(7)}`;
      return;
    
  }
  outputElement.innerText = "Không tìm được nghiệm trong khoảng trên";
}
}


