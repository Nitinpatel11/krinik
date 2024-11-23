import {checkAdminAccess}  from "../js/initial.js"

var rankList = [];
var array = [];
var array_length = 0;
var table_size = 10;
var start_index = 1;
var end_index = 0;
var current_index = 1;
var max_index = 0;
let userNameSpan = document.querySelector("#user-name-span");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
console.log(id);

async function fetchUserData() {
  try {
    if (!id) {
      console.warn('No player ID found in URL.');
      return;
    }

    const url = `https://krinik.in/user_get/${id}/`;
    console.log('Fetching player data from:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch player data');
    }

    const userData1 = await response.json();
    const userDataId = userData1.data.id;
    console.log(userData1,"olpmn"); 
    fetchData(userDataId)
    // const newAmounts = await addAmount(userData.id);

  } catch (error) {
    console.error('Error fetching player data:', error);
  }
}


async function fetchData(Id) {
try {
const response = await $.ajax({
  url: "https://krinik.in/withdraw_history/",
  method: "GET"
});

if (response && response.status === "success" && response.data) {
  // Filter data where id matches the URL id
  let store =response.data
console.log(store,"ok")
          rankList = store.filter(item => item.id === Id);
          userNameSpan.innerHTML = rankList[0].Player_Name
          console.log(userNameSpan,"ploik")
  // Check if the rankList is not empty
  if (rankList.length > 0) {
    array = rankList;
    console.log(array,"plo")
    filterAndDisplay(); // Call the function to filter and display data
  } else {
    console.error("No matching data found for the given ID");
  }
} else {
  console.error("Error: Invalid data format or ID mismatch");
}
} catch (error) {
console.error("Error fetching data", error);
}
}

fetchUserData();

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



// Initialize Flatpickr
// let picker = flatpickr('#rangePicker', {
//   mode: 'range',
//   dateFormat: 'd-m-Y',
//   onClose: function (selectedDates, dateStr, instance) {
//     if (!selectedDates || selectedDates.length === 0) {
//       instance.clear();
//       $('#rangePicker').text('Start & End Date').removeClass('has-dates');
//       $('#clearDates').hide();
//       $('#calendarIcon').show();
//     } else {
//       $('#rangePicker').text(selectedDates.map(date => instance.formatDate(date, 'd-m-Y')).join(' - ')).addClass('has-dates');
//       $('#clearDates').show();
//       $('#calendarIcon').hide();
//     }
//     filterRankList();
//   },
//   clickOpens: false,
//   allowInput: false
// });

// $('#rangePicker, #calendarIcon').click(function () {
//   if (!$('#rangePicker').hasClass('has-dates')) {
//     picker.open();
//   }
// });

// $('#clearDates').click(function () {
//   picker.clear();
//   $('#rangePicker').text('Start & End Date').removeClass('has-dates');
//   $('#clearDates').hide();
//   $('#calendarIcon').show();
//   filterRankList();
// });

function updateAmountFilters() {
const startAmount = $('#startAmountRange').val().trim();
const endAmount = $('#endAmountRange').val().trim();

// Show or hide clear buttons based on input values
if (startAmount !== '' && endAmount === '') {
$('#clearAmountStart').show();
$('#clearAmountEnd').hide();
} else if (startAmount !== '' && endAmount !== '') {
$('#clearAmountStart').show();
$('#clearAmountEnd').show();
} else if (startAmount === '' && endAmount === '') {
$('#clearAmountStart').hide();
$('#clearAmountEnd').hide();
} else if (startAmount === '' && endAmount !== '') {
$('#clearAmountStart').hide();
$('#clearAmountEnd').show();
}

// Always call filterRankList to apply the filter
filterRankList();
}

$('#startAmountRange').on('input', function () {
updateAmountFilters();
});

// Event listeners for the end amount range input
$('#endAmountRange').on('input', function () {
updateAmountFilters();
});

