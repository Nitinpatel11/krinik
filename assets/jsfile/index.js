const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const adminTypeInput = document.getElementById("admin-type");
const errorEmail = document.getElementById("error-email");
const errorPassword = document.getElementById("error-password");
const errorAdminType = document.getElementById("error-admin-type");
const errorMessage = document.getElementById("error-message");

const COOKIE_NAME = "userEmail";
const ADMIN_TYPE_COOKIE_NAME = "adminType";
const COOKIE_EXPIRATION_HOURS_ADMIN = 24; // 30 minutes for regular admin
const COOKIE_EXPIRATION_HOURS_SUPER_ADMIN = 1; // 60 minutes for super admin
const STATUS_ADMIN = "true";
const STATUS_ADMIN1 = "false";

function setLocalStorage(key, value, hours, status) {
  const currentTime = new Date().getTime();
  const expirationTime = currentTime + hours * 60 * 60 * 1000; // Convert hours to milliseconds
  localStorage.setItem(key, JSON.stringify({ value, expirationTime, status }));
}

function getLocalStorage(key) {
  const item = localStorage.getItem(key);
  if (item) {
    const parsedItem = JSON.parse(item);
    const currentTime = new Date().getTime();
    if (currentTime < parsedItem.expirationTime) {
      return parsedItem.value;
    } else {
      localStorage.removeItem(key);
    }
  }
  return null;
}

function eraseLocalStorage(key) {
  localStorage.removeItem(key);
}

function checkLocalStorageExpiration() {
  const email = getLocalStorage(COOKIE_NAME);
  // const reloaded = sessionStorage.getItem('reloaded');

  if (!email && !localStorage.getItem("redirected")) {
    localStorage.setItem("redirected", "true");
    window.location.replace("./index.html");
  } else {
    localStorage.removeItem("redirected");
  }
}
function validateInput(inputId, errorId, regex, emptyMessage, invalidMessage) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  function validate() {
    const value = input.value.trim();
    if (value === "") {
      error.innerHTML = emptyMessage;
      error.style.display = "inline";
      error.style.color = "red";
      return false;
    } else if (!regex.test(value)) {
      error.innerHTML = invalidMessage;
      error.style.display = "inline";
      error.style.color = "red";
      return false;
    } else {
      error.style.display = "none";
      return true;
    }
  }

  input.addEventListener("input", validate);
  input.addEventListener("change", validate);

  return validate;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /.{6,}/;
const adminTypeRegex = /^(super admin|admin)$/;

function validateAll() {
  const validateEmail = validateInput(
    "email",
    "error-email",
    emailRegex,
    "Email is required",
    "Invalid email address"
  );
  const validatePassword = validateInput(
    "password",
    "error-password",
    passwordRegex,
    "Password is required",
    "Password must be at least 6 characters long"
  );
  const validateAdminType = validateInput(
    "admin-type",
    "error-admin-type",
    adminTypeRegex,
    "Admin type is required",
    "Invalid admin type"
  );

  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isAdminTypeValid = validateAdminType();

  return isEmailValid && isPasswordValid && isAdminTypeValid;
}
let loginApi = async () => {
  try {
    const response = await fetch("https://krinik.pythonanywhere.com/login/");
    let data1 = await response.json();
    // console.log("API Data:", data1.data); // Log the fetched data for debugging
    return data1.data; // return the data array for validation
  } catch (error) {
    console.error("Error during loginApi:", error);
    return null; // Handle error and return null if API call fails
  }
};
// loginApi()
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form from submitting by default

  // Get form inputs
  const email = document.getElementById("email").value.trim(); // Trim to avoid extra spaces
  const password = document.getElementById("password").value.trim();
  const adminType = document.getElementById("admin-type").value.trim();

  console.log("Input Email:", email);
  console.log("Input Password:", password);
  console.log("Input Admin Type:", adminType);

  // Form validation
  const validateEmail = validateInput(
    "email",
    "error-email",
    emailRegex,
    "Email is required",
    "Invalid email address"
  );
  const validatePassword = validateInput(
    "password",
    "error-password",
    passwordRegex,
    "Password is required",
    "Password must be at least 6 characters long"
  );
  const validateAdminType = validateInput(
    "admin-type",
    "error-admin-type",
    adminTypeRegex,
    "Admin type is required",
    "Invalid admin type"
  );

  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isAdminTypeValid = validateAdminType();

  // Stop submission if any validation fails
  if (!isEmailValid || !isPasswordValid || !isAdminTypeValid) {
    console.log("Validation failed: Check the form inputs");
    return;
  }

  // Fetch login data from API
  const loginData = await loginApi();
  if (!loginData) {
    console.error("Unable to fetch login data from the API");
    return;
  }

  // Check if the email, password, and admin type match with API data
  const matchingUser = loginData.find(
    (user) =>
      user.email == email &&
      user.password == password &&
      user.admin_type == adminType
  );
  // console.log(loginData[0].admin_type,"match data")

  const matchingEmail = loginData.find(user => user.email == email);
