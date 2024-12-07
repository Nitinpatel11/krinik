export function initializePage() {
  console.log("Initializing page...");
  const elements = document.querySelectorAll(
    "button, input, select, textarea, a, li, div, th, td, span, i"
  );
  console.log("Elements found:", elements);

  elements.forEach((element) => {
    if (element.classList.contains("otp-exempt")) {
      element.style.display = "block";
    }
  });
}

export function showDynamicAlert(message) {
  // Create alert element dynamically
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  alertBox.textContent = message;

  // Append alert to the body
  document.body.appendChild(alertBox);

  // Remove the alert after 5 seconds
  setTimeout(() => {
    alertBox.remove();
  }, 5000);
}

// Function to check if the user is a super admin
export function getAdminType() {
  const adminType = JSON.parse(sessionStorage.getItem("adminType"));

  // Check if adminType exists and return the adminType object
  if (adminType) {
    return {
      key: Object.keys(adminType),
      value: adminType.value,
      status: adminType.status,
    };
  }

  return { key: null, value: null, status: null }; // Return null if adminType does not exist
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMIXxBISZnryQeOgKRs73TqVRXkshd0KM",
  authDomain: "krinkin-309ee.firebaseapp.com",
  projectId: "krinkin-309ee",
  storageBucket: "krinkin-309ee.appspot.com",
  messagingSenderId: "397386970252",
  appId: "1:397386970252:web:9655f412b4280a036d77a9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export function createOTPModal() {
  // Modal HTML structure
  const otpModalHTML = `
  <div id="otpModal" class="modal" style="display:none;z-index:2000">
      <div class="modal-content">
          <div class="col-md-12 d-flex justify-content-between align-items-center">
              <h2>OTP Verification</h2>
              <span class="close">&times;</span>
          </div>
          
          <div class="col-md-12 d-flex justify-content-between align-items-center">
              <div class="form-group form-group-custom">
                  <input type="text" class="form-control" id="mobilenum" style="text-align: center;" maxlength="10" placeholder="Enter mobile number" />
              </div>
              <div class="text-center">
                  <button class="btn btn-primary" id="get-otp-btn">Get OTP</button>
              </div>
          </div>
          
          <p id="mobileError" style="color:red;display:none;">Please enter a valid 10-digit mobile number.</p>
          
          <div id="showotptimer" style="display:none;">
              <div class="otp-inputs text-center">
                  <input type="text" maxlength="1" class="otp-input" />
                  <input type="text" maxlength="1" class="otp-input" />
                  <input type="text" maxlength="1" class="otp-input" />
                  <input type="text" maxlength="1" class="otp-input" />
                  <input type="text" maxlength="1" class="otp-input" />
                  <input type="text" maxlength="1" class="otp-input" />
              </div>
              <p class="resend-timer text-end">
                  Resend in <span id="timer">30</span> sec
                  <button id="resend-otp-btn" style="display:none;">Resend OTP</button>
              </p>
              <button id="submitOTP" class="btn btn-primary">Submit</button>
              <p id="otpError" style="color:red;display:none;">Invalid OTP. Please try again.</p>
          </div>
      </div>
      <div id="otpOverlay" class="overlay" style="display:none;"></div>
  </div>`;
  

  // Append the modal HTML to the body
  document.body.insertAdjacentHTML("beforeend", otpModalHTML);
  function initializeOtpInputNavigation() {
    const otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach((input, index, inputs) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                // Move focus to the next input if it's not the last input
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                // Move focus to the previous input if Backspace is pressed and current input is empty
                inputs[index - 1].focus();
            }
        });
    });
}

// Call the function to initialize OTP input navigation



  const otpModal = document.getElementById("otpModal");
  const otpOverlay = document.getElementById("otpOverlay");
  const closeModal = otpModal.querySelector(".close");
  const submitOTP = document.getElementById("submitOTP");
  const getOTPbtn = document.getElementById("get-otp-btn");

  const otpError = document.getElementById("otpError");
  const timerElement = document.getElementById("timer");
  const timerContainer = document.getElementById("showotptimer");
  const resendOtpButton = document.getElementById("resend-otp-btn");
  const mobileError = document.getElementById("mobileError");
  const mobileInput = document.getElementById("mobilenum");
  let timerIntervalId = null;
  let confirmationResult = null;
  let recaptchaVerifier;
  // Private function to start the OTP timer
  let recaptchaRendered = false;  // Flag to check if reCAPTCHA has been rendered
  function startTimer() {
      clearInterval(timerIntervalId);
    let time = 30;
    timerIntervalId = setInterval(() => {
      time--;
      timerElement.textContent = time;
      if (time <= 0) {
        clearInterval(timerIntervalId);
        timerElement.textContent = "0";
        resendOtpButton.style.display = "inline-block";
      }
    }, 1000);
  }

  // Private function to reset the OTP timer
  function resetTimer() {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
    timerElement.textContent = "30";
    resendOtpButton.style.display = "none";
  }

  // Private function to hide the OTP modal
  function hideOTPModal() {
    otpModal.style.display = "none";
    otpOverlay.style.display = "none";
    mobileInput.value = "";
    mobileInput.readOnly = false;
    timerContainer.style.display = "none";
    getOTPbtn.style.display = "block";
    submitOTP.style.display = "none";
    recaptchaRendered = false
    resetTimer();
  }
 
  // Global recaptchaVerifier variable