// Event listener for clearing the start amount range
$('#clearAmountStart').click(function () {
$('#startAmountRange').val('');
updateAmountFilters(); // Call the update function to handle the UI changes
});

// Event listener for clearing the end amount range
$('#clearAmountEnd').click(function () {
$('#endAmountRange').val('');
updateAmountFilters(); // Call the update function to handle the UI changes
});

// Initial call to update filters and hide/show clear buttons on page load
updateAmountFilters();
$('#tab_filter_text').on('input', function () {
filterRankList();
});
});

function filterRankList() {
  var tab_filter_text = $("#tab_filter_text").val().toLowerCase().trim();
console.log('Search Text:', tab_filter_text);
// var datefilter = $('#rangePicker').text().trim();
const statusFilter = $("#selectedStatus").data('value') || ''; 
  var startDate, endDate;
  var startAmount = parseFloat($('#startAmountRange').val().trim()) || -Infinity;
  var endAmount = parseFloat($('#endAmountRange').val().trim()) || Infinity;

//   if (datefilter !== '' && datefilter !== 'Start & End Date') {
//   var dates = datefilter.split(' - ');
//   startDate = moment(dates[0], 'D-M-YYYY').startOf('day').toDate();
//   endDate = moment(dates[1], 'D-M-YYYY').endOf('day').toDate();
//   // console.log('Parsed Start Date:', startDate);
//   // console.log('Parsed End Date:', endDate);
// }
  var filteredArray = rankList.filter(function (object) {
    // var matchesText = true, matchesStatus = true, matchesDate = true, matchesAmount = true;
    var matchesText = true, matchesStatus = true, matchesAmount = true;


    if (tab_filter_text !== '') {
      matchesText = (object.Player_Name && object.Player_Name.toLowerCase().includes(tab_filter_text)) ||
        (object.Account && object.Account.toString().toLowerCase().includes(tab_filter_text)) ||
        (object.Payment_Method && object.Payment_Method.toLowerCase().includes(tab_filter_text)) ;
    }

    // if (statusFilter !== '') {
    //   const status = getStatus(object.Status);
    //   matchesStatus = (status === statusFilter);
    // }
    if (statusFilter !== 'All Status') {
  const status = object.Status.toLowerCase()
  console.log(status)
  matchesStatus = (status === statusFilter);
  console.log(matchesStatus ,"okli")
}

  //   if (startDate && endDate) {
  //   const objectDate = moment(object.date_time, 'YYYY-MM-DD HH:mm:ss').toDate();
  //   matchesDate = (objectDate >= startDate && objectDate <= endDate);
  //   // console.log('Object Date:', objectDate, 'Matches Date:', matchesDate);
  // }

  // Filter based on amount range
  if (!isNaN(object.Amount)) {
    const amount = parseFloat(object.Amount);
    matchesAmount = (amount >= startAmount && amount <= endAmount);
    // console.log('Object Amount:', amount, 'Matches Amount:', matchesAmount);
  }


    // return matchesText && matchesStatus && matchesDate && matchesAmount;
    return matchesText && matchesStatus && matchesAmount;

  });

  array = filteredArray;
  preLoadCalculations();
  current_index = 1;
  displayIndexButtons();
  highlightIndexButton()
  displayTableRows();
}
// function getStatus(start_date, end_date) {
//   var currentDate = new Date();
//   var startDate = moment(start_date, "DD/MM/YYYY").toDate();
//   var endDate = moment(end_date, "DD/MM/YYYY").toDate();

