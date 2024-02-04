class AFD {
  static validateStepState = {
    PASS: 0,
    NOT_VALIDATED: -1,
    VALIDATED: 1,
  };

  constructor(alphabet, initialState, finalStates, transitions, states) {
    this._char = "";
    this._alphabet = alphabet;
    this._initialState = initialState;
    this._currentState = initialState;
    this._finalStates = finalStates;
    this._transitions = transitions;
    this._states = states;
  }

  get currentState() {
    return this._currentState;
  }

  get initialState() {
    return this._initialState;
  }

  get finalStates() {
    return this._finalStates;
  }

  get transitions() {
    return this._transitions;
  }

  set char(char) {
    this._char = char;
  }

  setCurrentState(state) {
    this._currentState = state;
    this._currentState.isActive = true;
  }

  validateString(string) {
    this.setCurrentState(this._initialState);
    let lastValidTransitionLabel = null;

    for (let i = 0; i < string.length; i++) {
      let char = string[i];

      if (this.inAlphabet(char)) {
        let transitionFound = false;

        for (let t = 0; t < this._currentState.transitions.length; t++) {
          let transition = this._currentState.transitions[t];

          if (transition.hasValue(char)) {
            this.setCurrentState(transition.toNode);
            transitionFound = true;
            lastValidTransitionLabel = transition.label; // Store the label of the last valid transition
            break;
          }
        }

        if (!transitionFound) {
          return {
            isValid: false,
            invalidChar: char,
            lastValidTransitionLabel,
          };
        }
      } else {
        return {
          isValid: false,
          invalidChar: char,
          lastValidTransitionLabel,
        };
      }
    }

    return {
      isValid: this._currentState.isFinal,
      invalidChar: null,
      lastValidTransitionLabel,
    };
  }

  inAlphabet(char) {
    const lowerCaseChar = char.toLowerCase();
    for (let i = 0; i < this._alphabet.length; i++) {
      if (this._alphabet[i].includes(lowerCaseChar)) {
        return true;
      }
    }
    return false;
  }
}

class AFDNode {
  constructor(name, isInitial, isFinal, transitions) {
    this._isActive = false;
    this._name = name;
    this._isInitial = isInitial;
    this._isFinal = isFinal;
    this._transitions = transitions;
  }

  set isActive(bool) {
    this._isActive = bool;
  }

  get name() {
    return this._name;
  }

  get isInitial() {
    return this._isInitial;
  }

  get isFinal() {
    return this._isFinal;
  }

  get transitions() {
    return this._transitions;
  }

  set transitions(transitions) {
    this._transitions = transitions;
  }
}

class AFDTransition {
  constructor(fromNode, toNode, values, label) {
    this._fromNode = fromNode;
    this._toNode = toNode;
    this._values = values;
    this.label = label;
  }

  get toNode() {
    return this._toNode;
  }

  hasValue(char) {
    for (let i = 0; i < this._values.length; i++) {
      if (char === this._values[i]) {
        return true;
      }
    }
    return false;
  }
}

class AutomataBuilder {
  lowerCaseCharacters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  upperCaseCharacters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  specialCharacters = ["-", "_", "."];

  at = ["@"];

  dot = ["."];

  // Updated alphabet to include characters for email validation
  alphabet = this.lowerCaseCharacters.concat(
    this.upperCaseCharacters,
    this.digits,
    this.specialCharacters,
    this.at,
    this.dot
  );

  // Updated states and transitions for email validation
  node1 = new AFDNode("q1", true, false, []);
  node2 = new AFDNode("q2", false, false, []);
  node3 = new AFDNode("q3", false, false, []);
  node4 = new AFDNode("q4", false, false, []);
  node5 = new AFDNode("q5", false, false, []);
  node6 = new AFDNode("q6", false, true, []); // Updated to not be a final state

