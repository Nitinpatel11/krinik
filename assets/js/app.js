!(function (e) {
  "use strict";
  e("#side-menu").metisMenu(),
    e("#vertical-menu-btn").on("click", function (t) {
      t.preventDefault(),
        e("body").toggleClass("sidebar-enable"),
        992 <= e(window).width()
          ? e("body").toggleClass("vertical-collpsed")
          : e("body").removeClass("vertical-collpsed");
    }),
    e("#sidebar-menu a").each(function () {
      var t = window.location.href.split(/[?#]/)[0];
      this.href == t &&
        (e(this).addClass("active"),
        e(this).parent().addClass("mm-active"),
        e(this).parent().parent().addClass("mm-show"),
        e(this).parent().parent().prev().addClass("mm-active"),
        e(this).parent().parent().parent().addClass("mm-active"),
        e(this).parent().parent().parent().parent().addClass("mm-show"),
        e(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .addClass("mm-active"));
    }),
    e(".navbar-nav a").each(function () {
      var t = window.location.href.split(/[?#]/)[0];
      this.href == t &&
        (e(this).addClass("active"),
        e(this).parent().addClass("active"),
        e(this).parent().parent().addClass("active"),
        e(this).parent().parent().parent().parent().addClass("active"),
        e(this).parent().parent().parent().parent().parent().addClass("active"),
        e(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .addClass("active"),
        e(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .addClass("active"));
    }),
    e(".right-bar-toggle").on("click", function (t) {
      e("body").toggleClass("right-bar-enabled");
    }),
    e(document).on("click", "body", function (t) {
      0 < e(t.target).closest(".right-bar-toggle, .right-bar").length ||
        e("body").removeClass("right-bar-enabled");
    }),
    e(".dropdown-menu a.dropdown-toggle").on("click", function (t) {
      return (
        e(this).next().hasClass("show") ||
          e(this)
            .parents(".dropdown-menu")
            .first()
            .find(".show")
            .removeClass("show"),
        e(this).next(".dropdown-menu").toggleClass("show"),
        !1
      );
    }),
    e(function () {
      e('[data-toggle="tooltip"]').tooltip();
    }),
    e(function () {
      e('[data-toggle="popover"]').popover();
    }),
    Waves.init();
})(jQuery);
var bodyElem = document.documentElement,
  lightDarkBtn =
    (bodyElem.hasAttribute("data-bs-theme") &&
    "light" == bodyElem.getAttribute("data-bs-theme")
      ? sessionStorage.setItem("data-layout-mode", "light")
      : "dark" == bodyElem.getAttribute("data-bs-theme") &&
        sessionStorage.setItem("data-layout-mode", "dark"),
    null == sessionStorage.getItem("data-layout-mode")
      ? bodyElem.setAttribute("data-bs-theme", "light")
      : sessionStorage.getItem("data-layout-mode") &&
        bodyElem.setAttribute(
          "data-bs-theme",
          sessionStorage.getItem("data-layout-mode")
        ),
    document.getElementById("light-dark-mode"));
lightDarkBtn &&
  lightDarkBtn.addEventListener("click", function (t) {
    bodyElem.hasAttribute("data-bs-theme") &&
    "dark" == bodyElem.getAttribute("data-bs-theme")
      ? (bodyElem.setAttribute("data-bs-theme", "light"),
        sessionStorage.setItem("data-layout-mode", "light"))
      : (bodyElem.setAttribute("data-bs-theme", "dark"),
        sessionStorage.setItem("data-layout-mode", "dark"));
  });





// const LOCAL_STORAGE_EXPIRATION_KEY = 'expiration';
const REGULAR_USER_EXPIRATION_SECONDS = 300 * 60; // 30 minutes
const SUPER_ADMIN_EXPIRATION_SECONDS = 60 * 60; // 60 minutes
 LOCAL_STORAGE_KEY = 'userEmail';
LOCAL_STORAGE_KEY1 = 'adminType';
 LOCAL_STORAGE_KEY2 = 'logoutTime';


function getLocalStorage(key) {
  const item = localStorage.getItem(key);
  if (item) {
    const parsedItem = JSON.parse(item);
    const currentTime = new Date().getTime();
    if (currentTime < parsedItem.expirationTime) {
      return parsedItem.expirationTime;
    } else {
      localStorage.removeItem(key);
    }
  }
  return null;
}
function getLocalStorage1(key) {
  const item = localStorage.getItem(key);
  console.log("Retrieved item from localStorage:", item); // Log the raw item

  if (item) {
    try {
      const parsedItem = JSON.parse(item);
      console.log("Parsed item:", parsedItem); // Log the parsed item

      const currentTime = Date.now();
      if (parsedItem.expirationTime && currentTime > parsedItem.expirationTime) {
        console.log("Item has expired. Removing from localStorage.");
        localStorage.removeItem(key);
        return null;
      }
      
      return parsedItem.value;
    } catch (e) {
      console.error("Error parsing item from localStorage:", e);
      return null;
    }
  }

  return null;
}



function eraseLocalStorage(key) {
  localStorage.removeItem(key);
}

function checkLocalStorageExpiration() {
  const email = getLocalStorage('userEmail');
  if (!email && !localStorage.getItem('redirected')) {
    localStorage.setItem('redirected', 'true');
    // window.location.replace('./index.html');
  } else {
    localStorage.removeItem('redirected');
  }
}

let logoutTimer;

function startLogoutTimer() {
  clearTimeout(logoutTimer);

  const adminType = getLocalStorage1('adminType');
console.log("Admin Type:", adminType ? adminType : "No admin type");
  const expirationSeconds = adminType === 'super admin' ? SUPER_ADMIN_EXPIRATION_SECONDS : REGULAR_USER_EXPIRATION_SECONDS;
  const currentTime = new Date().getTime();
  let logoutTime = getLocalStorage('userEmail');
console.log(logoutTime,"qwer")

    // logoutTime = currentTime + (expirationSeconds * 1000);
   console.log(logoutTime,"oklp")

  // Calculate the remaining time until logout
  const timeUntilLogout = logoutTime - currentTime;
  console.log(timeUntilLogout,"oklp")
  if (timeUntilLogout <= 0) {

    logoutUser();
    return;
  }

  // Set new timeout for the appropriate expiration time
  logoutTimer = setTimeout(logoutUser, timeUntilLogout);
console.log(logoutTimer)
  // Stclgart updating the remaining time
  updateRemainingTime(logoutTime);
  if(adminType === 'admin'){
    initializePage();
  }
  if (adminType === 'super admin') {
   
    initializePage2()
  }

  
}



function logoutUser() {
  console.log('User logged out due to inactivity.');
  eraseLocalStorage(LOCAL_STORAGE_KEY);
  eraseLocalStorage(LOCAL_STORAGE_KEY1);
  eraseLocalStorage(LOCAL_STORAGE_KEY2);
  window.location.href = './index.html';
  checkLocalStorageExpiration();
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}


function updateRemainingTime(logoutTime) {
  const timeDisplay = document.getElementById('time_show');
  // const timeDisplay1 = document.getElementById('time_show1');
  const adminType = getLocalStorage1('adminType');
console.log(adminType,"lpokim")
  function update() {
    const currentTime = new Date().getTime();
    const timeRemaining = Math.max(logoutTime - currentTime, 0);
    console.log(timeRemaining,"abc")
    if(adminType === "admin"){
      timeDisplay.style.display = "none"
      // timeDisplay1.style.display = "none"

    }
    timeDisplay.textContent = formatTime(timeRemaining);

    if (timeRemaining <= 0) {
      clearInterval(timeUpdateInterval);
    }
  }

  update(); // Update immediately
  const timeUpdateInterval = setInterval(update, 1000); // Update every second
}


// Call checkLocalStorageExpiration and startLogoutTimer on page load
window.onload = () => {
  checkLocalStorageExpiration();
  startLogoutTimer();
};






function initializePage() {
  // Select all interactive elements
  const elements = document.querySelectorAll("button, input, select, textarea, a,li,div,th,td,span,i");
  console.log("All elements:", elements); // Log all elements for debugging

  elements.forEach(element => {


      if (element.classList.contains("otp-exempt") || element.classList.contains("otp-exempt5") ) {
          console.log("Hiding element:", element);
          element.style.display = "block"; // Hide elements that don't have 'otp-exempt' class and are not the 'showotppage' element
      } 

      
  });
}

 


  function initializePage2() {
    // HTML for mobile number section and OTP modal
    const otpModalHTML = `
    <div id="otpModal" class="modal" style="display:none;z-index:2000">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>OTP Verification</h2>
            <div class="col-md-12 d-flex justify-content-between align-items-center">
                <div class="form-group form-group-custom">
                    <input type="text" class="form-control" id="mobilenum" value=""  style="text-align: center;" />
                </div>
                <div class="text-center">
                    <button class="btn btn-primary" id="get-otp-btn">Get OTP</button>
                </div>
            </div>
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

    document.body.insertAdjacentHTML('beforeend', otpModalHTML);

    // Get elements for OTP modal
    const otpModal = document.getElementById("otpModal");
    const otpOverlay = document.getElementById("otpOverlay");
    const closeModal = otpModal.querySelector(".close");
    const submitOTP = document.getElementById("submitOTP");
    const otpError = document.getElementById("otpError");
    const timerElement = document.getElementById('timer');
    const timerElement1 = document.getElementById('showotptimer');
    const resendOtpButton = document.getElementById('resend-otp-btn');

    function showOTPModal() {
        otpModal.style.display = "block";
        otpOverlay.style.display = "block";
        showOTPModal1(); // Show timer and resend button initially
        startTimer();
    }

    function showOTPModal1() {
        timerElement1.style.display = "block";
        otpOverlay.style.display = "block";
    }

    function hideOTPModal() {
        otpModal.style.display = "none";
        otpOverlay.style.display = "none";
        resetTimer(); // Reset the timer when hiding the modal
    }

    function sendOTP() {
      setupRecaptcha();
      const phoneNumber = document.getElementById('mobilenum').value;
      const appVerifier = window.recaptchaVerifier;

      firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
          .then((confirmationResult) => {
              window.confirmationResult = confirmationResult;
              alert('OTP sent');
              showOTPModal1(); // Show OTP input fields after sending OTP
          }).catch((error) => {
              console.error('Error during OTP send:', error);
              alert('Failed to send OTP');
          });
  }
    // function validateOTP(otp) {
    //     let otpsend = String(otpApi2); // Ensure otpApi2 is a string

    //     if (otp === otpsend) {
    //         otpError.style.display = "none"; // Hide error if OTP is valid
    //         return true;
    //     } else {
    //         otpError.style.display = "block"; // Show error if OTP is invalid
    //         return false;
    //     }
    // }

    let timerIntervalId = null;

    function startTimer() {
        let time = 30; // Timer duration in seconds

        if (timerIntervalId !== null) {
            clearInterval(timerIntervalId);
        }

        timerIntervalId = setInterval(() => {
            time--;
            timerElement.textContent = time;
            if (time <= 0) {
                clearInterval(timerIntervalId);
                timerElement.textContent = '0';
                resendOtpButton.style.display = 'inline-block'; // Show the resend button
            }
        }, 1000);
    }

    function resetTimer() {
        if (timerIntervalId !== null) {
            clearInterval(timerIntervalId);
            timerIntervalId = null;
        }
        timerElement.textContent = '30'; // Reset the timer display
        resendOtpButton.style.display = 'none'; // Hide the resend button
    }

    submitOTP.addEventListener("click", () => {
        const otpInputs = document.querySelectorAll('.otp-input');
        const otp = Array.from(otpInputs).map(input => input.value).join('');

        if (sendOTP()) {
        window.confirmationResult.confirm(otp).then((result) => {
          const adminType = JSON.parse(localStorage.getItem('adminType'));
          const userType = JSON.parse(localStorage.getItem('userEmail'));

          const currentTime = new Date().getTime();
          const COOKIE_EXPIRATION_HOURS = adminType === 'super_admin' ? 1 : 0.5; // 60 or 30 minutes based on admin type
          const expirationTime = new Date(currentTime + COOKIE_EXPIRATION_HOURS * 60 * 60 * 1000);

          localStorage.setItem('loginTime', expirationTime.toISOString());
          const user = result.user;
          alert('OTP verified successfully');
          hideOTPModal(); // Hide modal after successful verification
      }).catch((error) => {
          console.error('Error during OTP verification:', error);
          document.getElementById('otpError').style.display = 'block';
      });
      
            hideOTPModal(); // Hide the OTP modal upon successful validation
        }
    });

    closeModal.addEventListener("click", hideOTPModal);
    otpOverlay.addEventListener("click", hideOTPModal);

    // Close modal if clicking outside the modal content
    otpOverlay.addEventListener("click", (event) => {
        if (event.target === otpOverlay) {
            hideOTPModal();
        }
    });
    const elements = document.querySelectorAll("button, input, select, textarea, a, li, div, th, td, span, i");
    elements.forEach(element => {
        element.addEventListener("click", (event) => {
            if (element.classList.contains("otp-exempt3")) {
                event.preventDefault();
             
                    showOTPModal();
  
            }
        });
      })
}






