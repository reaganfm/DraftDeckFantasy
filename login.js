document.getElementById("loginForm").addEventListener("submit", function (event) {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Get the error message containers
  const usernameError = document.getElementById("usernameError");
  const passwordError = document.getElementById("passwordError");

  // Regular expression for password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Clear any previous error messages
  usernameError.textContent = ""; // Reset username error
  passwordError.textContent = ""; // Reset password error

  // Check if both username and password fields are filled
  if (username === "" || password === "") {
    event.preventDefault();
    alert("Please fill out both fields.");
  } else if (username.length < 6) {
    event.preventDefault();
    usernameError.textContent = "Invalid Username";
    usernameError.style.color = "red"; // You can customize this color as needed
  } else if (!passwordRegex.test(password)) {
    event.preventDefault();
    passwordError.textContent = "Incorrect Password";
    passwordError.style.color = "red"; // You can customize this color as needed
  } else {
    event.preventDefault(); // Prevent form submission
    window.location.href = "home.html"; // Redirect to home page
  }
});
