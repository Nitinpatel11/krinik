
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const adminTypeInput = document.getElementById('admin-type');
const errorEmail = document.getElementById('error-email');
const errorPassword = document.getElementById('error-password');
const errorAdminType = document.getElementById('error-admin-type');
const errorMessage = document.getElementById('error-message');

const COOKIE_NAME = 'userEmail';
const ADMIN_TYPE_COOKIE_NAME = 'adminType';
const COOKIE_EXPIRATION_HOURS_ADMIN = 24; // 30 minutes for regular admin
const COOKIE_EXPIRATION_HOURS_SUPER_ADMIN = 1; // 60 minutes for super admin
const  STATUS_ADMIN = "true"
const  STATUS_ADMIN1 = "false"

function setLocalStorage(key, value, hours,status) {
const currentTime = new Date().getTime();
const expirationTime = currentTime + (hours * 60 * 60 * 1000); // Convert hours to milliseconds
localStorage.setItem(key, JSON.stringify({ value, expirationTime,status }));
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

if (!email && !localStorage.getItem('redirected')) {
  localStorage.setItem('redirected', 'true');
  window.location.replace('./index.html');
 
} else {
  localStorage.removeItem('redirected');
}
}
function validateInput(inputId, errorId, regex, emptyMessage, invalidMessage) {
const input = document.getElementById(inputId);
const error = document.getElementById(errorId);

function validate() {
  const value = input.value.trim();
  if (value === '') {
    error.innerHTML = emptyMessage;
    error.style.display = 'inline';
     error.style.color = 'red';
    return false;
  } else if (!regex.test(value)) {
    error.innerHTML = invalidMessage;
    error.style.display = 'inline';
     error.style.color = 'red';
    return false;
  } else {
    error.style.display = 'none';
    return true;
  }
}

input.addEventListener('input', validate);
input.addEventListener('change', validate);

return validate;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /.{6,}/;
const adminTypeRegex = /^(super admin|admin)$/;


function validateAll() {
const validateEmail = validateInput(
'email',
'error-email',
emailRegex,
'Email is required',
'Invalid email address'
);
  const validatePassword = validateInput(
'password',
'error-password',
passwordRegex,
'Password is required',
'Password must be at least 6 characters long'
);
  const validateAdminType = validateInput(
'admin-type',
'error-admin-type',
adminTypeRegex,
'Admin type is required',
'Invalid admin type'
);

  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isAdminTypeValid = validateAdminType();

  return isEmailValid && isPasswordValid && isAdminTypeValid;
}

loginForm.addEventListener('submit', async (event) => {

const validateEmail = validateInput(
'email',
'error-email',
emailRegex,
'Email is required',
'Invalid email address'
);

const validatePassword = validateInput(
'password',
'error-password',
passwordRegex,
'Password is required',
'Password must be at least 6 characters long'
);
const validateAdminType = validateInput(
'admin-type',
'error-admin-type',
adminTypeRegex,
'Admin type is required',
'Invalid admin type'
);
const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isAdminTypeValid = validateAdminType();
  event.preventDefault();



  if (!validateAll()) {
      return; // Stop submission if any validation fails
    }

  if (isEmailValid && isPasswordValid && isAdminTypeValid) {
    const email = emailInput.value;
  const password = passwordInput.value;
  const adminType = adminTypeInput.value;

  errorEmail.textContent = '';
  errorPassword.textContent = '';
  errorAdminType.textContent = '';

  try {
    const response = await fetch('https://krinik.pythonanywhere.com/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, admin_type: adminType })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);

    if (data.status === 'success') {
      if (adminType === 'super admin') {
        setLocalStorage(COOKIE_NAME, email, COOKIE_EXPIRATION_HOURS_SUPER_ADMIN, STATUS_ADMIN);
        setLocalStorage(ADMIN_TYPE_COOKIE_NAME, adminType, COOKIE_EXPIRATION_HOURS_SUPER_ADMIN, STATUS_ADMIN);
      } else {
        setLocalStorage(COOKIE_NAME, email, COOKIE_EXPIRATION_HOURS_ADMIN, STATUS_ADMIN1);
        setLocalStorage(ADMIN_TYPE_COOKIE_NAME, adminType, COOKIE_EXPIRATION_HOURS_ADMIN, STATUS_ADMIN1);
      }
      window.location.href = './dashboard.html';
    } 
  } catch (error) {
    console.error('Error during login:', error);
   
  }
  }

 
});


checkLocalStorageExpiration();
