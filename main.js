let value1;
let value2;
const count = 50;
const inputElement = document.querySelector("#input");
const inputElement2 = document.querySelector("#input2");
const inputElement3 = document.querySelector("#input3");
const inputElement4 = document.querySelector("#input4");
const outputElement = document.querySelector("#output");
// const envElement = document.querySelector("#env");
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
      if (a === undefined || a === NaN) return 0 - b;
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
    if (a <= 0 || b <= 0 || a == 1) {
      return;
    }
    return Math.log(b) / Math.log(a);
  }
  throw new Error(`Undefined function: ${func}`);
}

function evaluate(input) {
  return evalRPN(toRPN(tokenize(input)));
}

submitBtn.onclick = () => {
  if (inputElement2.value === "E") {
    environment.X = Math.E;
  } else if (inputElement2.value === "PI") {
    environment.X = Math.PI;
  } else {
    environment.X = inputElement2.value * 1;
  }
  // && evaluate(inputElement.value) !== 0

  if (
    !Number.isFinite(evaluate(inputElement.value)) ||
    evaluate(inputElement.value) === undefined
  ) {
    outputElement.innerText = "Kiểm tra lại giá trị đầu vào";
  } else {
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

function fitnessFunction(x) {
  environment.X = x;
  let result = evaluate(inputElement.value);
  if (!result && result != 0) {
    return 1000;
  }
  return Math.abs(result);
}

// Generate initial population
function generateInitialPopulation(populationSize) {
  let population = [];
  for (let i = 0; i < populationSize; i++) {
    // Generate random solutions as initial population
    population.push(value1 + Math.random() * (value2 - value1));
  }
  return population;
}

// Selection: Choose parents based on fitness
function selection(population) {
  population.sort((a, b) => fitnessFunction(a) - fitnessFunction(b));
  return population.slice(0, count);
}

// Crossover: Breed new individuals from parents
function crossover(parent1, parent2) {
  return (parent1 + parent2) / 2;
}

// Mutation: Introduce random changes to maintain diversity
function mutation(individual) {
  return individual + Math.random() * 0.000002 - 0.000001;
}

// Genetic algorith
function geneticAlgorithm() {
  const populationSize = 500 + Math.round(Math.abs(value2 - value1));
  let population = generateInitialPopulation(populationSize);
  let parent = selection(population);

  let i = 0;
  while (fitnessFunction(parent[0]) > 1.0e-12) {
    i++;
    for (let j = 0; j < count - 1; j++) {
      for (let k = j + 1; k < count; k++) {
        let x = crossover(parent[j], parent[k]);
        x = mutation(x);
        parent.push(x);
      }
    }
    parent = selection(parent);
    outputElement.innerHTML = `${outputElement.innerHTML} Nghiệm tốt nhất thế hệ ${i} là ${parent[0]} <br/>`;
    if (i === 20) {
      break;
    }
  }

  return parent[0];
}

submitBtn2.onclick = function caculatorX() {
  outputElement.innerText = "";

  const result = geneticAlgorithm();

  if (fitnessFunction(result) > 1.0e-3) {
    outputElement.innerHTML = "Không tìm được nghiệm trong khoảng trên";
  } else {
    outputElement.innerHTML = `${outputElement.innerHTML} <br/> 
  Vậy nghiệm của phương trình là ${result.toFixed(7)} <br/>`;
  }
};
