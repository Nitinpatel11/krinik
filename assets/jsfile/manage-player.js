import {getAdminType,createOTPModal}  from "../js/initial.js"
  var rankList = [];
    var array = [];
    var array_length = 0;
    var table_size = 10;
    var start_index = 1;
    var end_index = 0;
    var current_index = 1;
    var max_index = 0;
  let totaldataplayer = document.querySelector("#total-player-data");
  const otpModalInstance = createOTPModal();

  const adminInfo = getAdminType();
  const isSuperAdmin = adminInfo?.value === "super admin";
  const isStatusTrue = adminInfo?.status === "true";
  let addNewBtn = document.getElementById("addNewBtn")
  
  function showOTP() {
  
      otpModalInstance.show()
      
  }
  addNewBtn.addEventListener("click",()=>{
    if (isSuperAdmin && isStatusTrue) {
      showOTP()
  
  }else{
    window.location.href = "./addplayer.html"
  }
  })
  async function fetchData() {
      try {
          const teamsResponse = await fetch("https://krinik.in/team_get/", {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          const leaguesResponse = await fetch("https://krinik.in/league_get/", {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          const playersResponse = await fetch("https://krinik.in/player_get/", {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json'
              }
          });
        //   const otpapi = await $.ajax({
        //   url: "https://krinik.in/send_otp_get/",
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

          if (teamsResponse.ok && leaguesResponse.ok && playersResponse.ok) {
              const teamsData = await teamsResponse.json();
              const leaguesData = await leaguesResponse.json();
              const playersData = await playersResponse.json();

              array = playersData.data
              totaldataplayer.innerHTML = array.length;
              if (teamsData.status === "success" && leaguesData.status === "success" && playersData.status === "success") {
                  rankList = playersData.data;
                  console.log(rankList)
                  array = rankList.slice();
                  populateLeagueDropdown(leaguesData.data);
                  populateTeamDropdown(teamsData.data);
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
      url: "https://krinik.in/send_otp_get/", // Change this to your POST endpoint
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
          url: "https://krinik.in/send_otp_get/",
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


  function preLoadCalculations(filteredArrayLength) {
      array_length = filteredArrayLength || array.length;
      max_index = Math.ceil(array_length / table_size);
    }

    $(document).ready(function () {
  const $dropdownBtn3 = $('#dropdownBtn3');
  const $dropdownContent3 = $('#leagueDropdown');
  const $selectedStatus = $('#selectedStatus');
  const $arrow = $('#arrowBar');
  const $clearStatus = $('#clearStatus');

  const $dropdownBtn4 = $('#dropdownBtn4');
  const $dropdownContent4 = $('#teamDropdown');
  const $selectedStatus1 = $('#selectedStatus1');
  const $arrow1 = $('#arrowBar1');
  const $clearStatus1 = $('#clearStatus1');

  function toggleDropdown($dropdownContent, $dropdownBtn,) {
    const isExpanded = $dropdownContent.toggleClass('show').hasClass('show');
    $dropdownBtn.attr('aria-expanded', isExpanded);
    
  }

  $selectedStatus.on('click', function() {
    toggleDropdown($dropdownContent3, $dropdownBtn3);
  });

  $arrow.on('click', function() {
    toggleDropdown($dropdownContent3, $dropdownBtn3);
  });

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
    filterRankList();
  });

  $dropdownContent4.on('click', 'a', function() {
    const selectedValue1 = $(this).data('value');
    $selectedStatus1.text(selectedValue1).data('value', selectedValue1);
    $dropdownContent4.removeClass('show');

    if (selectedValue1 === 'All Teams') {
      $arrow1.show();
      $clearStatus1.hide();
    } else {
      $arrow1.hide();
      $clearStatus1.show();
    }
    filterRankList();
  });

  $clearStatus.on('click', function() {
    $selectedStatus.text('All Leagues').data('value', 'All Leagues');
    $dropdownContent3.removeClass('show');
    $arrow.show();
    $clearStatus.hide();
    $dropdownBtn3.attr('aria-expanded', 'false');
    filterRankList();
  });
 

  $selectedStatus1.on('click', function() {
    toggleDropdown($dropdownContent4, $dropdownBtn4);
  });

  $arrow1.on('click', function() {
    toggleDropdown($dropdownContent4, $dropdownBtn4);
  });

  $clearStatus1.on('click', function() {
    $arrow1.show();
    $clearStatus1.hide();
    $selectedStatus1.text('All Teams').data('value', 'All Teams');
    $dropdownContent4.removeClass('show');
    $dropdownBtn4.attr('aria-expanded', 'false');
    filterRankList();
  });

  $(document).on('click', function(event) {
    if (!$selectedStatus.is(event.target) && !$selectedStatus.has(event.target).length &&
        !$dropdownContent3.has(event.target).length && !$arrow.is(event.target) &&
        !$clearStatus.is(event.target)) {
      $dropdownContent3.removeClass('show');
      $dropdownBtn3.attr('aria-expanded', 'false');
    }
  });
  $(document).on('click', function(event) {
    if (!$selectedStatus1.is(event.target) && !$selectedStatus1.has(event.target).length &&
        !$dropdownContent4.has(event.target).length && !$arrow1.is(event.target) &&
        !$clearStatus1.is(event.target)) {
      $dropdownContent4.removeClass('show');
      $dropdownBtn4.attr('aria-expanded', 'false');
    }
  });

  fetchData();

  $('#tab_filter_text').on('input', function () {
    filterRankList();
  });

  $('#datefilter').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    $('#clearDateBtn').show();
    filterRankList();
  });

  $('#clearDateBtn').click(function () {
    $('#datefilter').val('');
    $(this).hide();
    filterRankList();
  });
});

function populateLeagueDropdown(leagues) {
  const dropdown = document.getElementById('leagueDropdown');
  dropdown.innerHTML = ''; // Clear existing options

  leagues.forEach(league => {
    const item = document.createElement('a');
    item.textContent = league.league_name;
    item.setAttribute('data-value', league.league_name);
    dropdown.appendChild(item);
  });
}

function populateTeamDropdown(teams) {
  const dropdown = document.getElementById('teamDropdown');
  dropdown.innerHTML = ''; // Clear existing options

  teams.forEach(team => {
    const item = document.createElement('a');
    item.textContent = team.team_name;
    item.setAttribute('data-value', team.team_name);
    dropdown.appendChild(item);
  });
}

function filterRankList() {
  const tab_filter_text = $("#tab_filter_text").val().toLowerCase().trim();
  const selectedLeague = $("#selectedStatus").data('value') || '';
  const selectedTeam = $("#selectedStatus1").data('value') || '';

  const filteredArray = rankList.filter(object => {
    let matchesText = true;

    if (tab_filter_text !== '') {
      matchesText = (object.team_name.team_name && object.team_name.team_name.toLowerCase().includes(tab_filter_text)) ||
                    (object.player_short_name && object.player_short_name.toLowerCase().includes(tab_filter_text)) ||
                    (object.player_name && object.player_name.toLowerCase().includes(tab_filter_text)) ||
                    (object.team_date && object.team_date.toLowerCase().includes(tab_filter_text)) ||
                    (object.league_name && object.league_name.toLowerCase().includes(tab_filter_text));
    }

    if (selectedLeague && selectedLeague !== 'All Leagues') {
      matchesText = matchesText && object.league_name === selectedLeague;
    }

    if (selectedTeam && selectedTeam !== 'All Teams') {
      matchesText = matchesText && object.team_name.team_name === selectedTeam;
    }

    return matchesText;
  });

  array = filteredArray;
  preLoadCalculations();
  current_index = 1;
  displayIndexButtons();
  highlightIndexButton();
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

   
    window.prev = prev;
    window.next = next;
    window.indexPagination = indexPagination;


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
          var playerNameCell = $("<td colspan='2'></td>").text(object["player_name"] || "");
          var teamNameCell = $("<td colspan='2'></td>").text(object["player_short_name"] || "");
          var shortNameCell = $("<td colspan='2'></td>").text(object["team_name"].team_name || "");
          var leagueCell = $("<td colspan='2'></td>").text(object["league_name"] || "");
          var runCell = $("<td></td>").text(object["total_run"] || 0);
          // console.log(object["total_run"])
         
          var logoCell = $("<td></td>").html(object["player_image"] ? `<img src="https://krinik.in${object["player_image"]}" alt="${object["player_image"]}" class="team-logo lazyload">` : '');

         
            var viewCell = $("<td class='otp-exempt3'></td>").html(`<span class="sortable otp-exempt3" onclick="viewPlayerDetails('${object["id"]}')"><i class="far fa-eye otp-exempt3"></i></span>`);
          var editCell = $("<td class='otp-exempt3'></td>").html('<span class="sortable otp-exempt3" onclick="handleEdit(' + object["id"] + ')"><i class="far fa-edit otp-exempt3"></i></span>');
          var deleteCell = $("<td class='otp-exempt3'></td>").html('<span class="sortable otp-exempt3" onclick="handleDelete(' + object["id"] + ')"><i class="far fa-trash-alt otp-exempt3"></i></span>');
         
          tr.append(noCell)
            .append(playerNameCell)
            .append(teamNameCell)
            .append(shortNameCell)
            .append(leagueCell)
            .append(runCell)
            .append(logoCell)
            .append(viewCell)
            .append(editCell)
            .append(deleteCell);
            $("table tbody").append(tr);
          }
      // lazyLoadImages();
  }
  function viewPlayerDetails(id) {
    if (isSuperAdmin && isStatusTrue) {
      showOTP()

}else{
    window.location.href = `view-player-details.html?id=${id}`;
}
  }
  async function handleDelete(id) {
    if (isSuperAdmin && isStatusTrue) {
      showOTP()

}else{
    if (confirm('Are you sure you want to delete this player?')) {
          const url = `https://krinik.in/player_get/${id}/`;
          try {
              const response = await fetch(url, {
                  method: "DELETE"
              });

              if (response.ok) {
                  await fetchData();
              } else {
                  console.error("Failed to delete the player");
              }
          } catch (error) {
              console.error("Error deleting player:", error);
          }
      }
  }
}

  async function handleEdit(id) {
    if (isSuperAdmin && isStatusTrue) {
      showOTP()

}else{
      const url = `https://krinik.in/player_get/${id}/`;
      try {
          const response = await fetch(url);

          if (response.ok) {
              window.location.href = `editplayer.html?id=${id}`;
          } else {
              console.error("Failed to fetch player data");
          }
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  }
  }
  window.handleEdit = handleEdit;
  window.handleDelete = handleDelete;
  window.viewPlayerDetails = viewPlayerDetails;

  const table = document.getElementById('playerTable');
const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', () => {
  const workbook = XLSX.utils.table_to_book(table, { sheet: 'Player Data' });
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'player_data.xlsx';
  a.click();

  URL.revokeObjectURL(url);
  a.remove();
});

history.pushState(null, null, window.location.href);