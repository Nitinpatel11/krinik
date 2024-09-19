

const loginForm = document.getElementById('login-pwd');
const oldPwdInput = document.getElementById('oldpd');
const errorOldInput = document.getElementById('errorOldpwd');
const newPwdInput = document.getElementById('newpd');
const errorNewInput = document.getElementById('errorNewpwd');
const newConPwdInput = document.getElementById('confirmpd');
const errorConPwdInput = document.getElementById('errorConNewpwd');

const passwordRegex = /.{6,}/;

function validateInput(inputId, errorId, regex, emptyMessage, invalidMessage) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  function validate() {
    const value = input.value.trim();
    console.log(`Validating ${inputId}:`, value); // Debug: Log input value
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

  // Call validate function on input and change events
  input.addEventListener('input', validate);
  input.addEventListener('change', validate);

  return validate;
}


let matchId;
let matchpwd;

async function fetchData() {
  try {
    const response = await fetch("https://krinik.pythonanywhere.com/login/");
    if (!response.ok) {
      console.error('Network response was not ok. Status:', response.status, 'Status Text:', response.statusText);
      throw new Error('Network response was not ok');
    }
    const data1 = await response.json();
    const loginData = data1.data;

    console.log('Fetched login data:', loginData);

    fetchingData(loginData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function fetchingData(loginData) {
  try {
    const localStorageItem = localStorage.getItem('userEmail');
    if (!localStorageItem) {
      console.error('No data found in localStorage');
      return;
    }

    const parsedItem = JSON.parse(localStorageItem);
    const email = parsedItem.value;

    const matchingData = loginData.filter(item => item.email === email);

    if (matchingData.length > 0) {
      matchId = matchingData[0].id;
      matchpwd = matchingData[0].password;
    } else {
      console.error('No matching data found');
    }
  } catch (error) {
    console.error('Error fetching data from localStorage:', error);
  }
}


function validateAll() {
const validateOldPwd = validateInput(
'oldpd',
'errorOldpwd',
passwordRegex,
'Please enter old password',
'Password must be at least 6 characters long'
);
const validateNewPwd = validateInput(
'newpd',
'errorNewpwd',
passwordRegex,
'Please enter new password',
'Password must be at least 6 characters long'
);
const validateConNewPwd = validateInput(
'confirmpd',
'errorConNewpwd',
passwordRegex,
'Please enter confirm password',
'Password must be at least 6 characters long'
);

const isOldValid = validateOldPwd();
const isNewPasswordValid = validateNewPwd();
const isConfirmPasswordValid = validateConNewPwd();

return isOldValid && isNewPasswordValid && isConfirmPasswordValid;
}


async function passwordMatch() {
  loginForm.addEventListener('submit', async (event) => {
    const validateOldPwd = validateInput(
  'oldpd',
  'errorOldpwd',
  passwordRegex,
  'Please enter old password',
  'Password must be at least 6 characters long'
);
const validateNewPwd = validateInput(
  'newpd',
  'errorNewpwd',
  passwordRegex,
  'Please enter new password',
  'Password must be at least 6 characters long'
);
const validateConNewPwd = validateInput(
  'confirmpd',
  'errorConNewpwd',
  passwordRegex,
  'Please enter confirm password',
  'Password must be at least 6 characters long'
);

    event.preventDefault();
    if (!validateAll()) {
return; // Stop submission if any validation fails
}

    if (validateOldPwd && validateNewPwd && validateConNewPwd ) {
      const old = oldPwdInput.value;
      const newPwd = newPwdInput.value;
      const newConPwd = newConPwdInput.value;
        function validateOTP(inputOtp) {
  if (inputOtp === matchpwd) {
    errorOldInput.style.display = "none"; // Hide error if OTP is valid
    return true;
  } else if (inputOtp === ""){
    errorOldInput.innerHTML = 'Please enter old password'; // Show error if OTP is invalid
    errorOldInput.style.display = "inline";
    errorOldInput.style.color = 'red';
  } else if(inputOtp !== matchpwd){
    errorOldInput.innerHTML = 'Old password is incorrect'; // Show error if OTP is invalid
    errorOldInput.style.display = "inline";
    errorOldInput.style.color = 'red';
    return false;
  }
}

      if (validateOTP(old)) {
        if (newPwd === newConPwd) {
          errorOldInput.textContent = '';
          errorNewInput.textContent = '';
          errorConPwdInput.textContent = '';

          try {
            const response = await fetch(`https://krinik.pythonanywhere.com/login/${matchId}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ password: newPwd })
            });

            if (!response.ok) {
              console.error('PATCH request failed with status:', response.status);
              const responseText = await response.text();
              console.error('Response text:', responseText);
              throw new Error(`PATCH request failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            // Clear the form inputs after a successful response
            oldPwdInput.value = '';
            newPwdInput.value = '';
            newConPwdInput.value = '';

          } catch (error) {
            console.error('Error during password update:', error);
          }
        } else {
          errorConPwdInput.textContent = 'Passwords do not match';
          errorConPwdInput.style.display = 'inline';
          errorConPwdInput.style.color = 'red';
        }
      }
    }
  });
}

fetchData().then(passwordMatch);