  transition12 = new AFDTransition(
    this.node1,
    this.node2,
    this.lowerCaseCharacters.concat(this.upperCaseCharacters, this.digits),
    "transition12"
  );
  transition22 = new AFDTransition(
    this.node2,
    this.node2,
    this.lowerCaseCharacters.concat(
      this.upperCaseCharacters,
      this.digits,
      this.specialCharacters
    ),
    "transition22"
  );
  transition23 = new AFDTransition(
    this.node2,
    this.node3,
    this.at,
    "transition23"
  );
  transition34 = new AFDTransition(
    this.node3,
    this.node4,
    this.lowerCaseCharacters.concat(this.upperCaseCharacters),
    "transition34"
  );
  transition44 = new AFDTransition(
    this.node4,
    this.node4,
    this.lowerCaseCharacters.concat(this.upperCaseCharacters),
    "transition44"
  );
  transition45 = new AFDTransition(
    this.node4,
    this.node5,
    this.dot,
    "transition45"
  );
  transition56 = new AFDTransition(
    this.node5,
    this.node6,
    this.lowerCaseCharacters,
    "transition56"
  );
  transition66 = new AFDTransition(
    this.node6,
    this.node6,
    this.lowerCaseCharacters,
    "transition66"
  );

  constructor() {
    this._states = [
      this.node1,
      this.node2,
      this.node3,
      this.node4,
      this.node5,
      this.node6,
    ];

    this._transitions = [
      this.transition12,
      this.transition22,
      this.transition23,
      this.transition34,
      this.transition44,
      this.transition45,
      this.transition56,
      this.transition66,
    ];

    this.mapTransitions();
  }

  get states() {
    return this._states;
  }

  get transitions() {
    return this._transitions;
  }

  mapTransitions() {
    this.node1.transitions = [this.transitions[0]];
    this.node2.transitions = [this.transitions[1], this.transitions[2]];
    this.node3.transitions = [this.transitions[3]];
    this.node4.transitions = [this.transitions[4], this.transitions[5]];
    this.node5.transitions = [this.transitions[6]];
    this.node6.transitions = [this.transitions[7]];
  }

  getLastValidTransition() {
    return this._transitions.find(
      (transition) => transition.toNode === this._currentState
    );
  }
}

const emailInput = document.getElementById("emailInput");
const resultElement = document.getElementById("result");

emailInput.addEventListener("input", validateEmail);

let ab = new AutomataBuilder();
let afd = new AFD(
  ab.alphabet,
  ab.states[0],
  ab.states[0],
  ab.transitions,
  ab.states
);

function validateEmail() {
  const email = emailInput.value;
  const validationResult = afd.validateString(email);

  if (validationResult.isValid) {
    validEmail(email);
  } else {
    const invalidChar = validationResult.invalidChar;
    const lastValidTransitionLabel = validationResult.lastValidTransitionLabel;

    console.log("Last Valid Transition Label:", lastValidTransitionLabel);

    let INVALID_EMAIL_STRING = ""; // Declare the variable

    if (invalidChar != null) {
      INVALID_EMAIL_STRING = `Invalid character: ${invalidChar}`;
    } else if (lastValidTransitionLabel !== "") {
      const expectedChar = getExpectedCharacter(lastValidTransitionLabel);
      INVALID_EMAIL_STRING = `Expected character: ${expectedChar}`;
    } else {
      INVALID_EMAIL_STRING = `Invalid Email`;
    }

    invalidEmail(INVALID_EMAIL_STRING);
  }

  if (email.length === 0) {
    resultElement.style.color = ""; // Reset color
    resultElement.textContent = ""; // Clear content
    resultElement.classList.remove("invalid", "valid");
  }

  function getExpectedCharacter(lastValidTransitionLabel) {
    // Implement logic to determine the expected character based on the transition label
    switch (lastValidTransitionLabel) {
      case "transition12":
        return "a-z, A-Z, 0-9, special characters";
      case "transition22":
        return "@";
      case "transition23":
        return "a-z, A-Z";
      case "transition34":
        return "'.'";
      case "transition44":
        return "'.'";
      case "transition45":
        return "a-z, A-Z";
      case "transition56":
        return "a-z, A-Z";
      case "transition66":
        return "a-z, A-Z";
      default:
        console.log("Unknown transition label:", lastValidTransitionLabel);
        return " ";
    }
  }

  function invalidEmail(errorMessage) {
    resultElement.innerHTML = errorMessage;
    resultElement.classList.remove("valid");
    resultElement.classList.add("invalid");
    resultElement.style.display = "block";
  }

  function validEmail(email) {
    resultElement.innerHTML = `Valid Email: ${email}`;
    resultElement.classList.remove("invalid");
    resultElement.classList.add("valid");
    resultElement.style.display = "block";
  }

  function hideResult() {
    resultElement.style.display = "none";
    resultElement.classList.remove("invalid", "valid");
  }
}