// Initialize invisible reCAPTCHA
function initializeRecaptcha() {
    if (!recaptchaRendered) {
        recaptchaVerifier = new RecaptchaVerifier(
            "get-otp-btn", // Button ID that triggers the reCAPTCHA
            {
                size: "invisible", // Make it invisible
                callback: () => {
                    console.log("reCAPTCHA verified");
                },
            },
            auth
        );
        recaptchaVerifier.render().then(function() {
            recaptchaRendered = true; // Mark as rendered to avoid re-rendering
        });
    }
}
  // Private function to send OTP
//   function validateMobile() {
//     const mobileInput = document.getElementById("mobilenum").value.trim();
//     const mobileError = document.getElementById("mobileError");

//     // Check if the mobile number is exactly 10 digits
//     if (!/^\d{10}$/.test(mobileInput)) {
//         mobileError.style.display = "block";
//         mobileError.innerText = "Please enter a valid mobile number";
//     } else {
//         mobileError.style.display = "none";
//     }
// }

// Validate on input (typing) and on button click

function sendOTP() {
    // document.getElementById("mobilenum").addEventListener("input", validateMobile);
    let phoneNumber = document.getElementById("mobilenum").value.trim();
    

    if (!/^\d{10}$/.test(phoneNumber)) {
        mobileError.style.display = "block";
        mobileError.innerText = "Please enter a valid mobile number.";
        return;
    } else {
        mobileError.style.display = "none";
    }

    // Ensure the number starts with +91
    if (!phoneNumber.startsWith("+91")) {
        phoneNumber = "+91" + phoneNumber;
    }
    

    if (phoneNumber) {
        if (!recaptchaVerifier) {
            initializeRecaptcha();
        }
        mobileInput.readOnly = true;
        const appVerifier = recaptchaVerifier;
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                window.confirmationResult = confirmationResult;
                startTimer();
                timerContainer.style.display = "block";
                initializeOtpInputNavigation();
                getOTPbtn.style.display = "none";
                submitOTP.style.display = "block";
            })
            .catch(function (error) {
                if (error.code === 'auth/too-many-requests') {
                    alert("Too many OTP requests. Please try again later.");
                    hideOTPModal()
                    window.location.reload();
                } else if (error.code === 'auth/invalid-phone-number') {
                    alert("Invalid phone number. Please enter a valid number.");
                    hideOTPModal()
                    window.location.reload();
                } else {
                    console.error("Error during signInWithPhoneNumber", error);
                    alert("An error occurred. Please try again.");
                    hideOTPModal()
                    window.location.reload();
                }
            });
    } else {
        alert("Please enter a valid phone number.");
    }
}


  // Private function to setup reCAPTCHA

  // Private function to verify OTP
  function verifyOTP() {
    const otpInputs = document.querySelectorAll(".otp-input");
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    console.log("Verifying OTP:", otp);

    if (otp) {
      window.confirmationResult
        .confirm(otp)
        .then(function (result) {
          alert("Phone number verified successfully!");
          const user = result.user;
          console.log(user);
          const adminType = JSON.parse(sessionStorage.getItem("adminType"));
          if (adminType) {
            adminType.status = false; // Set status to false
            sessionStorage.setItem("adminType", JSON.stringify(adminType));
          }
          hideOTPModal()
          window.location.reload();
        })
        .catch(function (error) {
          console.error("Error verifying OTP", error);
        });
    } else {
      alert("Please enter the OTP code.");
    }
  }

  // Private function to handle resend OTP
  function resendOTP() {
    sendOTP();
    resendOtpButton.style.display = "none";
    resetTimer();
    startTimer();
  }

  // Public function to show the OTP modal
  function showOTPModal() {
    otpModal.style.display = "block";
    otpOverlay.style.display = "block";
   
  }

  // Event Listeners
  closeModal.addEventListener("click", hideOTPModal);
  otpOverlay.addEventListener("click", hideOTPModal);
  submitOTP.addEventListener("click", verifyOTP);
  resendOtpButton.addEventListener("click", resendOTP);
  document.getElementById("get-otp-btn").addEventListener("click", sendOTP);

  // Return an object with functions to interact with the OTP modal
  return {
    show: showOTPModal,
    hide: hideOTPModal,
  };
}