const matchingPassword = loginData.find(user => user.password == password && user.email == email );
const matchingAdminType = loginData.find(user => user.admin_type == adminType && user.email == email);

  // if (!matchingUser) {
  //   // Show validation error if credentials don't match
  //   console.log("No matching user found. Email, password, or admin type is incorrect.");


  //   return;
  // }

  if (!matchingEmail && !matchingPassword && !matchingAdminType) {
    document.getElementById("error-email").textContent = "Invalid email";
    document.getElementById("error-email").style = "display:inline; color:red";
    document.getElementById("error-password").textContent = "Invalid password";
    document.getElementById("error-password").style = "display:inline; color:red";
    document.getElementById("error-admin-type").textContent = "Invalid admin type";
    document.getElementById("error-admin-type").style = "display:inline; color:red";
  
  // Condition 2: Email and password don't match, but admin type matches
  } else if (!matchingEmail && !matchingPassword && matchingAdminType) {
    document.getElementById("error-email").textContent = "Invalid email or password";
    document.getElementById("error-email").style = "display:inline; color:red";
    document.getElementById("error-password").textContent = "Invalid email or password";
    document.getElementById("error-password").style = "display:inline; color:red";
  
  // Condition 3: Email doesn't match, but password and admin type match
  } else if (!matchingEmail && matchingPassword && matchingAdminType) {
    document.getElementById("error-email").textContent = "Invalid email";
    document.getElementById("error-email").style = "display:inline; color:red";
  
  // Condition 4: Email matches, but password and admin type don't match
  } else if (matchingEmail && !matchingPassword && !matchingAdminType) {
    document.getElementById("error-password").textContent = "Invalid password";
    document.getElementById("error-password").style = "display:inline; color:red";
    document.getElementById("error-admin-type").textContent = "Invalid admin type";
    document.getElementById("error-admin-type").style = "display:inline; color:red";
  
  // Condition 5: Email and admin type match, but password doesn't match
  } else if (matchingEmail && !matchingPassword && matchingAdminType) {
    document.getElementById("error-password").textContent = "Invalid password";
    document.getElementById("error-password").style = "display:inline; color:red";
  
  // Condition 6: Email and password match, but admin type doesn't match
  } else if (matchingEmail && matchingPassword && !matchingAdminType) {
    document.getElementById("error-admin-type").textContent = "Invalid admin type";
    document.getElementById("error-admin-type").style = "display:inline; color:red";
  
  // Condition 7: All fields match (successful login)
  } else if (matchingEmail && matchingPassword && matchingAdminType) {
    console.log("Login successful!");
    try {
      if (loginData[0].admin_type === "super admin") {
        setLocalStorage(
          COOKIE_NAME,
          email,
          COOKIE_EXPIRATION_HOURS_SUPER_ADMIN,
          STATUS_ADMIN
        );
        setLocalStorage(
          ADMIN_TYPE_COOKIE_NAME,
          adminType,
          COOKIE_EXPIRATION_HOURS_SUPER_ADMIN,
          STATUS_ADMIN
        );
      } else {
        setLocalStorage(
          COOKIE_NAME,
          email,
          COOKIE_EXPIRATION_HOURS_ADMIN,
          STATUS_ADMIN1
        );
        setLocalStorage(
          ADMIN_TYPE_COOKIE_NAME,
          adminType,
          COOKIE_EXPIRATION_HOURS_ADMIN,
          STATUS_ADMIN1
        );
      }
      window.location.href = "./dashboard.html"; // Redirect to the dashboard
    } catch (error) {
      console.error("Error during login:", error);
    }
    // Proceed with your successful login logic here, like setting localStorage or redirecting
    // ...
  }

  // Clear error messages if valid
  // document.getElementById("error-email").textContent = "";
  // document.getElementById("error-password").textContent = "";
  // document.getElementById("error-admin-type").textContent = "";

  // Set cookies and redirect based on admin type
 
});


checkLocalStorageExpiration();
