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



//   // Function to create and show the modal
//   function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     return null;
// }


// // Function to check and handle the cookie
// function checkCookie() {
//     const userEmail = getCookie('userEmail');
    
//     // Check if the redirection flag is not set
//     if (!userEmail && !localStorage.getItem('redirected')) {
//         // Set a flag to indicate that redirection is in progress
//         localStorage.setItem('redirected', 'true');

//         // Use replace to avoid adding the redirect to history
//         window.location.reload()
//         window.location.replace('./index.html');
//     } else {
//         // Clear the redirection flag if cookie exists
//         localStorage.removeItem('redirected');
//     }
// }





// let logoutTimer;

// function startLogoutTimer() {
//     // Clear existing timer, if any
//     clearTimeout(logoutTimer);

//     const logoutTime = getCookie('logoutTime');
//     const currentTime = new Date().getTime();
//     const currentTimeDiff = logoutTime ? logoutTime - currentTime : 60 * 60 * 1000;

//     // Set new timeout for 60 minutes or remaining time
//     logoutTimer = setTimeout(logoutUser, currentTimeDiff);
// }

// function logoutUser() {
//     // Perform logout actions here, e.g., clear session, redirect to login page
//     console.log('User logged out due to inactivity.');
//     eraseCookie('userEmail');
//     eraseCookie('adminType');
//     window.location.href = './index.html';
// }

// function eraseCookie(name) {
//     document.cookie = `${name}=; Max-Age=-99999999; path=/`;
// }

// // Call startLogoutTimer on page load
// window.onload = () => {
//   checkCookie();
//   startLogoutTimer();

 
// };


// const LOCAL_STORAGE_EXPIRATION_KEY = 'expiration';
// const REGULAR_USER_EXPIRATION_SECONDS = 30 * 60; // 30 minutes
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
  if (adminType === 'super admin') {
    initializePage();
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
  const timeDisplay1 = document.getElementById('time_show1');


  function update() {
    const currentTime = new Date().getTime();
    const timeRemaining = Math.max(logoutTime - currentTime, 0);
    console.log(timeRemaining,"abc")
    if(adminType == "admin"){
      timeDisplay1.style.display = "none"
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
      // Log element details to debug the condition
      console.log("Checking element:", element);
      console.log("Has otp-exempt class:", element.classList.contains("otp-exempt"));
      console.log("ID is showotppage:", element.id === "showotppage");

      if (element.classList.contains("otp-exempt")) {
          console.log("Hiding element:", element);
          element.style.display = "none"; // Hide elements that don't have 'otp-exempt' class and are not the 'showotppage' element
      } 
  });
}