export function checkAdminAccess() {
    // Retrieve the adminType object from sessionStorage
    const adminType = JSON.parse(sessionStorage.getItem("adminType"));
    
    // Check if the adminType object exists and has the correct values
    if (adminType && adminType.value === "super admin" && adminType.status === "true") {
      // Allow access if adminType is "super admin" and status is "true"
      window.location.href = "./dashboard.html"; // Update this URL to match your dashboard's path
      console.log("Access granted.");
    } else {
      // If not, redirect to the dashboard
      initializePage()
      console.log("Access denied. Redirecting to dashboard...");
    }
  }


 export let sendNotification = async (userId = null, customPayload = {}) => {
    try {
      let tokens = [];
      let allUser = []
  
      // If a specific userId is provided, fetch only that user's data
      if (userId) {
        console.log(userId,"id che ok")
        let response = await fetch(`https://krinik.in/user_get/${userId}/`);
        if (!response.ok) {
          console.error(`Failed to fetch user data for ID ${userId}. Status:`, response.status);
          return;
        }
        let data1 = await response.json();
        let data =  data1.data
        if (data.device_token) {
          
          tokens.push(data.device_token);
        } else {
          console.error(`No device token found for user ID ${userId}`);
          return;
        }
      } else {
        // Fetch all users if no specific userId is provided
        let response = await fetch('https://krinik.in/user_get/');
        if (!response.ok) {
          console.error('Failed to fetch users. Status:', response.status);
          return;
        }
        let data = await response.json();
        tokens = data.data.map((user) => user.device_token);
        allUser = data.data.map((user)=> user.user_id)
        console.log(allUser,"alluser")
      }
  
      // Define the notification payload
      let payload = {
        tokens: tokens,
        title: customPayload.title || "",
        body: customPayload.body || "",
       
      };
  
      // Send the notification request
      const response2 = await fetch('https://fcm-notification-u6yp.onrender.com/send-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response2.ok) {
        console.error('Network response was not ok. Status:', response2.status, 'Status Text:', response2.statusText);
        throw new Error('Network response was not ok');
      }
  
      // Patch the notification data to the endpoint
      const patchPayload = {
        title: customPayload.title,
        message: customPayload.body,
        user_data: userId ? [userId] : allUser,  // Use userId if provided, otherwise use allUser
        // read: false, // Assuming the notification starts as unread
    };
  
      // Patch URL based on whether a user ID is provided
      const patchUrl = userId 
        ? `https://krinik.in/notification_get/` 
        : 'https://krinik.in/notification_get/';
  // console.log(patchUrl,"pcatc")
      const postResponse = await fetch(patchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchPayload)
      });
  
      if (!postResponse.ok) {
        console.error('Failed to patch notification data. Status:', postResponse.status);
        throw new Error('Failed to patch notification data');
      }
  
      console.log('Notification sent and data patched successfully');
      return { notificationResponse: response2, postResponse: postResponse };
  
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Usage examples
  // Send notification to all users and patch data with default payload
  // sendNotification();
  
  // Send notification to a specific user and patch data with custom payload
  // sendNotification('specific_user_id_here', {
  //   title: "Exclusive Offer!",
  //   body: "Hello! Check out our exclusive offer just for you."
  // });
  

 export let sendNotificationAllUser = async (tokens, allUsers, customPayload = {}) => { 
    try {
      if (tokens.length === 0) {
        console.error('No valid tokens found.');
        return;
      }
  
      // Define notification payload
      const payload = {
        tokens: tokens,
        title: customPayload.title || "",
        body: customPayload.body || "",
      };
  
      // Create promises for sending notifications and patching data
      const notificationPromise = fetch('https://fcm-notification-u6yp.onrender.com/send-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const patchPayload = {
        title: customPayload.title,
        message: customPayload.body,
        user_data: allUsers, // Send to all users
      };
  
      const patchPromise = fetch('https://krinik.in/notification_get/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchPayload),
      });
  
      // Execute both promises in parallel
      const [notificationResponse, patchResponse] = await Promise.all([notificationPromise, patchPromise]);
  
      // Handle responses
      if (!notificationResponse.ok) {
        console.error('Failed to send notifications. Status:', notificationResponse.status);
      }
      if (!patchResponse.ok) {
        console.error('Failed to patch notification data. Status:', patchResponse.status);
      }
  
      if (notificationResponse.ok && patchResponse.ok) {
        console.log('Notification sent and data patched successfully');
      }
  
      return { notificationResponse, patchResponse };
    } catch (error) {
      console.error('Error:', error);
    }
  };