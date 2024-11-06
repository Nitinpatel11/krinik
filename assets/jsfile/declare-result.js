
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
const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');
let NumberId = Number(id);
console.log(typeof NumberId, NumberId, "NumberId");
let teamData
let matchName
let userplayerdata = []
let user_match_data
let totalMoney

async function apiCall() {
  try {
    console.log("Starting API calls...");

    // Using Promise.all to execute all requests concurrently
    const [data, data1, user_match] = await Promise.all([
      $.ajax({ url: `https://krinik.in/match_get/`, method: "GET" }),
      $.ajax({ url: `https://krinik.in/player_get/`, method: "GET" }),
      $.ajax({ url: `https://krinik.in/user_match_get/`, method: "GET" })
    ]);

    // // Accessing data properties if available
    // console.log(matchData.data);
    // console.log(userMatchData.data);

    // const teamData = playerData.data;
    teamData = data1.data
    console.log(teamData,"uio")
       let matchCheck = user_match.data
       console.log(matchCheck,"dataCheck");
   

    fetchData(NumberId,data,teamData,matchCheck)

  } catch (error) {
    console.error("Error occurred:", error);
  }
}



async function fetchData(NumberId,data,teamData,matchCheck) {
  try { 
    
  

    

    if (data && data.status === "success") {
      console.log(data.data);
      console.log(NumberId, "fit");

      // Log all IDs in the response data
    if(matchCheck.length > 0){
      user_match_data = matchCheck.filter((p) => p.match.id === NumberId )
      
    }
    console.log(user_match_data,"user_match_data")

    totalMoney = user_match_data.reduce((accumulator, userMatch) => {
        return userMatch.total_amount + accumulator;
      }, 0);
      console.log("Total Money:", totalMoney);

      // Compare the values directly
      let filtermatchview = data.data.find((p) => p.id === NumberId);
      matchName = filtermatchview.match_display_name
      console.log(filtermatchview,"matchName")
      let Players1 = filtermatchview.select_player_A.map((p)=>p)
      let Players2 = filtermatchview.select_player_B.map((p)=>p)

      let AllPlayers = [...Players1,...Players2]
      console.log(AllPlayers,"Allplayers")

      let Players12 = filtermatchview.player_list
      
      if (filtermatchview) {
        let filteredPlayers = Players12
   .filter(playerId => AllPlayers.some(player => player.id === playerId)) // Check if playerId exists in AllPlayers
   .map(playerId => teamData.find(player => player.id === playerId)); // Map to actual player data from teamData


        console.log(filteredPlayers, "Filtered team players (Order matches Players12)");
        let sortfiltereplayers = [...new Set(filteredPlayers)]
      
        rankList = sortfiltereplayers;

        array = rankList;
        filterAndDisplay();
      } else {
        console.error("No match found for the given ID.");
      }
    } else {
      console.error("Error: Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}


apiCall()

function filterAndDisplay() {
  // filterRankList();
  preLoadCalculations();
  displayIndexButtons();
  displayTableRows();
  highlightIndexButton();
  
}

function preLoadCalculations(filteredArrayLength) {
  array_length = filteredArrayLength || array.length;
  max_index = Math.ceil(array_length / table_size);
}

function filterRankList() {
  

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


function displayTableRows() {
  $("table tbody").empty();
  var tab_start = start_index - 1;
  var tab_end = end_index;

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

  // Loop through the array for the specified range
  for (var i = tab_start; i < tab_end && i < array.length; i++) {
    var showdata = array[i];

    console.log(showdata, "showData");

    var tr = $("<tr></tr>")
      .attr("data-player-id", showdata["id"]) // Store playerId in a data attribute
      .attr("data-match-id", showdata["team_name"].id); // Store matchId in a data attribute

    var noCell = $("<td></td>").text(i + 1);
    var fullNameCell = $("<td colspan='2'></td>").text(showdata["player_name"] || "");
    var shortNameCell = $("<td colspan='2'></td>").text(showdata["team_name"].team_name || "");

    // Use .html() to properly render the input element
    var enterRun = $("<td class='responsive-td'></td>").html("<input type='text' placeholder='Enter Run' class='run-input p-2 text-center'>");

    tr.append(noCell)
      .append(fullNameCell)
      .append(shortNameCell)
      .append(enterRun);

    $("table tbody").append(tr);
  }
}


async function postRunData() {
  // Array to hold player data objects
  var dataToPost = [];
  // var totalMatchScore = 0;

  // Loop through all the rows in the table
  $("table tbody tr").each(function() {
    // Get the run value and convert it to a number
    var runValue = $(this).find(".run-input").val();
    runValue = runValue ? Number(runValue) : 0; // Convert to number

    // Get playerId and matchId from the data attributes
    var playerId = $(this).data("player-id");
    var matchId = $(this).data("match-id");

    // Create player data object with playerId and matchId
    var playerData = {
      player_declare: playerId,  // Use playerId instead of playerName
      team_declare: matchId,     // Use matchId instead of teamName
      total_run: runValue,
      select_match: matchName    // Use matchName as it is
    };
    var playerData1 = {
      player_id: playerId,  // Use playerId instead of playerName
          // Use matchId instead of teamName
      run: runValue,
         // Use matchName as it is
    };

    // Push the playerData to the array
    dataToPost.push(playerData);
    userplayerdata.push(playerData1)
  });

  // console.log(dataToPost, "dataPost");

  // Send each player data object individually to the API
  dataToPost.forEach(function(data) {
    // POST request to submit the run data to the pool_declare endpoint
    $.ajax({
      url: 'https://krinik.in/pool_declare/', // Replace with your API endpoint
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data), // Convert the playerData object to JSON string

      success: function(response) {
        // console.log("Data posted successfully for", data.player_declare, response);
      },
      error: function(error) {
        console.error("Error posting data for", data.player_declare, error);
        alert("Failed to submit run data for " + data.player_declare + ".");
      }
    });

    // First, get the current total_run value from the player_get endpoint
    $.ajax({
  url: `https://krinik.in/player_get/${data.player_declare}/`, // Use playerId to fetch the player's current total_run
  type: 'GET',
  success: function(response) {
    console.log(response,"olp")
    // Check if the total_run is present in the response and log it
    if (response && typeof response.data.total_run == 'number') {
      var currentRun = response.data.total_run; // Get the current total_run from the API response
      console.log("Current total_run from API for player", data.player_declare, ":", currentRun);

      // Add the new run value to the existing total_run
      var updatedRun = currentRun + data.total_run;
      console.log("Updated total_run (current + new):", updatedRun);

      // PATCH request to update the total_run field with the new value
      $.ajax({
        url: `https://krinik.in/player_get/${data.player_declare}/`, // Use playerId to update the player's total_run
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify({
          total_run: updatedRun // Send the updated total_run value
        }),
        success: function(patchResponse) {
          console.log("Total run updated successfully for player", data.player_declare, patchResponse);
        },
        error: function(patchError) {
          console.error("Error updating total run for player", data.player_declare, patchError);
          alert("Failed to update total run for " + data.player_declare + ".");
        }
      });
    } else {
      console.error("Error: total_run is not present or invalid in the API response for player", data.player_declare);
    }
  },
  error: function(getError) {
    console.error("Error fetching current total run for player", data.player_declare, getError);
    alert("Failed to fetch current total run for " + data.player_declare + ".");
  }
});

  });

  let matchScores = []; // Array to store match scores

// Use Promise.all to handle asynchronous operations in the forEach loop
const matchPromises = user_match_data.map(async (match) => {
    let totalMatchScore = 0;  // Reset totalMatchScore for each match

    // Loop through match players
    match.player.forEach(player => {
        // Find the corresponding player in userplayerdata using player_id
        const matchedPlayer = userplayerdata.find(p => p.player_id === player.id);

        if (matchedPlayer) {
            // If the player is found, get their run, default to 0 if not available
            const playerRun = matchedPlayer.run || 0;
            console.log(playerRun, "player");
            let finalRun = playerRun;

            // Adjust player run based on captain and vice-captain conditions
            if (player.match_captain) {
                finalRun = playerRun * 2;  // Double the run if the player is the captain
            } else if (player.match_vice_captain) {
                finalRun = playerRun * 1.5;  // 1.5x the run if the player is the vice-captain
            }

            // Add the adjusted run to totalMatchScore
            totalMatchScore += finalRun;
        }
    });

    // Output total match score for debugging
    console.log(`Total Match Score for match ${match.id}:`, totalMatchScore);

    // Store the total score for each match
    matchScores.push({
        matchId: match.id,
        pool_name: match.pool_name,
        score: totalMatchScore
    });
    console.log(matchScores, "matchScores");

    // PATCH the total match score to the API for each match
    try {
        await $.ajax({
            url: `https://krinik.in/user_match_get/${match.id}`,  // Use match ID for updating
            type: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({
                score: totalMatchScore  // Send the calculated total score
            }),
            success: function(response) {
                console.log(`Total match score updated successfully for match ${match.id}`, response);
            },
            error: function(error) {  // Error handling for the AJAX call
                console.error(`Error updating match score for match ${match.id}:`, error);
            }
        });
    } catch (error) {
        console.error(`Failed to update score for match ${match.id}:`, error);
    }
});

// Wait for all match score calculations and PATCH requests to complete
Promise.all(matchPromises).then(() => {
    // Group match scores by pool_name
    const groupedScores = matchScores.reduce((acc, match) => {
        // If the pool_name does not exist in the accumulator, create an array for it
        if (!acc[match.pool_name]) {
            acc[match.pool_name] = [];
        }
        // Add the match to the corresponding pool_name group
        acc[match.pool_name].push(match);
        return acc;
    }, {});

    console.log(groupedScores, "Grouped Scores by Pool");

    // Iterate over each pool group to calculate the highest score and update the winning status
    Object.keys(groupedScores).forEach(poolName => {
        const poolMatches = groupedScores[poolName];

        // Find the highest score in the current pool
        const maxScore = Math.max(...poolMatches.map(match => match.score));

        // Update the winning status for each match in the pool
        poolMatches.forEach(async (match) => {
            let winningStatus = match.score === maxScore ? "Winner" : "Contestant"; // Determine winner based on maxScore

            // PATCH the winning status to the API for each match
            try {
                await $.ajax({
                    url: `https://krinik.in/user_match_get/${match.matchId}`,  // Use match ID for updating
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        winning_status: winningStatus  // Send the winning status
                    }),
                    success: function(response) {
                        console.log(`Winning status updated successfully for match ${match.matchId}`, response);
                    },
                    error: function(error) {
                        console.error(`Error updating winning status for match ${match.matchId}:`, error);
                    }
                });
            } catch (error) {
                console.error(`Failed to update winning status for match ${match.matchId}:`, error);
            }
        });
    });
}).catch(error => {
    console.error('Error in processing matches:', error);
});

    // Next, POST individual player scores in players_score
    user_match_data.forEach((match) => {
    const players_score = [];

    // Loop through the players in the match
    match.player.forEach((player) => {
        // Find the corresponding player in userplayerdata using player_id
        const matchedPlayer = userplayerdata.find(p => p.player_id === player.id);

        if (matchedPlayer) {
            // Push the matched player data to the players_score array
            players_score.push(matchedPlayer);
        }
    });

    // Prepare data without checking players_score length
    const updatedData = {
        players_score: players_score  // Set players_score with the filtered players
    };

    // Send a PATCH request to update the players_score field
    $.ajax({
        url: `https://krinik.in/user_match_get/${match.id}`, // API endpoint with match ID
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify(updatedData), // Send only the players_score field as an array
        success: function(response) {
            console.log("Player scores posted successfully for match", match.id, response);
        },
        error: function(error) {
            console.error("Error posting player scores for match", match.id, error);
            alert("Failed to submit player scores for match " + match.id + ".");
        }
    });
});



    // Optionally redirect after submitting
  window.location.href = "match-name.html";
}



fetchData(NumberId);
// Set up the click event handler for the submit button
$(document).ready(function() {
  $("#submitButton").on("click", function() {
    postRunData(); // Call the function to post data
  });
});


