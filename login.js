// User database to store registered users
let users = [];

// Function to register a new user
function register() {
  let username = document.getElementById('regUsername').value;
  let password = document.getElementById('regPassword').value;

  // Check if username already exists
  let userExists = users.some(user => user.username === username);

  if (userExists) {
    alert('Username already exists. Please choose a different one.');
  } else {
    // Add new user to the database
    users.push({ username, password });
    alert('Registration successful!');
    hideRegisterForm();
  }
}

// Function to log in a user
function login() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  // Check if the provided username and password match any registered user
  let user = users.find(user => user.username === username && user.password === password);

  if (user) {
    alert('Login successful!');
    // Redirect to main page or perform further actions for logged-in user
    window.location.href = 'Home.html';
  } else {
    alert('Invalid username or password.');
  }
}

// Function to show the registration form popup
function showRegisterForm() {
  document.getElementById('registerPopup').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';
}

// Function to hide the registration form popup
function hideRegisterForm() {
  document.getElementById('registerPopup').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

