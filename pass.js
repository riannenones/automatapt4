document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("passwordInput");
  const resultElement = document.getElementById("result");

  function togglePassword() {
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
    checkPasswordStrength();
  }

  // Define states
  const states = {
    q0: "start",
    q1: "final",
  };

  // Initial state
  let currentState = states.q0;

  // Transitions
  const transitions = {
    q0: {
      uppercase: { nextState: "q0" },
      lowercase: { nextState: "q0" },
      digit: { nextState: "q0" },
      specialChar: { nextState: "q0" },
      length: { nextState: "q0" },
      allConditionsSatisfied: { nextState: "q1" },
    },
  };

  function checkPasswordStrength() {
    const password = passwordInput.value;

    // Check if password is empty
    if (password === "") {
      clearResult();
      return;
    }

    // Reset to start state
    currentState = states.q0;

    // Check conditions concurrently
    if (
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":|<>]/.test(password) &&
      password.length >= 8
    ) {
      currentState = states.q1;
    }

    // Check if final state is reached
    if (currentState === states.q1) {
      resultElement.classList.remove("invalid");
      resultElement.classList.add("valid");
      resultElement.textContent = "Strong Password";
    } else {
      // Update resultElement based on the current state
      handleIntermediateStates();
    }
  }

  function handleIntermediateStates() {
    const password = passwordInput.value;
    const errors = [];

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one digit.");
    }
    if (!/[!@#$%^&*(),.?":|<>]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    resultElement.classList.remove("valid");
    resultElement.classList.add("invalid");
    resultElement.innerHTML = errors.join("<br>");
  }

  function clearResult() {
    resultElement.classList.remove("valid", "invalid");
    resultElement.textContent = "";
  }

  passwordInput.addEventListener("input", checkPasswordStrength);
  document
    .querySelector(".show-password-checkbox")
    .addEventListener("change", togglePassword);
});
