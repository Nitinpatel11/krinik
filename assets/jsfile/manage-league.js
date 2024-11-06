
var rankList = [];
var array = [];
var array_length = 0;
var table_size = 10;
var start_index = 1;
var end_index = 0;
var current_index = 1;
var max_index = 0;
var otpApi 
var otpApi2 

let totaldataleague = document.querySelector("#total-league-data");
let otpAdd = document.querySelector("#add-new-btn");
async function fetchData() {
  try {
    const data = await $.ajax({
      url: "https://krinik.in/league_get/",
      method: "GET"
    });
  

    if (data && data.status === "success") {
      rankList = data.data;
      console.log(rankList)
      array = rankList;
      filterAndDisplay();
      totaldataleague.innerHTML = array.length;
    } else {
      console.error("Error: Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

async function postPhoneNumber() {
try {
const response = await $.ajax({
  url: "https://krinik.in/send_otp_get/", // Change this to your POST endpoint
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify({ phone_number: "7801804996"})
});

if (response ) {
  console.log("Phone number posted successfully");
} else {
  console.error("Failed to post phone number", response);
}
} catch (error) {
console.error("Error posting phone number:", error);
}
}

async function phoneNumber() {
try {
const otpapi = await $.ajax({
      url: "https://krinik.in/send_otp_get/",
      method: "GET"
    });

 
    if (otpapi && otpapi.status === "success") {
// Access the first item in the data array
let otpApi1 = otpapi.data[0];

// Get the phone_number from the first item
 otpApi = otpApi1.phone_number;
 otpApi2 = otpApi1.otp
console.log(otpApi);

  console.log("Phone number posted successfully");
} else {
  console.error("Failed to post phone number", response);
}
} catch (error) {
console.error("Error posting phone number:", error);
}
}

// console.log(otpApi)

function filterAndDisplay() {
  filterRankList();
  preLoadCalculations();
  displayIndexButtons();
  displayTableRows();
  highlightIndexButton();
  
}

function preLoadCalculations(filteredArrayLength) {
  array_length = filteredArrayLength || array.length;
  max_index = Math.ceil(array_length / table_size);
}

$(document).ready(function () {
  const $dropdownBtn3 = $('#dropdownBtn3');
const $dropdownContent3 = $('#dropdownContent3');
const $selectedStatus = $('#selectedStatus');
const $arrow = $('#arrowBar'); // Ensure this selector matches your HTML
const $clearStatus = $('#clearStatus');

function toggleDropdown() {
const isExpanded = $dropdownContent3.toggleClass('show').hasClass('show');
$dropdownBtn3.attr('aria-expanded', isExpanded);
}

// Click event for the selected status element to toggle the dropdown
$selectedStatus.on('click', function() {
toggleDropdown();
});

// Click event for the arrow to toggle the dropdown
$arrow.on('click', function() {
toggleDropdown();
});

// Click event for selecting an item from the dropdown
$dropdownContent3.on('click', 'a', function() {
const selectedValue = $(this).data('value');
$selectedStatus.text(selectedValue).data('value', selectedValue);
$dropdownContent3.removeClass('show');

if (selectedValue === 'All Status') {
  $arrow.show();
  $clearStatus.hide();
} else {
  $arrow.hide();
  $clearStatus.show();
}
filterRankList(); // Filter based on the selected status
});

// Click event for clearing the selected status
$clearStatus.on('click', function() {
$selectedStatus.text('All Status').data('value', 'All Status');
$arrow.show();
$clearStatus.hide();
$dropdownContent3.removeClass('show'); // Hide the dropdown content
$dropdownBtn3.attr('aria-expanded', 'false'); // Ensure dropdown button is collapsed
filterRankList(); // Filter with the reset status
});

// Click event for closing the dropdown if clicked outside
$(document).on('click', function(event) {
if (!$selectedStatus.is(event.target) && !$selectedStatus.has(event.target).length && !$dropdownContent3.has(event.target).length && !$arrow.is(event.target) && !$clearStatus.is(event.target)) {
  $dropdownContent3.removeClass('show');
  $dropdownBtn3.attr('aria-expanded', 'false');
}
});




  $('#tab_filter_text').on('input', filterRankList);
  let picker = flatpickr('#rangePicker', {
    mode: 'range',
    dateFormat: 'd-m-Y',
    onClose: function (selectedDates, dateStr, instance) {
      if (!selectedDates || selectedDates.length === 0) {
        instance.clear();
        $('#rangePicker').text('Start & End Date').removeClass('has-dates');
        $('#clearDates').hide();
        $('#calendarIcon').show();
      } else {
        $('#rangePicker').text(selectedDates.map(date => instance.formatDate(date, 'd-m-Y')).join(' - ')).addClass('has-dates');
        $('#clearDates').show();
        $('#calendarIcon').hide();
      }
      filterRankList();
    },
    clickOpens: false,
    allowInput: false
  });

  $('#rangePicker, #calendarIcon').click(function () {
    if (!$('#rangePicker').hasClass('has-dates')) {
      picker.open();
    }
  });

  $('#clearDates').click(function () {
    picker.clear();
    $('#rangePicker').text('Start & End Date').removeClass('has-dates');
    $('#clearDates').hide();
    $('#calendarIcon').show();
    filterRankList();
  });

  $('#statusDropdown').change(filterRankList);
  fetchData();
});

function filterRankList() {
    var tab_filter_text = $("#tab_filter_text").val().toLowerCase().trim();
    var datefilter = $('#rangePicker').text().trim();
    const statusFilter = $("#selectedStatus").data('value') || '';
    var startDate, endDate;

    if (datefilter !== '' && datefilter !== 'Start & End Date') {
        var dates = datefilter.split(' - ');
        startDate = moment(dates[0], 'DD-MM-YYYY').toDate();
        console.log(startDate)
        endDate = moment(dates[1], 'DD-MM-YYYY').toDate();
    }

    var filteredArray = rankList.filter(function (object) {
        var matchesText = true, matchesStatus = true, matchesDate = true;

        if (tab_filter_text !== '') {
            matchesText = (object.league_name && object.league_name.toLowerCase().includes(tab_filter_text)) ||
                (object.short_league_name && object.short_league_name.toLowerCase().includes(tab_filter_text)) ||
                (object.start_league_date && object.start_league_date.toLowerCase().includes(tab_filter_text)) ||
                (object.end_league_date && object.end_league_date.toLowerCase().includes(tab_filter_text));
        }

        // if (statusFilter !== '') {
        //     const status = getStatus(object.start_league_date, object.end_league_date);
        //     matchesStatus = (status === statusFilter);
        // }
        if (statusFilter !== 'All Status') {
          const status = getStatus(object.start_league_date, object.end_league_date)
    console.log(status)
    matchesStatus = (status === statusFilter);
    // console.log(matchesStatus ,"okli")
  }

        if (startDate && endDate) {
            matchesDate = (moment(object.start_league_date, 'DD-MM-YYYY').toDate() >= startDate &&
                moment(object.end_league_date, 'DD-MM-YYYY').toDate() <= endDate);
        }

        return matchesText && matchesStatus && matchesDate;
    });

    array = filteredArray;
    preLoadCalculations();
    current_index = 1;
    displayIndexButtons();
    highlightIndexButton()
    displayTableRows();
}
function getStatus(start_date, end_date) {
  var currentDate = new Date();
  var startDate = moment(start_date, "DD-MM-YYYY HH:mm:ss").toDate();
  var endDate = moment(end_date, "DD-MM-YYYY HH:mm:ss").toDate();

  if (startDate < currentDate && currentDate <= endDate) {
    return "Running";
  } else if (startDate < currentDate && endDate < currentDate) {
    return "Completed";
  } else if (startDate > currentDate && endDate > currentDate) {
    return "Upcoming";
  } else {
    return "unknown";
  }
}


function displayIndexButtons() {
$(".index_buttons ul").empty();

if (array_length <= table_size) {
    // If there are 10 or fewer items, do not show pagination
    return;
}

if (current_index > 1) {
    $(".index_buttons ul").append('<li><button class="paginate_button page-item previous" onclick="prev()">Previous</button></li>');
}

const show_page = getElidedPageRange(current_index, max_index);

show_page.forEach(i => {
    if (i === current_index) {
        $(".index_buttons ul").append('<li><button class="paginate_button page-item active">' + i + '</button></li>');
    } else if (i === "...") {
        $(".index_buttons ul").append('<li><button class="paginate_button page-item">...</button></li>');
    } else {
        $(".index_buttons ul").append('<li><button class="paginate_button page-item" onclick="indexPagination(' + i + ')">' + i + '</button></li>');
    }
});

if (current_index < max_index) {
    $(".index_buttons ul").append('<li><button class="paginate_button page-item next" onclick="next()">Next</button></li>');
}

highlightIndexButton();
}


function getElidedPageRange(current, total) {
    const delta = 1;
    const range = [];
    const left = current - delta;
    const right = current + delta + 1;
    let last = 0;

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= left && i < right)) {
            if (last + 1 !== i) {
                range.push("...");
            }
            range.push(i);
            last = i;
        }
    }

    return range;
}

function highlightIndexButton() {
    start_index = (current_index - 1) * table_size + 1;
    end_index = Math.min(start_index + table_size - 1, array_length);
    $("#datatable_info").text("Showing " + start_index + " to " + end_index + " of " + array_length + " items");
    $(".index_buttons ul a").removeClass("active");
    $('.index_buttons ul a').each(function () {
        if ($(this).text() == current_index) {
            $(this).addClass("active");
        }
    });
    displayTableRows();
}
function prev() {
    if (current_index > 1) {
        current_index--;
        displayIndexButtons();
        highlightIndexButton();
    }
}

function next() {
    if (current_index < max_index) {
        current_index++;
        displayIndexButtons();
        highlightIndexButton();
    }
}

function indexPagination(index) {
    current_index = index;
    displayIndexButtons();
    highlightIndexButton();
}


const adminType =  JSON.parse(localStorage.getItem('adminType'))
const adminVal = adminType.value
const statusType =  adminType.status



// function initializePage1() {
//   // HTML for mobile number section and OTP modal

//   const otpModalHTML = `

//   <div id="otpModal" class="modal" style="display:none;z-index:2000">
 
//       <div class="modal-content">
 
//           <span class="close">&times;</span>
//           <h2>OTP Verification</h2>
//            <div class="col-md-12 d-flex justify-content-between align-items-center">
//             <div class="form-group form-group-custom ">
//                 <input type="text" class="form-control" id="mobilenum" value="Mobile No. ${otpApi}" readonly style="text-align: center;" />
//             </div>

//             <div class=" text-center">
//                 <button class="btn btn-primary " id="get-otp-btn">
//                     Get OTP
//                 </button>
//             </div>
//         </div>
//          <div id="showotptimer" style="display:none;">
//           <div class="otp-inputs text-center">
//               <input type="text" maxlength="1" class="otp-input"/>
//               <input type="text" maxlength="1" class="otp-input"/>
//               <input type="text" maxlength="1" class="otp-input"/>
//               <input type="text" maxlength="1" class="otp-input"/>
//               <input type="text" maxlength="1" class="otp-input"/>
//               <input type="text" maxlength="1" class="otp-input"/>
//           </div>
//           <p class="resend-timer text-end">Resend in <span id="timer">30</span> sec</p>
//           <button id="submitOTP" class="btn btn-primary">Submit</button>
//           <p id="otpError" style="color:red;display:none;">Invalid OTP. Please try again.</p>
//       </div>
//   </div>
//   <div id="otpOverlay" class="overlay" style="display:none;"></div>
// `;

// document.body.insertAdjacentHTML('beforeend', otpModalHTML);

//   // Get elements for OTP modal
//   const otpModal = document.getElementById("otpModal");
//   const otpOverlay = document.getElementById("otpOverlay");
//   const closeModal = otpModal.querySelector(".close");
//   const submitOTP = document.getElementById("submitOTP");
//   const otpError = document.getElementById("otpError");
//   const timerElement = document.getElementById('timer');
//   const timerElement1 = document.getElementById('showotptimer');


//   function showOTPModal() {
//       otpModal.style.display = "block";
//       otpOverlay.style.display = "block";
//       startTimer();
//   }
//   function showOTPModal1() {
//     timerElement1.style.display = "block";
//     otpOverlay.style.display = "block";

// }

//   function hideOTPModal() {
//       otpModal.style.display = "none";
//       otpOverlay.style.display = "none";
//   }
// console.log(String(otpApi2))
//   function validateOTP(otp) {
//     let otpsend = String(otpApi2) 

//      if(otp === otpsend){

//        return otp // Example OTP validation
//      }else{
//       otpError.style.display = "block";
//      }
//   }

//   function startTimer() {
//       let time = 30; // Timer duration in seconds

//       const interval = setInterval(() => {
//           time--;
//           timerElement.textContent = time;
//           if (time <= 0) {
//               clearInterval(interval);
//               timerElement.textContent = '0';
//               // Enable resend functionality here if needed
//           }
//       }, 1000);
//   }

//   submitOTP.addEventListener("click", () => {
//       const otpInputs = document.querySelectorAll('.otp-input');
//       const otp = Array.from(otpInputs).map(input => input.value).join('');
//       console.log(otp)
//       if (validateOTP(otp)) {
//         const adminType = JSON.parse(localStorage.getItem('adminType'));
//         const userType = JSON.parse(localStorage.getItem('userEmail'));

//         const currentTime = new Date().getTime();
//             const COOKIE_EXPIRATION_HOURS_SUPER_ADMIN = 1; // 60 minutes
//             userType.expirationTime = currentTime + (COOKIE_EXPIRATION_HOURS_SUPER_ADMIN * 60 * 60 * 1000); // Update expiration time
//             localStorage.setItem('userEmail', JSON.stringify(userType));
//         // Check if the adminType exists and update its status
//         if (adminType) {
//             adminType.status = "false"; // Update the status as needed

        
//             // Save the updated adminType back to localStorage
//             localStorage.setItem('adminType', JSON.stringify(adminType));
//         }
    
//         hideOTPModal();
    
//     location.reload();

//         // displayTableRows();
//           // Allow action after successful OTP verification
//       } else {
//           otpError.style.display = "block";
//       }
//   });

//   closeModal.addEventListener("click", hideOTPModal);
//   otpOverlay.addEventListener("click", hideOTPModal);

//   // Add event listener to the 'Get OTP' button
//   const getOtpButton = document.getElementById('get-otp-btn');
//   getOtpButton.addEventListener('click', function () {
//       showOTPModal1();
//   });
//   // const elements = document.querySelectorAll("button, input, select, textarea, a,li,div,th,td,span,i");
//   // Add event listeners to elements with the class 'otp-exempt3'
//   // const elements1 = document.querySelectorAll(".otp-exempt3");

//   const elements = document.querySelectorAll("button, input, select, textarea, a, li, div, th, td, span, i");
//   elements.forEach(element => {
//       element.addEventListener("click", (event) => {
//           if (element.classList.contains("otp-exempt3")) {
//               event.preventDefault();
       
//                   showOTPModal();

//           }
//       });
//     })
// }


// function initializePage1() {
// // HTML for mobile number section and OTP modal
// const otpModalHTML = `
// <div id="otpModal" class="modal" style="display:none;z-index:2000">
//     <div class="modal-content">
//         <span class="close">&times;</span>
//         <h2>OTP Verification</h2>
//         <div class="col-md-12 d-flex justify-content-between align-items-center">
//             <div class="form-group form-group-custom">
//                 <input type="text" class="form-control" id="mobilenum" value="" readonly style="text-align: center;" />
//             </div>
//             <div class="text-center">
//                 <button class="btn btn-primary" id="get-otp-btn">Get OTP</button>
//             </div>
//         </div>
//         <div id="showotptimer" style="display:none;">
//             <div class="otp-inputs text-center">
//                 <input type="text" maxlength="1" class="otp-input" />
//                 <input type="text" maxlength="1" class="otp-input" />
//                 <input type="text" maxlength="1" class="otp-input" />
//                 <input type="text" maxlength="1" class="otp-input" />
//                 <input type="text" maxlength="1" class="otp-input" />
//                 <input type="text" maxlength="1" class="otp-input" />
//             </div>
//             <p class="resend-timer text-end">
//                 Resend in <span id="timer">30</span> sec
//                 <button id="resend-otp-btn" style="display:none;">Resend OTP</button>
//             </p>
//             <button id="submitOTP" class="btn btn-primary">Submit</button>
//             <p id="otpError" style="color:red;display:none;">Invalid OTP. Please try again.</p>
//         </div>
//     </div>
//     <div id="otpOverlay" class="overlay" style="display:none;"></div>
// </div>`;

// document.body.insertAdjacentHTML('beforeend', otpModalHTML);

// // Get elements for OTP modal
// const otpModal = document.getElementById("otpModal");
// const otpOverlay = document.getElementById("otpOverlay");
// const closeModal = otpModal.querySelector(".close");
// const submitOTP = document.getElementById("submitOTP");
// const otpError = document.getElementById("otpError");
// const timerElement = document.getElementById('timer');
// const timerElement1 = document.getElementById('showotptimer');
// const resendOtpButton = document.getElementById('resend-otp-btn');

// function showOTPModal() {
//   otpModal.style.display = "block";
//   otpOverlay.style.display = "block";
//   startTimer();

// }
// function showOTPModal1() {
// timerElement1.style.display = "block";
// otpOverlay.style.display = "block";

// }

// function hideOTPModal() {
//     otpModal.style.display = "none";
//     otpOverlay.style.display = "none";
//     resetTimer(); // Reset the timer when hiding the modal
// }

// function validateOTP(otp) {
//     let otpsend = String(otpApi2); // Ensure otpApi2 is a string
// console.log( otpsend)
//     if (otp === otpsend) {
//         otpError.style.display = "none"; // Hide error if OTP is valid
//         return true;
//     } else {
//         otpError.style.display = "block"; // Show error if OTP is invalid
//         return false;
//     }
// }

// let timerIntervalId = null;

// function startTimer() {
//     let time = 30; // Timer duration in seconds

//     if (timerIntervalId !== null) {
//         clearInterval(timerIntervalId);
//     }

//     timerIntervalId = setInterval(() => {
//         time--;
//         timerElement.textContent = time;
//         if (time <= 0) {
//             clearInterval(timerIntervalId);
//             timerElement.textContent = '0';
//             resendOtpButton.style.display = 'inline-block'; // Show the resend button
//         }
//     }, 1000);
// }

// function resetTimer() {
//     if (timerIntervalId !== null) {
//         clearInterval(timerIntervalId);
//         timerIntervalId = null;
//     }
//     timerElement.textContent = '30'; // Reset the timer display
//     resendOtpButton.style.display = 'none'; // Hide the resend button
// }

// submitOTP.addEventListener("click", () => {
//     // const otpInputs = document.querySelectorAll('.otp-input');
//     // const otp = Array.from(otpInputs).map(input => input.value).join('');
//     const otpInputs = document.querySelectorAll('.otp-input');
//             const otp = Array.from(otpInputs).map(input => input.value).join('');
            
//             window.confirmationResult.confirm(otp).then((result) => {
//                 const user = result.user;
//                 alert('OTP verified successfully');
//                 if (validateOTP(otp)) {
//                   const adminType = JSON.parse(localStorage.getItem('adminType'));
//                   const userType = JSON.parse(localStorage.getItem('userEmail'));
          
//                   const currentTime = new Date().getTime();
//                   const COOKIE_EXPIRATION_HOURS = adminType === 'super_admin' ? 1 : 0.5; // 60 or 30 minutes based on admin type
//                   const expirationTime = new Date(currentTime + COOKIE_EXPIRATION_HOURS * 60 * 60 * 1000);
          
//                   localStorage.setItem('loginTime', expirationTime.toISOString());
//                   hideOTPModal(); // Hide the OTP modal upon successful validation
//               }
//                 hideOTPModal(); // Hide modal after successful verification
//             }).catch((error) => {
//                 console.error('Error during OTP verification:', error);
//                 document.getElementById('otpError').style.display = 'block';
//             });
//     console.log( otp)
   
// });

// closeModal.addEventListener("click", hideOTPModal);
// otpOverlay.addEventListener("click", hideOTPModal);
// // resendOtpButton.addEventListener("click",)
// // Close modal if clicking outside the modal content
// resendOtpButton.addEventListener("click", (event) => {
//   postPhoneNumber()
//   // phoneNumber()
//     if (event.target === resendOtpButton) {
//       resendOtpButton.style.display = "none"
//     }

    
// });

// const firebaseConfig = {
//   apiKey: "AIzaSyBMIXxBISZnryQeOgKRs73TqVRXkshd0KM",
//   authDomain: "krinkin-309ee.firebaseapp.com",
//   projectId: "krinkin-309ee",
//   storageBucket: "krinkin-309ee.appspot.com",
//   messagingSenderId: "397386970252",
//   appId: "1:397386970252:web:9655f412b4280a036d77a9"
// };

// firebase.initializeApp(firebaseConfig);

// // Function to set up reCAPTCHA
// function setupRecaptcha() {
//   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
//       'size': 'invisible',
//       'callback': function(response) {
//           // reCAPTCHA solved
//       }
//   });
// }

// const getOtpButton = document.getElementById('get-otp-btn');
// getOtpButton.addEventListener('click', function () {
//   // showOTPModal1();
//   postPhoneNumber()
//   setupRecaptcha();
//   const phoneNumber = document.getElementById('mobilenum').value;
//   const appVerifier = window.recaptchaVerifier;

//   firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
//       .then((confirmationResult) => {
//           window.confirmationResult = confirmationResult;
//           alert('OTP sent');
//           showOTPModal1(); // Show OTP input fields after sending OTP
//       }).catch((error) => {
//           console.error('Error during OTP send:', error);
//           alert('Failed to send OTP');
//       });
//   // phoneNumber()
// });


// const elements = document.querySelectorAll("button, input, select, textarea, a, li, div, th, td, span, i");
// elements.forEach(element => {
//     element.addEventListener("click", (event) => {
//         if (element.classList.contains("otp-exempt3")) {
//             event.preventDefault();
         
//                 showOTPModal();

//         }
//     });
//   })
//   function showOTPModal1() {
//     document.getElementById('showotptimer').style.display = "block";
//     startTimer(); // Start the OTP resend timer
//   }
  
//   function hideOTPModal() {
//     document.getElementById("otpModal").style.display = "none";
//     document.getElementById("otpOverlay").style.display = "none";
//   }

//   function startTimer() {
//     let time = 30; // Timer duration in seconds
  
//     if (timerIntervalId !== null) {
//         clearInterval(timerIntervalId);
//     }
  
//     timerIntervalId = setInterval(() => {
//         time--;
//         document.getElementById('timer').textContent = time;
//         if (time <= 0) {
//             clearInterval(timerIntervalId);
//             document.getElementById('timer').textContent = '0';
//             document.getElementById('resend-otp-btn').style.display = 'inline-block'; // Show resend button
//         }
//     }, 1000);
//   }
  
//   document.getElementById('get-otp-btn').addEventListener('click', sendOTP);
  
//   document.getElementById('submitOTP').addEventListener('click', verifyOTP);
// }
function initializePage1() {
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


if( statusType == "true"){
otpAdd.classList.add('otp-exempt3')
}else{
otpAdd.classList.remove('otp-exempt3')

}


// Timer functionality
let timerIntervalId = null;



// function displayTableRows() {
//   $("table tbody").empty();
//   var tab_start = start_index - 1;
//   var tab_end = end_index;

//   if (array.length === 0) {
//     $("#noDataFound").show();
//     $("#pagination").hide();
//     $("#table-scrolling").css("overflow-x", "hidden"); // Add this line
//     return;
//   } else {
//     $("#noDataFound").hide();
//     $("#pagination").show();
//     $("#table-scrolling").css("overflow-x", "auto"); // Add this line
//   }

//   for (var i = tab_start; i < tab_end; i++) {
//     var showdata = array[i];
//     var status = getStatus(showdata["start_league_date"], showdata["end_league_date"]);

//     var tr = $("<tr></tr>");

//     var noCell = $("<td></td>").text(i + 1);
//     var fullNameCell = $("<td colspan='2'></td>").text(showdata["league_name"] || "");
//     var shortNameCell = $("<td colspan='2'> </td>").text(showdata["short_league_name"] || "");

//     var logoCell = $("<td></td>").html(
//       showdata["league_image"]
//         ? `<img src="https://krinik.in${showdata["league_image"]}" alt="" class="team-logo lazyload" />`
//         : ""
//     );


//     var dateCell = $("<td colspan='2'></td>").text(
//       (showdata["start_league_date"] || "") +
//       " - " +
//       (showdata["end_league_date"] || "")
//     );
//     var statusCell = $("<td colspan='2'></td>").text(status);
   
  
//     if(statusType == "true"){
//       var viewCell = $("<td class='otp-exempt3'></td>").html(
//       // '<span class="" onclick="window.location.href=\'view-league-details.html\'"><i class="far fa-eye"></i></span>'
//         '<span class=" otp-exempt3 " onclick="viewLeagueDetails(\'' + showdata["league_name"] + '\')"><i class="far fa-eye otp-exempt3"></i></span>'
//     );
//       var editCell = $("<td class=''></td>").html(
//         '<span class=" otp-exempt3" onclick="handleEdit(' + showdata["id"] + ')"><i class="far fa-edit otp-exempt3"></i></span>'
//       );
//       var deleteCell = $("<td class='otp-exempt3'></td>").html(
//       '<span class=" otp-exempt3" onclick="handleDelete(' + showdata["id"] + ')"><i class="far fa-trash-alt otp-exempt3"></i></span>'
//     );

//     }else{
//       var viewCell = $("<td class=''></td>").html(
//       // '<span class="" onclick="window.location.href=\'view-league-details.html\'"><i class="far fa-eye"></i></span>'
//         '<span class="  " onclick="viewLeagueDetails(\'' + showdata["league_name"] + '\')"><i class="far fa-eye "></i></span>'
//     );
//       var editCell = $("<td class=''></td>").html(
//       '<span class="" onclick="handleEdit(' + showdata["id"] + ')"><i class="far fa-edit "></i></span>'
//     );
//     var deleteCell = $("<td class=''></td>").html(
//       '<span class=" " onclick="handleDelete(' + showdata["id"] + ')"><i class="far fa-trash-alt "></i></span>'
//     );
//     }
    
//     // console.log(statusType ,"dfg")
//     tr.append(noCell)
//       .append(fullNameCell)
//       .append(shortNameCell)
//       .append(logoCell)
//       .append(dateCell)
//       .append(statusCell)
//       .append(viewCell)
//       .append(editCell)
//       .append(deleteCell);

//     if (status === "Completed") {
//       noCell.addClass("disabled-row");
//       fullNameCell.addClass("disabled-row");
//       shortNameCell.addClass("disabled-row");
//       logoCell.addClass("disabled-row");
//       dateCell.addClass("disabled-row");
//       statusCell.addClass("disabled-row");
//       editCell.addClass("disabled-row");
//     }
 

//     $("table tbody").append(tr);
//   }
//   // lazyLoadImages(); // Call the lazy loading function after adding rows
// }
const columnWidths = [
  "5%",   // Column for serial number
  "15%",  // Column for full league name
  "15%",  // Column for short league name
  "10%",  // Column for logo
  "15%",  // Column for dates
  "8%",  // Column for status
  "5%",   // Column for view action
  "5%",   // Column for edit action
  "5%"    // Column for delete action
];

function displayTableRows() {
  $("table tbody").empty();
  var tab_start = start_index - 1;
  var tab_end = end_index;

  if (array.length === 0) {
      $("#noDataFound").show();
      $("#pagination").hide();
      return;
  } else {
      $("#noDataFound").hide();
      $("#pagination").show();
  }

  for (var i = tab_start; i < tab_end; i++) {
      var showdata = array[i];
      var status = getStatus(showdata["start_league_date"], showdata["end_league_date"]);

      var tr = $("<tr></tr>");
      var noCell = $("<td></td>").text(i + 1).css("width", columnWidths[0]);
      var fullNameCell = $("<td></td>").text(showdata["league_name"] || "").css("width", columnWidths[1]);
      var shortNameCell = $("<td></td>").text(showdata["short_league_name"] || "").css("width", columnWidths[2]);

      var logoCell = $("<td></td>").html(
          showdata["league_image"]
              ? `<img src="https://krinik.in${showdata["league_image"]}" alt="" class="team-logo" />`
              : ""
      ).css("width", columnWidths[3]);

      var dateCell = $("<td></td>").text(
          (showdata["start_league_date"] || "") +
          " - " +
          (showdata["end_league_date"] || "")
      ).css("width", columnWidths[4]);

      var statusCell = $("<td></td>").text(status).css("width", columnWidths[5]);

      var viewCell = $("<td></td>").html(
          `<span onclick="viewLeagueDetails('${showdata["league_name"]}')"><i class="far fa-eye"></i></span>`
      ).css("width", columnWidths[6]);

      var editCell = $("<td></td>").html(
          `<span onclick="handleEdit(${showdata["id"]})"><i class="far fa-edit"></i></span>`
      ).css("width", columnWidths[7]);

      var deleteCell = $("<td></td>").html(
          `<span onclick="handleDelete(${showdata["id"]})"><i class="far fa-trash-alt"></i></span>`
      ).css("width", columnWidths[8]);

      tr.append(noCell)
        .append(fullNameCell)
        .append(shortNameCell)
        .append(logoCell)
        .append(dateCell)
        .append(statusCell)
        .append(viewCell)
        .append(editCell)
        .append(deleteCell);

      $("table tbody").append(tr);
  }
}





async function handleDelete(id) {
  if( statusType == "true"){      

initializePage1()

}else{
  if (confirm('Are you sure you want to delete this league?')) {
    const url = `https://krinik.in/league_get/${id}/`;
    try {
      const response = await fetch(url, { method: "DELETE" });

      if (response.ok) {
        await fetchData();
      } else {
        console.error("Failed to delete the league");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
}
}
function viewLeagueDetails(leagueName) {
  if( statusType == "true"){      

initializePage1()

}else{
// Encode league name for URL
var encodedLeagueName = encodeURIComponent(leagueName);
// Redirect to view league details page with league name as query parameter
window.location.href = 'view-league-details.html?leagueName=' + encodedLeagueName;
}
}


console.log(statusType,"sh")
async function handleEdit(id) {

  

  if( statusType == "true"){      

      initializePage1()
    
  }else{
    const url = `https://krinik.in/league_get/${id}/`;
  try {
    const response = await fetch(url);

    if (response.ok) {
      window.location.href = `editleague.html?id=${id}`;
    } else {
      console.error("Failed to fetch the league data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  }

 
}


const table = document.getElementById('tech-companies-1');
const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', () => {
const workbook = XLSX.utils.table_to_book(table, { sheet: 'League Data' });
const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
const url = URL.createObjectURL(data);
const a = document.createElement('a');
a.href = url;
a.download = 'league_data.xlsx';
a.click();

URL.revokeObjectURL(url);
a.remove();
});
history.pushState(null, null, window.location.href);


fetchData();
