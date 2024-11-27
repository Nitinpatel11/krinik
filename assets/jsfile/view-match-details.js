import {checkAdminAccess}  from "../js/initial.js"
  var rankList = [];
  var array = [];
  var array_length = 0;
  var table_size = 10;
  var start_index = 1;
  var end_index = 0;
  var current_index = 1;
  var max_index = 0;// Define end_index or calculate based on data length
  // Define end_index or calculate based on data length
  let disablePlayersA = []
  let disablePlayersB = []
 let disableplayersA
 let disableplayersB
 let selectingPlayerA
 let selectingPlayerB
  const urlParams = new URLSearchParams(window.location.search);
  const id = Number(urlParams.get('id'));
  let remainTiming = document.querySelector('#remainTiming')
  let statusShow = document.getElementById('statusShow')
  let declareResult = document.getElementById('declareResult')
  let matchResult = document.getElementById('matchResult')
  let totalAmountData = document.getElementById('total-amount-data')

let userData
let userMoney

  let urlpooltime
  let arr = [];  // Declare arr globally if you need to use it outside the function
let userId
async function fetchUserData() {
  try {
    if (!id) {
      console.warn('No player ID found in URL.');
      return;
    }

    const url = `https://krinik.in/match_get/${id}/`;
    console.log('Fetching player data from:', url);

    const url1 = `https://krinik.in/pool_declare/`;
    console.log('Fetching pool data from:', url1);

    
    const url2 = `https://krinik.in/user_match_get/`;
    console.log('Fetching pool data from:', url2);
    
    const url5 = `https://krinik.in/user_get/`;
    console.log('Fetching pool data from:', url5);

    const responseurl = await fetch(url1);
    const urlpool = await responseurl.json();
    const urlpooldata = urlpool.data;
console.log(urlpooldata,"poll")
    const urlpool1 = urlpooldata.find((p) => p.select_match ? p.select_match.match_id == id : null);
    if (urlpool1) {
      urlpooltime = urlpool1.date_time;
    }

    console.log(urlpooltime, "poll");

    const responseurl2 = await fetch(url2);
    const userMatchData1 = await responseurl2.json();
    const userMatchData = userMatchData1.data

    console.log(userMatchData, "userData");

    const userMatchData2 = userMatchData.filter((p) => p.match.id ? p.match.id === id : null);
    const userMatchData3 = userMatchData2.filter((p)=> p.disable_user === false)
    console.log(userMatchData2,"userMatchData2")
    console.log(userMatchData3,"userMatchData3")

    if (userMatchData3) {
      userMoney = userMatchData3.reduce((total,curr)=> total + curr.invest_amount,0)
      totalAmountData.textContent = userMoney
      console.log(userMoney,"userMatchData3")
    }
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch player data');
    }
    const response5 = await fetch(url5);
    const userGetData = await response5.json();
    console.log(userGetData,"userGetData")


    const userData1 = await response.json();
    const userData = userData1.data;
    // console.log(userData,"userData che")
    const disabledDataPlayerA = userData.disable_player_A || [];
    const disabledDataPlayerB = userData.disable_player_B || [];
    arr = userData.player_list || [];  // Use global arr
console.log(arr, "plplpl");

// Combine the IDs from both disabled lists
const disabledIds = [
  ...disabledDataPlayerA.map(player => player.id),
  ...disabledDataPlayerB.map(player => player.id)
];
// console.log(disabledIds, "disabled");

// Filter out players in arr whose IDs are in the disabled list
arr = arr.filter(player => !disabledIds.includes(player));

// console.log(arr, "Filtered arr (without disabled players)");
  // Corrected this to log the filtered arr

  console.log(userData, "data123");
    userId = userData.id;
console.log(userId,"pl")
    // Call the editPlayerData function to edit player data
    editPlayerData(userData);
    // You can call other functions that need the updated arr data if required

  } catch (error) {
    console.error('Error fetching player data:', error);
  }
}

  fetchUserData();

  fetchUserData1()


  function editPlayerData(response) {
    const teamLogo1 = document.getElementById("team-logo-1");
    const teamLogo2 = document.getElementById("team-logo-2");
    const teamLogoName1 = document.getElementById("team-logo-name-1");
    const teamLogoName2 = document.getElementById("team-logo-name-2");

    if (response) {
      teamLogo1.src = `https://krinik.in${response.select_team_A.team_image}`;
      teamLogo2.src = `https://krinik.in${response.select_team_B.team_image}`;

      teamLogoName1.textContent = response.select_team_A.team_name;
      teamLogoName2.textContent = response.select_team_B.team_name;

      let defaultTime = new Date();  // Current date and time
      console.log(defaultTime.getTime(), "defaultTime");

      // Example match start and end dates from response
      const matchStartDate = response.match_start_date;  // Example: "11-09-2024 17:15"
      const matchEndDate = urlpooltime ? urlpooltime : null;  // If urlpooltime is available, use it; otherwise, it's null.

      const matchDateTimeStr = matchStartDate.replace("/", "-"); // Ensures compatibility with Date parsing
      console.log(matchDateTimeStr, "matchDateTimeStr");

      let matchDateTimeStrEnd = null;
      if (matchEndDate) {
        matchDateTimeStrEnd = matchEndDate.replace("/", "-"); // Ensures compatibility with Date parsing
        console.log(matchDateTimeStrEnd, "matchDateTimeStrEnd");
      }

      // Use moment.js to parse the match start and end dates
      const formattedMatchDate = moment(matchDateTimeStr, 'DD-MM-YYYY HH:mm');  // Match start as a moment object
      let formattedMatchEndDate = null;
      if (matchDateTimeStrEnd) {
        formattedMatchEndDate = moment(matchDateTimeStrEnd, 'YYYY-MM-DD HH:mm:ss');  // Match end as a moment object
        console.log(formattedMatchEndDate.format('DD-MM-YYYY HH:mm:ss'), "formattedMatchEndDate");
      }

      console.log(formattedMatchDate.format('DD-MM-YYYY HH:mm:ss'), "formattedMatchDate");

      // Function to update the live countdown and status
      function updateCountdown() {
        // Get the current time
        let currentTime = moment();  // Current time as a moment object
        console.log(currentTime.format('DD-MM-YYYY HH:mm:ss'), "Current Time");

        // Calculate the remaining time until match start
        let remainingTimeStart = formattedMatchDate.diff(currentTime);
        let remainingTimeEnd = formattedMatchEndDate ? formattedMatchEndDate.diff(currentTime) : null;

        // Check the current status
        if (remainingTimeStart > 0) {
          // Match hasn't started yet
          statusShow.textContent = "Upcoming";
          declareResult.style = "display:none";
          matchResult.style = "display:none";
          
          // Convert the remaining time to a human-readable format for the countdown
          let duration = moment.duration(remainingTimeStart);
          let formattedRemainingTime = `${duration.months()} months, ${duration.days()} days, ${duration.hours()} hours, ${duration.minutes()} minutes, ${duration.seconds()} seconds`;
          remainTiming.textContent = formattedRemainingTime;

        } else if (remainingTimeStart <= 0 && (!remainingTimeEnd || remainingTimeEnd > 0)) {
          // Match is live if either:
          // - It has started and the end time is not provided, OR
          // - It has started and the current time is between the start and end time
          statusShow.textContent = "Live";
          remainTiming.textContent = "Live";
          matchResult.style = "display:none";
          
          
        } else if (remainingTimeEnd && remainingTimeEnd <= 0) {
          // Match has ended if we have the end date and the current time is past the end date
          statusShow.textContent = "Completed";
          remainTiming.textContent = "Completed";
          
          // document.getElementById("declareResult").addEventListener("click", () => redirectToHistoryPage('declare-result'));
          // declareResult.style = "display:none"
          document.getElementById("matchResult").addEventListener("click", () => redirectToHistoryPage('match-name'));
          
          // Stop the countdown as the match is completed
          clearInterval(countdownInterval);
        }
      }

      // Start the countdown and update every second (1000 ms)
      let countdownInterval = setInterval(updateCountdown, 1000);

      // Initial call to display countdown immediately
      updateCountdown();


      selectingPlayerA = response.select_player_A
      selectingPlayerB = response.select_player_B
      console.log(selectingPlayerA, "olp")
      // disablePlayersA = response.disable_player_A
      // disablePlayersB = response.disable_player_B
      disablePlayersA = (response.disable_player_A || []).map(player => ({
        ...player,
        disable: "disable"
      }))
      console.log(disablePlayersA, "oklp")
      disablePlayersB = (response.disable_player_B || []).map(player => ({
        ...player,
        disable: "disable"
      }))

      let aPlayer = [...disablePlayersA, ...selectingPlayerA,]
      let bPlayer = [...disablePlayersB, ...selectingPlayerB,]

      console.log(aPlayer, "yui")

      console.log(disablePlayersA, "ok1")
      displayTableRows(aPlayer, "tbody1");
      displayTableRows(bPlayer, "tbody2");
    } else {
      console.error("Data is not in the expected format:", response);
    }
  }

  document.getElementById("declareResult").addEventListener("click", () => redirectToHistoryPage('declare-result'));

  function displayTableRows(players, tbodyId) {
    $("#" + tbodyId).empty();

    players.forEach((player, index) => {
      const tr = $("<tr></tr>");

      const noCell = $("<td></td>").text(index + 1);
      const playerNameCell = $("<td colspan='3'></td>").text(player.player_name);
      const logoCell = $("<td class='team-logo1'></td>").html(
        player.player_image
          ? `<img src="https://krinik.in${player.player_image}" alt="" />`
          : ""
      );
      const disableCell = $("<td></td>").html(`
            <span class="material-symbols-outlined" style="color:#E20101; cursor:pointer;" onclick="handleDisable(${player.id})">
                block
            </span>
        `);
      const dis = player.disable
      console.log(dis, "dis")

      if (dis == "disable") {
        noCell.addClass("disabled-row")
        playerNameCell.addClass("disabled-row")
        logoCell.addClass("disabled-row")
        disableCell.addClass("disabled-row")

      }

      tr.append(noCell)
        .append(playerNameCell)
        .append(logoCell)
        .append(disableCell);

      $("#" + tbodyId).append(tr);
    });
  }
