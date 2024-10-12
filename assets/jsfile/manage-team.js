

   var rankList = [];
    var array = [];
    var array_length = 0;
    var table_size = 10;
    var start_index = 1;
    var end_index = 0;
    var current_index = 1;
    var max_index = 0;
  let totaldatateam = document.querySelector("#total-team-data");
  let otpAdd = document.querySelector("#otpAdd");
  async function fetchData() {
      try {
          // Fetch teams data
          const teamsResponse = await fetch("https://krinik.pythonanywhere.com/team_get/", {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          // Fetch leagues data
          const leaguesResponse = await fetch("https://krinik.pythonanywhere.com/league_get/", {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json'
              }
          });
        //   const otpapi = await $.ajax({
        //   url: "https://krinik.pythonanywhere.com/send_otp_get/",
        //   method: "GET"
        // });
//         if (otpapi && otpapi.status === "success") {
//     // Access the first item in the data array
//     let otpApi1 = otpapi.data[0];
    
//     // Get the phone_number from the first item
//      otpApi = otpApi1.phone_number;
//      otpApi2 = otpApi1.otp
//     console.log(otpApi);
// }

          if (teamsResponse.ok && leaguesResponse.ok) {
              const teamsData = await teamsResponse.json();
              const leaguesData = await leaguesResponse.json();

              if (teamsData.status === "success" && leaguesData.status === "success") {
                  rankList = teamsData.data; // Update rankList with fetched teams data
                  array = rankList.slice(); // Initialize array with fetched teams data (make a copy)
                  totaldatateam.innerHTML = rankList.length;
                  // Populate league dropdown options
                  populateLeagueDropdown(leaguesData.data);

                  // Perform initial filtering and display
                  filterRankList();
              } else {
                  console.error("Error: Invalid data format");
              }
          } else {
              console.error("Error fetching data");
          }
      } catch (error) {
          console.error("Error fetching data", error);
      }
  }

  async function postPhoneNumber() {
  try {
    const response = await $.ajax({
      url: "https://krinik.pythonanywhere.com/send_otp_get/", // Change this to your POST endpoint
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ phone_number: "7801804996"})
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
          url: "https://krinik.pythonanywhere.com/send_otp_get/",
          method: "GET"
        });        

    if (otpapi && otpapi.status === "success" ) {
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


  $(document).ready(function () {

    const $dropdownBtn3 = $('#dropdownBtn3');
  const $dropdownContent3 = $('#leagueDropdown'); // Fixed ID selector
  const $selectedStatus = $('#selectedStatus');
  const $arrow = $('#arrowBar');
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

    if (selectedValue === 'All Leagues') {
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
    $selectedStatus.text('All Leagues').data('value', 'All Leagues');
    $arrow.show();
    $clearStatus.hide();
    $dropdownContent3.removeClass('show'); // Hide the dropdown content
    $dropdownBtn3.attr('aria-expanded', 'false'); // Ensure dropdown button is collapsed
    filterRankList(); // Filter with the reset status
  });

  // Click event for closing the dropdown if clicked outside
  $(document).on('click', function(event) {
    if (!$selectedStatus.is(event.target) && !$selectedStatus.has(event.target).length &&
        !$dropdownContent3.has(event.target).length && !$arrow.is(event.target) &&
        !$clearStatus.is(event.target)) {
      $dropdownContent3.removeClass('show');
      $dropdownBtn3.attr('aria-expanded', 'false');
    }
  });

      // Event handler for search input
      $('#tab_filter_text').on('input', function () {
          filterRankList(); // Trigger filtering when search text changes
      });

      // Event handler for date range picker
      $('#datefilter').on('apply.daterangepicker', function (ev, picker) {
          $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
          $('#clearDateBtn').show();
          filterRankList(); // Trigger filtering when date range is applied
      });

      // Event handler for clearing date range
      $('#clearDateBtn').click(function () {
          $('#datefilter').val('');
          $(this).hide();
          filterRankList(); // Trigger filtering when date range is cleared
      });

      // Initial call to fetch data
      fetchData();
  });

  function preLoadCalculations(filteredArrayLength) {
      array_length = filteredArrayLength || array.length;
      max_index = Math.ceil(array_length / table_size);
    }
  // Function to populate league dropdown
  function populateLeagueDropdown(leagues) {
  var dropdown = document.getElementById('leagueDropdown');
  dropdown.innerHTML = ''; // Clear existing options

  // Create a default "All Leagues" item
  // var defaultItem = document.createElement('a');
  // defaultItem.textContent = 'All Leagues';
  // defaultItem.setAttribute('data-value', 'All Leagues');
  // dropdown.appendChild(defaultItem);

  // Create items for each league
  leagues.forEach(league => {
    var item = document.createElement('a');
    item.textContent = league.league_name; // Display league name
    item.setAttribute('data-value', league.league_name); // Set data-value attribute
    dropdown.appendChild(item);
  });
}


  // Function to filter and display team list based on search and league selection
  function filterRankList() {
    var tab_filter_text = $("#tab_filter_text").val().toLowerCase().trim();
    // var selectedLeague = $('#leagueDropdown').val();
    const selectedLeague = $("#selectedStatus").data('value') || '';

    var filteredArray = rankList.filter(function (object) {
        var matchesText = true;

        if (tab_filter_text !== '') {
            matchesText = (object.team_name && object.team_name.toLowerCase().includes(tab_filter_text)) ||
                            (object.team_short_name && object.team_short_name.toLowerCase().includes(tab_filter_text)) ||
                            (object.league_name && object.league_name.toLowerCase().includes(tab_filter_text)) ||
                            (object.team_date && object.team_date.toLowerCase().includes(tab_filter_text));
        }

        if (selectedLeague && selectedLeague !== 'All Leagues') {
      matchesText = matchesText && object.league_name === selectedLeague; // Compare league_name with selectedLeague
    }

        return matchesText;
    });

    array = filteredArray;
        preLoadCalculations();
        current_index = 1;
        displayIndexButtons();
        highlightIndexButton()
        displayTableRows();
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



//    function initializePage1() {
//     // HTML for mobile number section and OTP modal
//     const otpModalHTML = `
//     <div id="otpModal" class="modal" style="display:none;z-index:2000">
//         <div class="modal-content">
//             <span class="close">&times;</span>
//             <h2>OTP Verification</h2>
//             <div class="col-md-12 d-flex justify-content-between align-items-center">
//                 <div class="form-group form-group-custom">
//                     <input type="text" class="form-control" id="mobilenum" value="Mobile No. 7801804996" readonly style="text-align: center;" />
//                 </div>
//                 <div class="text-center">
//                     <button class="btn btn-primary" id="get-otp-btn">Get OTP</button>
//                 </div>
//             </div>
//             <div id="showotptimer" style="display:none;">
//                 <div class="otp-inputs text-center">
//                     <input type="text" maxlength="1" class="otp-input" />
//                     <input type="text" maxlength="1" class="otp-input" />
//                     <input type="text" maxlength="1" class="otp-input" />
//                     <input type="text" maxlength="1" class="otp-input" />
//                     <input type="text" maxlength="1" class="otp-input" />
//                     <input type="text" maxlength="1" class="otp-input" />
//                 </div>
//                 <p class="resend-timer text-end">
//                     Resend in <span id="timer">30</span> sec
//                     <button id="resend-otp-btn" style="display:none;">Resend OTP</button>
//                 </p>
//                 <button id="submitOTP" class="btn btn-primary">Submit</button>
//                 <p id="otpError" style="color:red;display:none;">Invalid OTP. Please try again.</p>
//             </div>
//         </div>
//         <div id="otpOverlay" class="overlay" style="display:none;"></div>
//     </div>`;

//     document.body.insertAdjacentHTML('beforeend', otpModalHTML);

//     // Get elements for OTP modal
//     const otpModal = document.getElementById("otpModal");
//     const otpOverlay = document.getElementById("otpOverlay");
//     const closeModal = otpModal.querySelector(".close");
//     const submitOTP = document.getElementById("submitOTP");
//     const otpError = document.getElementById("otpError");
//     const timerElement = document.getElementById('timer');
//     const timerElement1 = document.getElementById('showotptimer');
//     const resendOtpButton = document.getElementById('resend-otp-btn');

//     function showOTPModal() {
//       otpModal.style.display = "block";
//       otpOverlay.style.display = "block";
//       startTimer();
    
//   }
//   function showOTPModal1() {
//     timerElement1.style.display = "block";
//     otpOverlay.style.display = "block";
    
// }

//     function hideOTPModal() {
//         otpModal.style.display = "none";
//         otpOverlay.style.display = "none";
//         resetTimer(); // Reset the timer when hiding the modal
//     }

//     function validateOTP(otp) {
//         let otpsend = String(otpApi2); // Ensure otpApi2 is a string

//         if (otp === otpsend) {
//             otpError.style.display = "none"; // Hide error if OTP is valid
//             return true;
//         } else {
//             otpError.style.display = "block"; // Show error if OTP is invalid
//             return false;
//         }
//     }

//     let timerIntervalId = null;

//     function startTimer() {
//         let time = 30; // Timer duration in seconds

//         if (timerIntervalId !== null) {
//             clearInterval(timerIntervalId);
//         }

//         timerIntervalId = setInterval(() => {
//             time--;
//             timerElement.textContent = time;
//             if (time <= 0) {
//                 clearInterval(timerIntervalId);
//                 timerElement.textContent = '0';
//                 resendOtpButton.style.display = 'inline-block'; // Show the resend button
//             }
//         }, 1000);
//     }

//     function resetTimer() {
//         if (timerIntervalId !== null) {
//             clearInterval(timerIntervalId);
//             timerIntervalId = null;
//         }
//         timerElement.textContent = '30'; // Reset the timer display
//         resendOtpButton.style.display = 'none'; // Hide the resend button
//     }

//     submitOTP.addEventListener("click", () => {
//         const otpInputs = document.querySelectorAll('.otp-input');
//         const otp = Array.from(otpInputs).map(input => input.value).join('');
//         if (validateOTP(otp)) {
//             const adminType = JSON.parse(localStorage.getItem('adminType'));
//             const userType = JSON.parse(localStorage.getItem('userEmail'));

//             const currentTime = new Date().getTime();
//             const COOKIE_EXPIRATION_HOURS = adminType === 'super_admin' ? 1 : 0.5; // 60 or 30 minutes based on admin type
//             const expirationTime = new Date(currentTime + COOKIE_EXPIRATION_HOURS * 60 * 60 * 1000);

//             localStorage.setItem('loginTime', expirationTime.toISOString());
//             hideOTPModal(); // Hide the OTP modal upon successful validation
//         }
//     });

//     closeModal.addEventListener("click", hideOTPModal);
//     otpOverlay.addEventListener("click", hideOTPModal);
//     // resendOtpButton.addEventListener("click",)
//     // Close modal if clicking outside the modal content
//     resendOtpButton.addEventListener("click", (event) => {
//       postPhoneNumber()
//       phoneNumber()
//         if (event.target === resendOtpButton) {
//           resendOtpButton.style.display = "none"
//         }
//     });
//     const getOtpButton = document.getElementById('get-otp-btn');
//   getOtpButton.addEventListener('click', function () {
//       showOTPModal1();
//       postPhoneNumber()
//       phoneNumber()
//   });
//     const elements = document.querySelectorAll("button, input, select, textarea, a, li, div, th, td, span, i");
//     elements.forEach(element => {
//         element.addEventListener("click", (event) => {
//             if (element.classList.contains("otp-exempt3")) {
//                 event.preventDefault();
             
//                     showOTPModal();
  
//             }
//         });
//       })
// }


if( statusType == "true"){
otpAdd.classList.add('otp-exempt3')
}else{
otpAdd.classList.remove('otp-exempt3')

}
  function displayTableRows() {
      $("table tbody").empty();
      var tab_start = (current_index - 1) * table_size;
      var tab_end = Math.min(current_index * table_size, array.length);

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
          var object = array[i];

          var tr = $("<tr></tr>");

          var noCell = $("<td></td>").text(i + 1);
          var teamNameCell = $("<td colspan='2'></td>").text(object["team_name"] || "");
          var shortNameCell = $("<td colspan='2'></td>").text(object["team_short_name"] || "");
          var leagueCell = $("<td colspan='2'></td>").text(object["league_name"] || "");
          var logoCell = $("<td></td>").html(
              object["team_image"] ?
                  '<img src="https://krinik.pythonanywhere.com' + object["team_image"] + '" alt="' + object["team_image"] + '" class="team-logo lazyload">' :
                  ''
          );
          var dateCell = $("<td></td>").text(convertDateFormat(object["team_date"] || ""));

          if(statusType == "true"){
            var viewCell = $("<td class='otp-exempt3'></td>").html(
                `<span class="sortable otp-exempt3" onclick="viewTeamDetails('${object["team_name"]}')"><i class="far fa-eye otp-exempt3"></i></span>`
          );
          var editCell = $("<td class='otp-exempt3'></td>").html(
              '<span class="sortable otp-exempt3" onclick="handleEdit(' + object["id"] + ')"><i class="far fa-edit otp-exempt3"></i></span>'
          );
          var deleteCell = $("<td class='otp-exempt3'></td>").html(
              '<span class="sortable otp-exempt3" onclick="handleDelete(' + object["id"] + ')"><i class="far fa-trash-alt otp-exempt3"></i></span>'
          );
          }
          else{
            var viewCell = $("<td></td>").html(
                `<span class="sortable" onclick="viewTeamDetails('${object["team_name"]}')"><i class="far fa-eye"></i></span>`
          );
          var editCell = $("<td></td>").html(
              '<span class="sortable" onclick="handleEdit(' + object["id"] + ')"><i class="far fa-edit"></i></span>'
          );
          var deleteCell = $("<td></td>").html(
              '<span class="sortable" onclick="handleDelete(' + object["id"] + ')"><i class="far fa-trash-alt"></i></span>'
          );
          }
         

          tr.append(noCell)
              .append(teamNameCell)
              .append(shortNameCell)
              .append(leagueCell)
              .append(logoCell)
              .append(dateCell)
              .append(viewCell)
              .append(editCell)
              .append(deleteCell);

          $("table tbody").append(tr);
      }
      // lazyLoadImages(); // Lazy load images after table rows are appended
  }
  function viewTeamDetails(teamName) {
    if( statusType == "true"){      

initializePage1()

}else{
    window.location.href = `view-team-details.html?teamName=${encodeURIComponent(teamName)}`;
}
  }
  async function handleDelete(id) {
    if( statusType == "true"){      

initializePage1()

}else{
      if (confirm('Are you sure you want to delete this team?')) {
          const url = `https://krinik.pythonanywhere.com/team_get/${id}/`;
          try {
              const response = await fetch(url, {
                  method: "DELETE"
              });

              if (response.ok) {
                  // Fetch the updated list of teams after deletion
                  await fetchData();
              } else {
                  console.error("Failed to delete the team");
              }
          } catch (error) {
              console.error("Error deleting team:", error);
          }
      }
  }
}

  // Ensure the edit functionality is working properly with appropriate URL handling
  async function handleEdit(id) {
    if( statusType == "true"){      

initializePage1()

}else{
      const url = `https://krinik.pythonanywhere.com/team_get/${id}/`;
      try {
          const response = await fetch(url);

          if (response.ok) {
              // Redirect to edit page with the team ID
              window.location.href = `editteam.html?id=${id}`;
          } else {
              console.error("Failed to fetch team data");
          }
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  }
  }

  // Function to convert date format from YYYY-MM-DD to DD-MM-YYYY
  function convertDateFormat(dateString) {
      // Assuming dateString is in the format YYYY-MM-DD
      var parts = dateString.split('-');
      if (parts.length === 3) {
          var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0]; // Change format to DD-MM-YYYY
          return formattedDate;
      }
      return dateString; // Return original if format is unexpected
  }

  // Lazy load images function
  function lazyLoadImages() {
      var lazyloadImages = document.querySelectorAll(".team-logo");

      lazyloadImages.forEach(function (img) {
          img.addEventListener('load', function () {
              img.classList.add('fade-in');
          });

          img.addEventListener('error', function () {
              console.error('Error loading image:', img.src);
          });

          if (img.complete) {
              img.classList.add('fade-in');
          }
      });
  }

  const table = document.getElementById('teamTable');
const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', () => {
  const workbook = XLSX.utils.table_to_book(table, { sheet: 'Team Data' });
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'team_data.xlsx';
  a.click();

  URL.revokeObjectURL(url);
  a.remove();
});


history.pushState(null, null, window.location.href);