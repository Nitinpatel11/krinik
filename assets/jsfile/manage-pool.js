
var rankList = [];
var array = [];
var array_length = 0;
var table_size = 10;
var start_index = 1;
var end_index = 0;
var current_index = 1;
var max_index = 0;
let totaldatapool = document.querySelector("#total-pool-data");
let otpAdd = document.querySelector("#otpAdd");



async function fetchData() {
  try {
    const response = await fetch("https://krinik.in/add_pool_get/", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    //           const otpapi = await $.ajax({
    //           url: "https://krinik.in/send_otp_get/",
    //           method: "GET"
    //         });
    //         if (otpapi && otpapi.status === "success") {
    //     // Access the first item in the data array
    //     let otpApi1 = otpapi.data[0];

    //     // Get the phone_number from the first item
    //      otpApi = otpApi1.phone_number;
    //      otpApi2 = otpApi1.otp
    //     console.log(otpApi);
    // }

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === "success") {
        rankList = data.data;
        array = rankList; // Initialize array with fetched data
        totaldatapool.innerHTML = array.length;
        console.log(array);
        displayIndexButtons();
      } else {
        console.error("Error: Invalid data format");
      }
    } else {
      console.error("Error fetching data", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}
fetchData()

async function postPhoneNumber() {
  try {
    const response = await $.ajax({
      url: "https://krinik.in/send_otp_get/", // Change this to your POST endpoint
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ phone_number: "7801804996" })
    });

    if (response && response.status === "success") {
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


function preLoadCalculations() {
  array_length = array.length;
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
  $selectedStatus.on('click', function () {
    toggleDropdown();
  });

  // Click event for the arrow to toggle the dropdown
  $arrow.on('click', function () {
    toggleDropdown();
  });

  // Click event for selecting an item from the dropdown
  $dropdownContent3.on('click', 'a', function () {
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
  $clearStatus.on('click', function () {
    $selectedStatus.text('All Status').data('value', 'All Status');
    $arrow.show();
    $clearStatus.hide();
    $dropdownContent3.removeClass('show'); // Hide the dropdown content
    $dropdownBtn3.attr('aria-expanded', 'false'); // Ensure dropdown button is collapsed
    filterRankList(); // Filter with the reset status
  });

  // Click event for closing the dropdown if clicked outside
  $(document).on('click', function (event) {
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

  // $('#tab_filter_text').on('input', function () {
  //   filterRankList();
  // });

  // $('#datefilter').on('apply.daterangepicker', function (ev, picker) {
  //   $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
  //   $('#clearDateBtn').show();
  //   filterRankList();
  // });

  // $('#datefilter').on('cancel.daterangepicker', function (ev, picker) {
  //   $(this).val('');
  //   $('#clearDateBtn').hide();
  //   filterRankList();
  // });

  // $('#clearDateBtn').click(function () {
  //   $('#datefilter').val('start & end date');
  //   $(this).hide();
  //   filterRankList();
  // });

  $('#statusDropdown').change(function () {
    filterRankList();
  });

  fetchData();
});

function filterRankList() {
  var tab_filter_text = $("#tab_filter_text").val().toLowerCase().trim();
  // var datefilter = $('#datefilter').val();
  var datefilter = $('#rangePicker').text().trim();
  const statusFilter = $("#selectedStatus").data('value') || '';
  var startDate, endDate;

  // if (datefilter !== '' && datefilter !== 'start & end date') {
  //     var dates = datefilter.split(' - ');
  //     startDate = parseDate(dates[0] + ' 00:00');
  //     endDate = parseDate(dates[1] + ' 23:59');
  // }
  if (datefilter !== '' && datefilter !== 'Start & End Date') {
    var dates = datefilter.split(' - ');
    startDate = moment(dates[0], 'DD-MM-YYYY').toDate();
    console.log(startDate)
    endDate = moment(dates[1], 'DD-MM-YYYY').toDate();
  }

  var filteredArray = rankList.filter(function (object) {
    var matchDisplayName = object.select_match.match_display_name;
    var parts = matchDisplayName.split(" ");
    var dateAndTime = parts.slice(-2).join(" ");
    var matchesText = true, matchesStatus = true, matchesDate = true;

    if (tab_filter_text !== '') {
      matchesText = (object.pool_name && object.pool_name.toLowerCase().includes(tab_filter_text)) || (object.pool_type && object.pool_type.toLowerCase().includes(tab_filter_text)) ||
        (object.select_match.match_display_name && object.select_match.match_display_name.toLowerCase().includes(tab_filter_text));
    }


    // if (statusFilter !== '') {
    //   const status = getStatus(object.match_start_date, object.match_end_date);
    //   matchesStatus = (status.toLowerCase() === statusFilter);
    // }
    if (statusFilter !== 'All Status') {
      const status = getStatus(object.fantacy_start_date, dateAndTime);
      console.log(status)
      matchesStatus = (status === statusFilter);
      // console.log(matchesStatus ,"okli")
    }

    // if (datefilter !== '' && datefilter !== 'start & end date') {
    //     matchesDate = (parseDate(object.start_league_date) >= startDate && parseDate(object.end_league_date) <= endDate);
    // }
    if (startDate && endDate) {
      matchesDate = (moment(object.fantacy_start_date, 'DD-MM-YYYY').toDate() >= startDate &&
        moment(object.fantacy_start_date, 'DD-MM-YYYY').toDate() <= endDate);
    }

    return matchesText && matchesStatus && matchesDate;
  });

  array = filteredArray;
  current_index = 1;
  displayIndexButtons();
  displayTableRows(); // Add this line to refresh the table
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

// Function to get status based on start and end dates
// function getStatus(start_date, end_date) {
//   var currentDate = new Date();
//   var startDate = parseDate(start_date);
//   // var endDate = parseDate(end_date);
//   var endDate = end_date;


//   if (startDate < currentDate && currentDate <= endDate) {
//     return "Running";
//   } else if (startDate < currentDate && endDate < currentDate) {
//     return "Completed";
//   } else if (startDate > currentDate && endDate > currentDate) {
//     return "Upcoming";
//   } else {
//     return "Unknown";
//   }
// }
function parseDate(dateStr) {
  var parts = dateStr.split(/[- :]/);
  return new Date(parts[2], parts[1] - 1, parts[0], parts[3] || 0, parts[4] || 0);
}
function displayIndexButtons() {
  preLoadCalculations();
  $(".index_buttons ul").empty();

  // Check if the current page is not the first page
  if (current_index > 1) {
    $(".index_buttons ul").append('<button class="paginate_button page-item previous" onclick="prev()">Previous</button>');
  }

  // Display the first two pages
  $(".index_buttons ul").append('<button class="paginate_button page-item" onclick="indexPagination(1)" data-index="1">1</button>');
  if (max_index > 1) {
    $(".index_buttons ul").append('<button class="paginate_button page-item" onclick="indexPagination(2)" data-index="2">2</button>');
  }

  if (max_index > 3) {
    // Add ellipsis if there are pages between the second and the current page
    // if (current_index > 3) {
    //     $(".index_buttons ul").append('<span class="ellipsis">...</span>');
    // }
    if (current_index > 3 && current_index < max_index - 2) {
      $(".index_buttons ul").append('<span class="ellipsis">...</span>');
      $(".index_buttons ul").append('<span class="ellipsis">...</span>');
    } else if (current_index > 3) {
      $(".index_buttons ul").append('<span class="ellipsis">...</span>');
    } else if (current_index < max_index - 2) {
      $(".index_buttons ul").append('<span class="ellipsis">...</span>');
    }
    // Display the current page if it's not one of the first two pages or the last page
    if (current_index > 2 && current_index < max_index) {
      $(".index_buttons ul").append('<button class="paginate_button page-item" onclick="indexPagination(' + current_index + ')" data-index="' + current_index + '">' + current_index + '</button>');
    }

    // Add ellipsis if there are pages between the current page and the last page
    // if (current_index < max_index - 2) {
    //     $(".index_buttons ul").append('<span class="ellipsis">...</span>');
    // }

    // Display the last page
    $(".index_buttons ul").append('<button class="paginate_button page-item" onclick="indexPagination(' + max_index + ')" data-index="' + max_index + '">' + max_index + '</button>');
  } else if (max_index == 3) {
    $(".index_buttons ul").append('<button class="paginate_button page-item" onclick="indexPagination(3)" data-index="3">3</button>');
  }

  // Check if the current page is not the last page
  if (current_index < max_index) {
    $(".index_buttons ul").append('<button class="paginate_button page-item next" onclick="next()">Next</button>');
  }

  highlightIndexButton();
}

function highlightIndexButton() {
  start_index = (current_index - 1) * table_size + 1;
  end_index = Math.min(start_index + table_size - 1, array_length);
  $("#datatable_info").text("Showing " + start_index + " to " + end_index + " of " + array_length + " leagues");
  $(".index_buttons ul button").removeClass("active");
  $('.index_buttons ul button').each(function () {
    if ($(this).text() == current_index) {
      $(this).addClass("active");
    }
  });
  displayTableRows();
}
const adminType = JSON.parse(localStorage.getItem('adminType'))
const adminVal = adminType.value
const statusType = adminType.status



function initializePage1() {
  // HTML for mobile number section and OTP modal
  const otpModalHTML = `
<div id="otpModal" class="modal" style="display:none;z-index:2000">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>OTP Verification</h2>
        <div class="col-md-12 d-flex justify-content-between align-items-center">
            <div class="form-group form-group-custom">
                <input type="text" class="form-control" id="mobilenum" value="Mobile No. 7801804996" readonly style="text-align: center;" />
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

  function validateOTP(otp) {
    let otpsend = String(otpApi2); // Ensure otpApi2 is a string

    if (otp === otpsend) {
      otpError.style.display = "none"; // Hide error if OTP is valid
      return true;
    } else {
      otpError.style.display = "block"; // Show error if OTP is invalid
      return false;
    }
  }

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
    if (validateOTP(otp)) {
      const adminType = JSON.parse(localStorage.getItem('adminType'));
      const userType = JSON.parse(localStorage.getItem('userEmail'));

      const currentTime = new Date().getTime();
      const COOKIE_EXPIRATION_HOURS = adminType === 'super_admin' ? 1 : 0.5; // 60 or 30 minutes based on admin type
      const expirationTime = new Date(currentTime + COOKIE_EXPIRATION_HOURS * 60 * 60 * 1000);

      localStorage.setItem('loginTime', expirationTime.toISOString());
      hideOTPModal(); // Hide the OTP modal upon successful validation
    }
  });

  closeModal.addEventListener("click", hideOTPModal);
  otpOverlay.addEventListener("click", hideOTPModal);
  // resendOtpButton.addEventListener("click",)
  // Close modal if clicking outside the modal content
  resendOtpButton.addEventListener("click", (event) => {
    postPhoneNumber()
    phoneNumber()
    if (event.target === resendOtpButton) {
      resendOtpButton.style.display = "none"
    }
  });
  const getOtpButton = document.getElementById('get-otp-btn');
  getOtpButton.addEventListener('click', function () {
    showOTPModal1();
    postPhoneNumber()
    phoneNumber()
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



if (statusType == "true") {
  otpAdd.classList.add('otp-exempt3')
} else {
  otpAdd.classList.remove('otp-exempt3')

}

function displayTableRows() {
  // Clear existing table rows
  $("table tbody").empty();

  var tab_start = (current_index - 1) * table_size;
  var tab_end = Math.min(current_index * table_size, array.length);

  // Log the length of the array for debugging
  console.log("Array length:", array.length);

  if (array.length === 0) {
    $("#noDataFound").show();
    $("#pagination").hide();
    $("#table-scrolling").css("overflow-x", "hidden");
    return;
  } else {
    $("#noDataFound").hide();
    $("#pagination").show();
    $("#table-scrolling").css("overflow-x", "auto");
  }
  console.log("Items to display:", array.slice(tab_start, tab_end));
  // Loop through the array and display rows
  array.slice(tab_start, tab_end).map((object, index) => {
    console.log('Processing row:', index + tab_start);  // Debugging each row

    // Check if select_match is defined
    if (!object || !object.select_match) {
      console.warn("Skipping object with undefined select_match at index", index + tab_start);
      return;  // Skip this item and move to the next one
    }

    // Process the valid object
    var matchDisplayName = object?.select_match?.match_display_name || "N/A";
    var parts = matchDisplayName.split(" ");
    var dateAndTime = parts.slice(-2).join(" ");
    console.log(dateAndTime);

    var poolType = object?.pool_type || "Unknown";

    // Create table row
    var tr = $("<tr></tr>");

    // Populate table cells with match data
    var noCell = $("<td></td>").text(index + 1 + tab_start);
    var teamNameCell = $("<td colspan='4'></td>").text(`${poolType} - ${object.pool_name}`);
    var totalPoolCell = $("<td colspan='2'></td>").text(object.select_match.match_display_name);
    var fantacyStartCell = $("<td colspan='2'></td>").text(object.fantacy_start_date);
    var fantacyEndCell = $("<td colspan='2'></td>").text(dateAndTime);
    var totalAmountCell = $("<td colspan='3'></td>").text("Your Total Amount");
    var totalPlayersCell = $("<td></td>").text(object.select_match.select_player_A.length + object.select_match.select_player_B.length);
    var statusCell = $("<td colspan='2'></td>").text(getStatus(object.fantacy_start_date, dateAndTime));

    // Handle statusType
    var viewCell, editCell, deleteCell;

    if (statusType == "true") {
      viewCell = $("<td class='otp-exempt3'></td>").html(
        '<span class="sortable otp-exempt3" onclick="handleView(' + object["id"] + ')"><i class="far fa-eye otp-exempt3"></i></span>'
      );
      editCell = $("<td class='otp-exempt3'></td>").html(
        '<span class="sortable otp-exempt3" onclick="handleEdit(' + object["id"] + ')"><i class="far fa-edit otp-exempt3"></i></span>'
      );
      deleteCell = $("<td class='otp-exempt3'></td>").html(
        '<span class="sortable otp-exempt3" onclick="handleDelete(' + object["id"] + ')"><i class="far fa-trash-alt otp-exempt3"></i></span>'
      );
    } else {
      viewCell = $("<td></td>").html(
        '<span class="sortable" onclick="handleView(' + object["id"] + ')"><i class="far fa-eye"></i></span>'
      );
      editCell = $("<td></td>").html(
        '<span class="sortable" onclick="handleEdit(' + object["id"] + ')"><i class="far fa-edit"></i></span>'
      );
      deleteCell = $("<td></td>").html(
        '<span class="sortable" onclick="handleDelete(' + object["id"] + ')"><i class="far fa-trash-alt"></i></span>'
      );
    }

    // Append cells to the row
    tr.append(noCell)
      .append(teamNameCell)
      .append(totalPoolCell)
      .append(fantacyStartCell)
      .append(fantacyEndCell)
      .append(totalAmountCell)
      .append(totalPlayersCell)
      .append(statusCell)
      .append(viewCell)
      .append(editCell)
      .append(deleteCell);

    return tr;  // Return the table row
  }).forEach(tr => {
    // Append each generated table row to the table body
    $("table tbody").append(tr);
  });
}

async function handleDelete(id) {
  if (statusType == "true") {

    initializePage1()

  } else {
    if (confirm("Are you sure you want to delete this match?")) {

      const url = `https://krinik.in/add_pool_get/pool_id/${id}/`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
        });

        if (response.ok) {
          // Fetch the updated list of leagues after deletion
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


async function handleView(id) {
  if (statusType == "true") {

    initializePage1()

  } else {
    const url = `https://krinik.in/add_pool_get/pool_id/${id}/`;
    try {
      const response = await fetch(url);

      if (response.ok) {
        window.location.href = `view-pool-details.html?id=${id}`;
      } else {
        console.error("Failed to fetch the league data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

async function handleEdit(id) {
  if (statusType == "true") {

    initializePage1()

  } else {
    const url = `https://krinik.in/add_pool_get/pool_id/${id}/`;
    try {
      const response = await fetch(url);

      if (response.ok) {
        window.location.href = `edit-pool.html?id=${id}`;
      } else {
        console.error("Failed to fetch the league data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

function prev() {
  if (current_index > 1) {
    current_index--;
    displayIndexButtons();
    // Add logic to display the previous page of items
    highlightIndexButton();
  }
}

function next() {
  if (current_index < max_index) {
    current_index++;
    displayIndexButtons();
    // Add logic to display the next page of items
    highlightIndexButton();
  }
}

function indexPagination(index) {
  current_index = index;
  displayIndexButtons();
  highlightIndexButton();
}

// Get the table element
const table = document.getElementById('matchTable');
const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', () => {
  const workbook = XLSX.utils.table_to_book(table, { sheet: 'Pool Data' });
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pool_data.xlsx';
  a.click();

  URL.revokeObjectURL(url);
  a.remove();
});
history.pushState(null, null, window.location.href);