window.handleDisable = handleDisable
  async function handleDisable(playerId) {
    if (confirm('Are you sure you want to delete this player?')) {
      const matchUrl = `https://krinik.in/match_get/${id}/`;
      try {
        // Fetch existing match data
        const matchResponse = await fetch(matchUrl);
        if (!matchResponse.ok) {
          throw new Error('Failed to fetch match data');
        }
        const matchData = await matchResponse.json();

        const existingPlayersA = matchData.data.select_player_A || [];
        const existingPlayersB = matchData.data.select_player_B || [];
        let disablePlayersA = matchData.data.disable_player_A || [];
        let disablePlayersB = matchData.data.disable_player_B || [];

        const playerIndexA = existingPlayersA.findIndex(player => player.id === playerId);
        const playerIndexB = existingPlayersB.findIndex(player => player.id === playerId);

        if (playerIndexA !== -1) {
          // Remove the player from existingPlayersA and update disablePlayersA
          const updatedPlayersA = [...existingPlayersA];
          const disabledPlayerA = updatedPlayersA.splice(playerIndexA, 1);

          disablePlayersA = [...disablePlayersA, ...disabledPlayerA];

          // Filter out disabled players from arr
          const disabledIdsA = disablePlayersA.map(p => p.id);
          arr = arr.filter(id => !disabledIdsA.includes(id));

          // Patch the updated players list
          const response = await fetch(matchUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              select_player_A: updatedPlayersA.map(p => p.id),
              select_player_B: existingPlayersB.map(p => p.id),
              disable_player_A: disablePlayersA.map(p => p.id),
              disable_player_B: disablePlayersB.map(p => p.id),
            }),
          });

          if (response.ok) {
            console.log('Player successfully removed');
            fetchUserData1();
            fetchUserData();
          } else {
            const errorText = await response.text();
            console.error('Failed to update player data. Status:', response.status, errorText);
          }
        } else if (playerIndexB !== -1) {
          // Remove the player from existingPlayersB and update disablePlayersB
          const updatedPlayersB = [...existingPlayersB];
          const disabledPlayerB = updatedPlayersB.splice(playerIndexB, 1);

          disablePlayersB = [...disablePlayersB, ...disabledPlayerB];

          // Filter out disabled players from arr
          const disabledIdsB = disablePlayersB.map(p => p.id);
          arr = arr.filter(id => !disabledIdsB.includes(id));

          // Patch the updated players list
          const response = await fetch(matchUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              select_player_B: updatedPlayersB.map(p => p.id),
              select_player_A: existingPlayersA.map(p => p.id),
              disable_player_A: disablePlayersA.map(p => p.id),
              disable_player_B: disablePlayersB.map(p => p.id),
            }),
          });

          if (response.ok) {
            console.log('Player successfully removed');
            fetchUserData1();
            fetchUserData();
          } else {
            const errorText = await response.text();
            console.error('Failed to update player data. Status:', response.status, errorText);
          }
        } else {
          console.error('Player not found in existing players');
        }
      } catch (error) {
        console.error('Error removing player:', error);
      }
    }
  }

  async function fetchUserData1() {
    try {
      if (!id) {
        console.warn('No player ID found in URL.');
        return;
      }

      const url = `https://krinik.in/match_get/${id}/`;
      console.log('Fetching player data from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }

      const userData1 = await response.json();
      const userData = userData1.data;
      userId = userData.id;

      const leagueNameData = userData.select_league.league_name

      const teamA = userData.select_team_A.id;
      const teamB = userData.select_team_B.id;
      const playersA = userData.select_player_A;
      const playersB = userData.select_player_B;
      disableplayersA = userData.disable_player_A;
      disableplayersB = userData.disable_player_B

      console.log(disableplayersA, disableplayersB, "data3");

      await fetchPlayer(teamA, playersA, disableplayersA, 'playerCheckboxesA', leagueNameData); // Fetch players for Team A
      await fetchPlayer(teamB, playersB, disableplayersB, 'playerCheckboxesB', leagueNameData);
      fetchData(userId);


    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  }


  async function fetchData(userId) {
    try {
      const response = await fetch(`https://krinik.in/view_contest_details_view_get/`);
      if (!response.ok) {
        throw new Error('Failed to fetch pool history data');
      }

      const userData1 = await response.json();

      if (userData1 && userData1.status === "success" && userData1.data) {
        rankList = userData1.data;
        console.log(rankList, "arr");
        // const totalAmountData = document.getElementById("total-amount-data")
        // const totalWinData = document.getElementById("total-win-data")
        // const totalAvailableData = document.getElementById("total-available-data")

        // totalAmountData.textContent = rankList.

        // Filter and log matching data
        const matchingData = rankList.filter(item => item.user_data.id === userId);
        if (matchingData.length > 0) {
          console.log('Matching data found:', matchingData, "okk");
        } else {
          // console.log('No matching data found.');
        }

        array = matchingData;


        if (array.length) {

          filterAndDisplay()
        } else {
          // console.log('no data found')
        }
        // editPlayerData(array);
      } else {
        console.error("Error: Invalid data format or ID mismatch");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  function filterAndDisplay() {
    // filterRankList();
    preLoadCalculations();
    displayIndexButtons();
    displayTableRows1();
    highlightIndexButton();
  }

  function preLoadCalculations(filteredArrayLength) {
    array_length = filteredArrayLength || array.length;
    max_index = Math.ceil(array_length / table_size);
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
    displayTableRows1();
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

  window.prev = prev
  window.next = next
  window.indexPagination = indexPagination

  function displayTableRows1() {

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
      // var status = getStatus(showdata["start_league_date"], showdata["end_league_date"]);

      var tr = $("<tr></tr>");

      var noCell = $("<td></td>").text(i + 1);
      var userNameCell = $("<td colspan='2'></td>").text(showdata.user_data["name"] || "");
      var amountCell = $("<td colspan='2'> </td>").text(showdata["entry_fee"] || "");


      var pairCell = $("<td colspan='2'></td>").text(showdata.user_data["pool_name"].length || "");
      var totalPoolCell = $("<td colspan='2'> </td>").text(showdata["player_pair"].length || "");


      var deleteCell = $("<td></td>").html(
        '<span class="sortable" onclick="handleDelete(' + showdata["id"] + ')"><i class="far fa-trash-alt"></i></span>'
      );

      tr.append(noCell)
        .append(userNameCell)
        .append(amountCell)
        .append(pairCell)
        .append(totalPoolCell)
        // .append(logoCell)
        // .append(dateCell)
        // .append(statusCell)
        // .append(viewCell)
        // .append(editCell)
        .append(deleteCell);



      $("table tbody").append(tr);
    }
  }

  function redirectToHistoryPage(page) {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');

    if (id) {
      window.location.href = `${page}.html?id=${id}`;
    } else {
      console.error('No player ID found in URL.');
    }
  }


  // function declarefun() {
  //   const declareResultButton = document.getElementById("declareResult");
  
  //   if (declareResultButton) {
  //     declareResultButton.addEventListener("click", () => {
  //       redirectToHistoryPage('declare-result');
  //     });
  //   } else {
  //     console.error("Element with ID 'declareResult' not found.");
  //   }
  // }


  // Function to open the modal and populate it with checkboxes
  async function fetchPlayer(teamName, playersName, disablePlayers, checkboxContainerId, leagueNameData) {
    try {
      const response = await fetch('https://krinik.in/player_get/');
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }

      const userData1 = await response.json();

      if (userData1 && userData1.status === "success" && userData1.data) {
        const rankList = userData1.data;


        console.log(rankList, "league che")
        // Filter players by team name
        const matchingData = rankList.filter(item => item.team_name.id === teamName && item.league_name === leagueNameData);
        console.log(matchingData, 'matchdata che')
        if (matchingData.length > 0) {
          // Filter out players already in playersName and those in disablePlayers
          const playerFilters = matchingData.filter(play =>
            !playersName.some(p => p.id === play.id) &&
            !disablePlayers.some(p => p.id === play.id)
          );

          const playerCheckboxes = document.getElementById(checkboxContainerId);
          playerCheckboxes.innerHTML = ''; // Clear previous checkboxes

          playerFilters.forEach(player => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'form-check';

            const checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxInput.className = 'form-check-input';
            checkboxInput.id = `player-${player.id}`;
            checkboxInput.value = player.id;

            const checkboxLabel = document.createElement('label');
            checkboxLabel.className = 'form-check-label';
            checkboxLabel.htmlFor = `player-${player.id}`;
            checkboxLabel.textContent = player.player_name;

            checkboxDiv.appendChild(checkboxInput);
            checkboxDiv.appendChild(checkboxLabel);

            playerCheckboxes.appendChild(checkboxDiv);

          });
        } else {
          console.log('No matching data found.');
        }
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  }

  async function saveSelectedPlayersA() {
  // Collect selected players for Team A
  const selectedPlayersA = Array.from(document.querySelectorAll('#playerCheckboxesA input[type="checkbox"]:checked'))
    .map(checkbox => ({
      id: checkbox.value,
      player_name: checkbox.nextElementSibling.textContent
    }));

  console.log('Selected Players for Team A:', selectedPlayersA);

  // Fetch existing match data
  const matchUrl = `https://krinik.in/match_get/${id}/`;
  try {
    const matchResponse = await fetch(matchUrl);
    if (!matchResponse.ok) {
      throw new Error('Failed to fetch match data');
    }

    const matchData = await matchResponse.json();
    const existingPlayersA = matchData.data.select_player_A || [];
    const existingPlayersB = matchData.data.select_player_B || [];
    disableplayersA = matchData.data.disable_player_A;
    disableplayersB = matchData.data.disable_player_B;

    const filteredExistingPlayersA = existingPlayersA.filter(p => !disableplayersA.includes(p.id));

    // Merge existing players with new selected players (keeping order)
    const updatedPlayersA = [...filteredExistingPlayersA, ...selectedPlayersA];

    // Update arr with selected player IDs (ensure no duplicates and maintain order)
    selectedPlayersA.forEach(player => {
      // Add player ID to arr only if it's not already in arr
      if (!arr.includes(Number(player.id))) {
        arr.push(Number(player.id)); // Ensure the player ID is converted to a number before pushing
      }
    });

    console.log('arr after adding Team A players:', arr);

    // Save the updated players list for Team A
    const response = await fetch(matchUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        select_player_A: updatedPlayersA.map(p => p.id),
        select_player_B: existingPlayersB.map(p => p.id),
        disable_player_A: disableplayersA.map(p => p.id),
        disable_player_B: disableplayersB.map(p => p.id),
        player_list: arr // Send the entire updated arr
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to save selected players for Team A');
    }

    const result = await response.json();
    console.log('Save result for Team A:', result);

    // Refresh user data
    fetchUserData1();
    fetchUserData();
    
  } catch (error) {
    console.error('Error saving selected players for Team A:', error);
    alert('Failed to save selected players for Team A.');
  }
}

async function saveSelectedPlayersB() {
  // Collect selected players for Team B
  const selectedPlayersB = Array.from(document.querySelectorAll('#playerCheckboxesB input[type="checkbox"]:checked'))
    .map(checkbox => ({
      id: checkbox.value,
      player_name: checkbox.nextElementSibling.textContent
    }));

  console.log('Selected Players for Team B:', selectedPlayersB);

  // Fetch existing match data
  const matchUrl = `https://krinik.in/match_get/${id}/`;
  try {
    const matchResponse = await fetch(matchUrl);
    if (!matchResponse.ok) {
      throw new Error('Failed to fetch match data');
    }

    const matchData = await matchResponse.json();
    const existingPlayersA = matchData.data.select_player_A || [];
    const existingPlayersB = matchData.data.select_player_B || [];
    disableplayersA = matchData.data.disable_player_A;
    disableplayersB = matchData.data.disable_player_B;

    const filteredExistingPlayersB = existingPlayersB.filter(p => !disableplayersB.includes(p.id));

    // Merge existing players with new selected players (keeping order)
    const updatedPlayersB = [...filteredExistingPlayersB, ...selectedPlayersB];

    // Update arr with selected player IDs (ensure no duplicates and maintain order)
    selectedPlayersB.forEach(player => {
      // Add player ID to arr only if it's not already in arr
      if (!arr.includes(Number(player.id))) {
        arr.push(Number(player.id)); // Ensure the player ID is converted to a number before pushing
      }
    });

    console.log('arr after adding Team B players:', arr);

    // Save the updated players list for Team B
    const response = await fetch(matchUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        select_player_B: updatedPlayersB.map(p => p.id),
        select_player_A: existingPlayersA.map(p => p.id),
        disable_player_A: disableplayersA.map(p => p.id),
        disable_player_B: disableplayersB.map(p => p.id),
        player_list: arr // Send the entire updated arr
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save selected players for Team B');
    }

    const result = await response.json();
    console.log('Save result for Team B:', result);

    // Refresh user data
    fetchUserData1();
    fetchUserData();
    
  } catch (error) {
    console.error('Error saving selected players for Team B:', error);
    alert('Failed to save selected players for Team B.');
  }
}

  document.getElementById("saveSelectedPlayersBtnA").addEventListener("click", saveSelectedPlayersA);
  document.getElementById("saveSelectedPlayersBtnB").addEventListener("click", saveSelectedPlayersB);


  window.onload = checkAdminAccess();