//   if (startDate < currentDate && currentDate <= endDate) {
//     return "Running";
//   } else if (startDate < currentDate && endDate < currentDate) {
//     return "Completed";
//   } else if (startDate > currentDate && endDate > currentDate) {
//     return "Upcoming";
//   } else {
//     return "unknown";
//   }
// }
function getStatus(status) {
if (status === "success" || status === "Success") {
  return `<span class="material-symbols-outlined" style="color:green">check_circle</span>`;
} else if (status === "fail" || status === "Fail") {
  return `<span class="material-symbols-outlined" style="color:red">error</span>`;
} else if (status === "pending" || status === "Pending") {
  return `<span class="material-symbols-outlined" style="color:#fbde08">schedule</span>`;
} else {
  return "unknown";
}
}
window.getStatus = getStatus

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
window.prev = prev;
window.next = next;
window.indexPagination = indexPagination;

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



function displayTableRows() {
  $("table tbody").empty();
  var tab_start = start_index - 1;
  var tab_end = end_index;

  if (array.length === 0) {
    $("#noDataFound").show();
    $("#pagination").hide();
    $("#table-scrolling").css("overflow-x", "hidden"); // Add this line
    return;
  } else {
    $("#noDataFound").hide();
    $("#pagination").show();
    $("#table-scrolling").css("overflow-x", "auto"); // Add this line
  }

  for (var i = tab_start; i < tab_end; i++) {
    var showdata = array[i];
    console.log(showdata,"showing")
    // var status = getStatus(showdata["start_league_date"], showdata["end_league_date"]);

    var tr = $("<tr></tr>");

    var noCell = $("<td></td>").text(i + 1);
    var poolNameCell = $("<td colspan='3'></td>").text(showdata["Player_Name"] || "");
    var poolTypeCell = $("<td colspan='3'> </td>").text(showdata["Payment_Method"] || "");
    var userNameCell = $("<td colspan='3'> </td>").text(showdata["Account"] || "");
    // var mobileCell = $("<td colspan='3'> </td>").text(showdata["Amount"] || "");

    // var transactionId = $("<td colspan='3'> </td>").text(showdata["transactions_id"] || "");
    // var credit_debitCell = $("<td colspan='2'> </td>").text(showdata["Status"] || "");
    var amountCell = $("<td colspan='3'> </td>").text(showdata["Amount"] || ""); // Initialize amountCell

    // if (showdata["credit_debit"] === "credit" || showdata["credit_debit"] === "Credit") {
    //   amountCell.html(`<span style="color: green;font-weight:600">&#x2b;${showdata["amount"] || ""}</span>`);
    // } else if (showdata["credit_debit"] === "debit" || showdata["credit_debit"] === "Debit") {
    //   amountCell.html(`<span style="color: red;font-weight:600">&#x2212;${showdata["amount"] || ""}</span>`);
    // }
    var statusCell = $("<td colspan='2'></td>").text(showdata["Status"]);
    if (showdata["Status"] === "success" || showdata["Status"] === "Success") {
      statusCell.html(`<span class="material-symbols-outlined" style="color:green">check_circle</span>`);
    } else if (showdata["Status"] === "fail" || showdata["Status"]=== "Fail") {
      statusCell.html(` <span class="material-symbols-outlined" style="color:red">error</span>`);
    }else if (showdata["Status"] === "pending" || showdata["Status"]=== "Pending") {
      statusCell.html(`<span class="material-symbols-outlined" style="color:#fbde08">schedule</span>`);
    }

    var actionCell = $("<td colspan='2'></td>").text(showdata["Action"]);
    if (showdata["Action"] === "check" || showdata["Action"] === "Check") {
      actionCell.html(` <span class="material-symbols-outlined" style="color : blue">verified</span> `);
    }

   
    tr.append(noCell)
      .append(poolNameCell)
      .append(poolTypeCell)
      .append(userNameCell)
      // .append(mobileCell)
      // .append(transactionId)
      // .append(credit_debitCell)
      .append(amountCell)
      .append(statusCell)
      .append(actionCell)
    // .append(deleteCell);

    // if (credit_debitCell === "credit" || credit_debitCell === "Credit") {

    // }

    $("table tbody").append(tr);
  }

}


window.onload = checkAdminAccess();

