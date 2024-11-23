import {checkAdminAccess,sendNotification}  from "../js/initial.js"
// var rankList = [];
// var array = [];
// var array_length = 0;
// var table_size = 10;
// var start_index = 1;
// var end_index = 0;
// var current_index = 1;
// var max_index = 0;
// var otpApi 
// var otpApi2 
// let totaldataleague = document.querySelector("#total-league-data");
// let otpAdd = document.querySelector("#add-new-btn");
// const urlParams = new URLSearchParams(window.location.search);
// let id = urlParams.get('id');
// let NumberId = Number(id);
// console.log(typeof NumberId, NumberId, "NumberId");
// let teamData
// let matchName
// let userplayerdata = []
// let user_match_data
// let totalMoney

// async function apiCall() {
//   try {
//     console.log("Starting API calls...");

//     // Using Promise.all to execute all requests concurrently
//     const [data, data1, user_match] = await Promise.all([
//       $.ajax({ url: `https://krinik.in/match_get/`, method: "GET" }),
//       $.ajax({ url: `https://krinik.in/player_get/`, method: "GET" }),
//       $.ajax({ url: `https://krinik.in/user_match_get/`, method: "GET" })
//     ]);

//     // // Accessing data properties if available
//     // console.log(matchData.data);
//     // console.log(userMatchData.data);

//     // const teamData = playerData.data;
//     teamData = data1.data
//     console.log(teamData,"uio")
//        let matchCheck = user_match.data
//        console.log(matchCheck,"dataCheck");
   

//     fetchData(NumberId,data,teamData,matchCheck)

//   } catch (error) {
//     console.error("Error occurred:", error);
//   }
// }



// async function fetchData(NumberId,data,teamData,matchCheck) {
//   try { 
    
  

    

//     if (data && data.status === "success") {
//       console.log(data.data);
//       console.log(NumberId, "fit");

//       // Log all IDs in the response data
//     if(matchCheck.length > 0){
//       user_match_data = matchCheck.filter((p) => p.match.id === NumberId )
      
//     }
//     console.log(user_match_data,"user_match_data")
//     if(matchCheck.length > 0){
//     totalMoney = user_match_data.reduce((accumulator, userMatch) => {
//         return userMatch.total_amount + accumulator;
//       }, 0);
//     }
//     console.log("Total Money:", totalMoney);
//       // Compare the values directly
//       let filtermatchview = data.data.find((p) => p.id === NumberId);
//       matchName = filtermatchview.match_display_name
//       console.log(filtermatchview,"matchName")
//       let Players1 = filtermatchview.select_player_A.map((p)=>p)
//       let Players2 = filtermatchview.select_player_B.map((p)=>p)

//       let AllPlayers = [...Players1,...Players2]
//       console.log(AllPlayers,"Allplayers")

//       let Players12 = filtermatchview.player_list
      
//       if (filtermatchview) {
//         let filteredPlayers = Players12
//    .filter(playerId => AllPlayers.some(player => player.id === playerId)) // Check if playerId exists in AllPlayers
//    .map(playerId => teamData.find(player => player.id === playerId)); // Map to actual player data from teamData


//         console.log(filteredPlayers, "Filtered team players (Order matches Players12)");
//         let sortfiltereplayers = [...new Set(filteredPlayers)]
      
//         rankList = sortfiltereplayers;

//         array = rankList;
//         filterAndDisplay();
//       } else {
//         console.error("No match found for the given ID.");
//       }
//     } else {
//       console.error("Error: Invalid data format");
//     }
//   } catch (error) {
//     console.error("Error fetching data", error);
//   }
// }


// apiCall()

// function filterAndDisplay() {
//   // filterRankList();
//   preLoadCalculations();
//   displayIndexButtons();
//   displayTableRows();
//   highlightIndexButton();
  
// }

// function preLoadCalculations(filteredArrayLength) {
//   array_length = filteredArrayLength || array.length;
//   max_index = Math.ceil(array_length / table_size);
// }

// function filterRankList() {
  

//     array = filteredArray;
//     preLoadCalculations();
//     current_index = 1;
//     displayIndexButtons();
//     highlightIndexButton()
//     displayTableRows();
// }



// function displayIndexButtons() {
// $(".index_buttons ul").empty();

// if (array_length <= table_size) {
//     // If there are 10 or fewer items, do not show pagination
//     return;
// }

// if (current_index > 1) {
//     $(".index_buttons ul").append('<li><button class="paginate_button page-item previous" onclick="prev()">Previous</button></li>');
// }

// const show_page = getElidedPageRange(current_index, max_index);

// show_page.forEach(i => {
//     if (i === current_index) {
//         $(".index_buttons ul").append('<li><button class="paginate_button page-item active">' + i + '</button></li>');
//     } else if (i === "...") {
//         $(".index_buttons ul").append('<li><button class="paginate_button page-item">...</button></li>');
//     } else {
//         $(".index_buttons ul").append('<li><button class="paginate_button page-item" onclick="indexPagination(' + i + ')">' + i + '</button></li>');
//     }
// });

// if (current_index < max_index) {
//     $(".index_buttons ul").append('<li><button class="paginate_button page-item next" onclick="next()">Next</button></li>');
// }

// highlightIndexButton();
// }


// function getElidedPageRange(current, total) {
//     const delta = 1;
//     const range = [];
//     const left = current - delta;
//     const right = current + delta + 1;
//     let last = 0;

//     for (let i = 1; i <= total; i++) {
//         if (i === 1 || i === total || (i >= left && i < right)) {
//             if (last + 1 !== i) {
//                 range.push("...");
//             }
//             range.push(i);
//             last = i;
//         }
//     }

//     return range;
// }

// function highlightIndexButton() {
//     start_index = (current_index - 1) * table_size + 1;
//     end_index = Math.min(start_index + table_size - 1, array_length);
//     $("#datatable_info").text("Showing " + start_index + " to " + end_index + " of " + array_length + " items");
//     $(".index_buttons ul a").removeClass("active");
//     $('.index_buttons ul a').each(function () {
//         if ($(this).text() == current_index) {
//             $(this).addClass("active");
//         }
//     });
//     displayTableRows();
// }
// function prev() {
//     if (current_index > 1) {
//         current_index--;
//         displayIndexButtons();
//         highlightIndexButton();
//     }
// }

// function next() {
//     if (current_index < max_index) {
//         current_index++;
//         displayIndexButtons();
//         highlightIndexButton();
//     }
// }

// function indexPagination(index) {
//     current_index = index;
//     displayIndexButtons();
//     highlightIndexButton();
// }


// function displayTableRows() {
//   $("table tbody").empty();
//   var tab_start = start_index - 1;
//   var tab_end = end_index;

//   if (array.length === 0) {
//     $("#noDataFound").show();
//     $("#pagination").hide();
//     $("#table-scrolling").css("overflow-x", "hidden");
//     return;
//   } else {
//     $("#noDataFound").hide();
//     $("#pagination").show();
//     $("#table-scrolling").css("overflow-x", "auto");
//   }

//   // Loop through the array for the specified range
//   for (var i = tab_start; i < tab_end && i < array.length; i++) {
//     var showdata = array[i];

//     console.log(showdata, "showData");

//     var tr = $("<tr></tr>")
//       .attr("data-player-id", showdata["id"]) // Store playerId in a data attribute
//       .attr("data-match-id", showdata["team_name"].id); // Store matchId in a data attribute

//     var noCell = $("<td></td>").text(i + 1);
//     var fullNameCell = $("<td colspan='2'></td>").text(showdata["player_name"] || "");
//     var shortNameCell = $("<td colspan='2'></td>").text(showdata["team_name"].team_name || "");

//     // Use .html() to properly render the input element
//     var enterRun = $("<td class='responsive-td'></td>").html("<input type='text' placeholder='Enter Run' class='run-input p-2 text-center'>");

//     tr.append(noCell)
//       .append(fullNameCell)
//       .append(shortNameCell)
//       .append(enterRun);

//     $("table tbody").append(tr);
//   }
// }


// async function postRunData() {
//   // Array to hold player data objects
//   var dataToPost = [];
//   // var totalMatchScore = 0;

//   // Loop through all the rows in the table
//   $("table tbody tr").each(function() {
//     // Get the run value and convert it to a number
//     var runValue = $(this).find(".run-input").val();
//     runValue = runValue ? Number(runValue) : 0; // Convert to number

//     // Get playerId and matchId from the data attributes
//     var playerId = $(this).data("player-id");
//     var matchId = $(this).data("match-id");

//     // Create player data object with playerId and matchId
//     var playerData = {
//       player_declare: playerId,  // Use playerId instead of playerName
//       team_declare: matchId,     // Use matchId instead of teamName
//       total_run: runValue,
//       select_match: matchName    // Use matchName as it is
//     };
//     var playerData1 = {
//       player_id: playerId,  // Use playerId instead of playerName
//           // Use matchId instead of teamName
//       run: runValue,
//          // Use matchName as it is
//     };

//     // Push the playerData to the array
//     dataToPost.push(playerData);
//     userplayerdata.push(playerData1)
//   });

//   // console.log(dataToPost, "dataPost");

//   // Send each player data object individually to the API
//   dataToPost.forEach(function(data) {
//     // POST request to submit the run data to the pool_declare endpoint
//     $.ajax({
//       url: 'https://krinik.in/pool_declare/', // Replace with your API endpoint
//       type: 'POST',
//       contentType: 'application/json',
//       data: JSON.stringify(data), // Convert the playerData object to JSON string

//       success: function(response) {
//         // console.log("Data posted successfully for", data.player_declare, response);
//       },
//       error: function(error) {
//         console.error("Error posting data for", data.player_declare, error);
//         alert("Failed to submit run data for " + data.player_declare + ".");
//       }
//     });

//     // First, get the current total_run value from the player_get endpoint
//     $.ajax({
//   url: `https://krinik.in/player_get/${data.player_declare}/`, // Use playerId to fetch the player's current total_run
//   type: 'GET',
//   success: function(response) {
//     console.log(response,"olp")
//     // Check if the total_run is present in the response and log it
//     if (response && typeof response.data.total_run == 'number') {
//       var currentRun = response.data.total_run; // Get the current total_run from the API response
//       console.log("Current total_run from API for player", data.player_declare, ":", currentRun);

//       // Add the new run value to the existing total_run
//       var updatedRun = currentRun + data.total_run;
//       console.log("Updated total_run (current + new):", updatedRun);

//       // PATCH request to update the total_run field with the new value
//       $.ajax({
//         url: `https://krinik.in/player_get/${data.player_declare}/`, // Use playerId to update the player's total_run
//         type: 'PATCH',
//         contentType: 'application/json',
//         data: JSON.stringify({
//           total_run: updatedRun // Send the updated total_run value
//         }),
//         success: function(patchResponse) {
//           console.log("Total run updated successfully for player", data.player_declare, patchResponse);
//         },
//         error: function(patchError) {
//           console.error("Error updating total run for player", data.player_declare, patchError);
//           alert("Failed to update total run for " + data.player_declare + ".");
//         }
//       });
//     } else {
//       console.error("Error: total_run is not present or invalid in the API response for player", data.player_declare);
//     }
//   },
//   error: function(getError) {
//     console.error("Error fetching current total run for player", data.player_declare, getError);
//     alert("Failed to fetch current total run for " + data.player_declare + ".");
//   }
// });

//   });

//   let matchScores = []; // Array to store match scores

// // Use Promise.all to handle asynchronous operations in the forEach loop
// const matchPromises = user_match_data.map(async (match) => {
//     let totalMatchScore = 0;  // Reset totalMatchScore for each match

//     // Loop through match players
//     match.player.forEach(player => {
//         // Find the corresponding player in userplayerdata using player_id
//         const matchedPlayer = userplayerdata.find(p => p.player_id === player.id);

//         if (matchedPlayer) {
//             // If the player is found, get their run, default to 0 if not available
//             const playerRun = matchedPlayer.run || 0;
//             console.log(playerRun, "player");
//             let finalRun = playerRun;

//             // Adjust player run based on captain and vice-captain conditions
//             if (player.match_captain) {
//                 finalRun = playerRun * 2;  // Double the run if the player is the captain
//             } else if (player.match_vice_captain) {
//                 finalRun = playerRun * 1.5;  // 1.5x the run if the player is the vice-captain
//             }

//             // Add the adjusted run to totalMatchScore
//             totalMatchScore += finalRun;
//         }
//     });

//     // Output total match score for debugging
//     console.log(`Total Match Score for match ${match.id}:`, totalMatchScore);

//     // Store the total score for each match
//     matchScores.push({
//         matchId: match.id,
//         pool_name: match.pool_name,
//         score: totalMatchScore
//     });
//     console.log(matchScores, "matchScores");

//     // PATCH the total match score to the API for each match
//     try {
//         await $.ajax({
//             url: `https://krinik.in/user_match_get/${match.id}`,  // Use match ID for updating
//             type: 'PATCH',
//             contentType: 'application/json',
//             data: JSON.stringify({
//                 score: totalMatchScore  // Send the calculated total score
//             }),
//             success: function(response) {
//                 console.log(`Total match score updated successfully for match ${match.id}`, response);
//             },
//             error: function(error) {  // Error handling for the AJAX call
//                 console.error(`Error updating match score for match ${match.id}:`, error);
//             }
//         });
//     } catch (error) {
//         console.error(`Failed to update score for match ${match.id}:`, error);
//     }
// });

// // Wait for all match score calculations and PATCH requests to complete
// Promise.all(matchPromises).then(() => {
//     // Group match scores by pool_name
//     const groupedScores = matchScores.reduce((acc, match) => {
//         // If the pool_name does not exist in the accumulator, create an array for it
//         if (!acc[match.pool_name]) {
//             acc[match.pool_name] = [];
//         }
//         // Add the match to the corresponding pool_name group
//         acc[match.pool_name].push(match);
//         return acc;
//     }, {});

//     console.log(groupedScores, "Grouped Scores by Pool");

//     // Iterate over each pool group to calculate the highest score and update the winning status
//     Object.keys(groupedScores).forEach(poolName => {
//         const poolMatches = groupedScores[poolName];

//         // Find the highest score in the current pool
//         const maxScore = Math.max(...poolMatches.map(match => match.score));

//         // Update the winning status for each match in the pool
//         poolMatches.forEach(async (match) => {
//             let winningStatus = match.score === maxScore ? "Winner" : "Contestant"; // Determine winner based on maxScore

//             // PATCH the winning status to the API for each match
//             try {
//                 await $.ajax({
//                     url: `https://krinik.in/user_match_get/${match.matchId}`,  // Use match ID for updating
//                     type: 'PATCH',
//                     contentType: 'application/json',
//                     data: JSON.stringify({
//                         winning_status: winningStatus  // Send the winning status
//                     }),
//                     success: function(response) {
//                         console.log(`Winning status updated successfully for match ${match.matchId}`, response);
//                     },
//                     error: function(error) {
//                         console.error(`Error updating winning status for match ${match.matchId}:`, error);
//                     }
//                 });
//             } catch (error) {
//                 console.error(`Failed to update winning status for match ${match.matchId}:`, error);
//             }
//         });
//     });
// }).catch(error => {
//     console.error('Error in processing matches:', error);
// });

//     // Next, POST individual player scores in players_score
//     user_match_data.forEach((match) => {
//     const players_score = [];

//     // Loop through the players in the match
//     match.player.forEach((player) => {
//         // Find the corresponding player in userplayerdata using player_id
//         const matchedPlayer = userplayerdata.find(p => p.player_id === player.id);

//         if (matchedPlayer) {
//             // Push the matched player data to the players_score array
//             players_score.push(matchedPlayer);
//         }
//     });

//     // Prepare data without checking players_score length
//     const updatedData = {
//         players_score: players_score  // Set players_score with the filtered players
//     };

//     // Send a PATCH request to update the players_score field
//     $.ajax({
//         url: `https://krinik.in/user_match_get/${match.id}`, // API endpoint with match ID
//         type: 'PATCH',
//         contentType: 'application/json',
//         data: JSON.stringify(updatedData), // Send only the players_score field as an array
//         success: function(response) {
//             console.log("Player scores posted successfully for match", match.id, response);
//         },
//         error: function(error) {
//             console.error("Error posting player scores for match", match.id, error);
//             alert("Failed to submit player scores for match " + match.id + ".");
//         }
//     });
// });



//     // Optionally redirect after submitting
//   window.location.href = "match-name.html";
// }



// // fetchData(NumberId);
// // Set up the click event handler for the submit button
// $(document).ready(function() {
//   $("#submitButton").on("click", function() {
//     postRunData(); // Call the function to post data
//   });
// });


  
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
  let matchIdData
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
        matchIdData = user_match_data[0].match.id
        console.log(matchIdData,"oplopl")
      }
      console.log(user_match_data,"user_match_data")
      if(matchCheck.length > 0){
      totalMoney = user_match_data.reduce((accumulator, userMatch) => {
          return userMatch.invest_amount + accumulator;
        }, 0);
      }
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
  
  
  // async function postRunData() {
  //   // Array to hold player data objects
  //   var dataToPost = [];
  
  //   $("table tbody tr").each(function() {
  //     // Get the run value and convert it to a number
  //     var runValue = $(this).find(".run-input").val();
  //     runValue = runValue ? Number(runValue) : 0; // Convert to number
  
  //     // Get playerId and matchId from the data attributes
  //     var playerId = $(this).data("player-id");
  //     var matchId = $(this).data("match-id");
  
  //     // Create player data object with playerId and matchId
  //     var playerData = {
  //       player_declare: playerId,  // Use playerId instead of playerName
  //       team_declare: matchId,     // Use matchId instead of teamName
  //       total_run: runValue,
  //       select_match: matchName    // Use matchName as it is
  //     };
  //     var playerData1 = {
  //       player_id: playerId,  // Use playerId instead of playerName
  //           // Use matchId instead of teamName
  //       run: runValue,
  //          // Use matchName as it is
  //     };
  
  //     // Push the playerData to the array
  //     dataToPost.push(playerData);
  //     userplayerdata.push(playerData1)
  //   });
  
  
  //   // Send each player data object individually to the API
  //   dataToPost.forEach(function(data) {
  //     // POST request to submit the run data to the pool_declare endpoint
  //     $.ajax({
  //       url: 'https://krinik.in/pool_declare/', // Replace with your API endpoint
  //       type: 'POST',
  //       contentType: 'application/json',
  //       data: JSON.stringify(data), // Convert the playerData object to JSON string
  
  //       success: function(response) {
  //         // console.log("Data posted successfully for", data.player_declare, response);
  //       },
  //       error: function(error) {
  //         console.error("Error posting data for", data.player_declare, error);
  //         alert("Failed to submit run data for " + data.player_declare + ".");
  //       }
  //     });
  
  //     // First, get the current total_run value from the player_get endpoint
  //     $.ajax({
  //   url: `https://krinik.in/player_get/${data.player_declare}/`, // Use playerId to fetch the player's current total_run
  //   type: 'GET',
  //   success: function(response) {
  //     console.log(response,"olp")
  //     // Check if the total_run is present in the response and log it
  //     if (response && typeof response.data.total_run == 'number') {
  //       var currentRun = response.data.total_run; // Get the current total_run from the API response
  //       console.log("Current total_run from API for player", data.player_declare, ":", currentRun);
  
  //       // Add the new run value to the existing total_run
  //       var updatedRun = currentRun + data.total_run;
  //       console.log("Updated total_run (current + new):", updatedRun);
  
  //       // PATCH request to update the total_run field with the new value
  //       $.ajax({
  //         url: `https://krinik.in/player_get/${data.player_declare}/`, // Use playerId to update the player's total_run
  //         type: 'PATCH',
  //         contentType: 'application/json',
  //         data: JSON.stringify({
  //           total_run: updatedRun // Send the updated total_run value
  //         }),
  //         success: function(patchResponse) {
  //           console.log("Total run updated successfully for player", data.player_declare, patchResponse);
  //         },
  //         error: function(patchError) {
  //           console.error("Error updating total run for player", data.player_declare, patchError);
  //           alert("Failed to update total run for " + data.player_declare + ".");
  //         }
  //       });
  //     } else {
  //       console.error("Error: total_run is not present or invalid in the API response for player", data.player_declare);
  //     }
  //   },
  //   error: function(getError) {
  //     console.error("Error fetching current total run for player", data.player_declare, getError);
  //     alert("Failed to fetch current total run for " + data.player_declare + ".");
  //   }
  // });
  
  //   });
  
  //   let matchScores = []; // Array to store match scores
  
  // // Use Promise.all to handle asynchronous operations in the forEach loop
  // const matchPromises = user_match_data.map(async (match) => {
  //     let totalMatchScore = 0;  // Reset totalMatchScore for each match
  
  //     // Loop through match players
  //     match.player.forEach(player => {
  //         // Find the corresponding player in userplayerdata using player_id
  //         const matchedPlayer = userplayerdata.find(p => p.player_id === player.id);
  
  //         if (matchedPlayer) {
  //             // If the player is found, get their run, default to 0 if not available
  //             const playerRun = matchedPlayer.run || 0;
  //             console.log(playerRun, "player");
  //             let finalRun = playerRun;
  
  //             // Adjust player run based on captain and vice-captain conditions
  //             if (player.match_captain) {
  //                 finalRun = playerRun * 2;  // Double the run if the player is the captain
  //             } else if (player.match_vice_captain) {
  //                 finalRun = playerRun * 1.5;  // 1.5x the run if the player is the vice-captain
  //             }
  
  //             // Add the adjusted run to totalMatchScore
  //             totalMatchScore += finalRun;
  //         }
  //     });
  
  //     // Output total match score for debugging
  //     console.log(`Total Match Score for match ${match.id}:`, totalMatchScore);
  
  //     // Store the total score for each match
  //     matchScores.push({
  //         matchId: match.id,
  //         pool_name: match.pool_name,
  //         score: totalMatchScore
  //     });
  //     console.log(matchScores, "matchScores");
  
  //     // PATCH the total match score to the API for each match
  //     try {
  //         await $.ajax({
  //             url: `https://krinik.in/user_match_get/${match.id}`,  // Use match ID for updating
  //             type: 'PATCH',
  //             contentType: 'application/json',
  //             data: JSON.stringify({
  //                 score: totalMatchScore  // Send the calculated total score
  //             }),
  //             success: function(response) {
  //                 console.log(`Total match score updated successfully for match ${match.id}`, response);
  //             },
  //             error: function(error) {  // Error handling for the AJAX call
  //                 console.error(`Error updating match score for match ${match.id}:`, error);
  //             }
  //         });
  //     } catch (error) {
  //         console.error(`Failed to update score for match ${match.id}:`, error);
  //     }
  // });
  
  // Wait for all match score calculations and PATCH requests to complete
  // Promise.all(matchPromises).then(() => {
  //     // Group match scores by pool_name
  //     const groupedScores = matchScores.reduce((acc, match) => {
  //         // If the pool_name does not exist in the accumulator, create an array for it
  //         if (!acc[match.pool_name]) {
  //             acc[match.pool_name] = [];
  //         }
  //         // Add the match to the corresponding pool_name group
  //         acc[match.pool_name].push(match);
  //         return acc;
  //     }, {});
  
  //     console.log(groupedScores, "Grouped Scores by Pool");
  
  //     // Iterate over each pool group to calculate the highest score and update the winning status
  //     Object.keys(groupedScores).forEach(poolName => {
  //         const poolMatches = groupedScores[poolName];
  
  //         // Find the highest score in the current pool
  //         const maxScore = Math.max(...poolMatches.map(match => match.score));
  
  //         // Update the winning status for each match in the pool
  //         poolMatches.forEach(async (match) => {
  //             let winningStatus = match.score === maxScore ? "Winner" : "Contestant"; // Determine winner based on maxScore
  
  //             // PATCH the winning status to the API for each match
  //             try {
  //                 await $.ajax({
  //                     url: `https://krinik.in/user_match_get/${match.matchId}`,  // Use match ID for updating
  //                     type: 'PATCH',
  //                     contentType: 'application/json',
  //                     data: JSON.stringify({
  //                         winning_status: winningStatus  // Send the winning status
  //                     }),
  //                     success: function(response) {
  //                         console.log(`Winning status updated successfully for match ${match.matchId}`, response);
  //                     },
  //                     error: function(error) {
  //                         console.error(`Error updating winning status for match ${match.matchId}:`, error);
  //                     }
  //                 });
  //             } catch (error) {
  //                 console.error(`Failed to update winning status for match ${match.matchId}:`, error);
  //             }
  //         });
  //     });
  // }).catch(error => {
  //     console.error('Error in processing matches:', error);
  // });
  
      // Next, POST individual player scores in players_score
  //     user_match_data.forEach((match) => {
  //     const players_score = [];
  
  //     // Loop through the players in the match
  //     match.player.forEach((player) => {
  //         // Find the corresponding player in userplayerdata using player_id
  //         const matchedPlayer = userplayerdata.find(p => p.player_id === player.id);
  
  //         if (matchedPlayer) {
  //             // Push the matched player data to the players_score array
  //             players_score.push(matchedPlayer);
  //         }
  //     });
  
  //     // Prepare data without checking players_score length
  //     const updatedData = {
  //         players_score: players_score  // Set players_score with the filtered players
  //     };
  
  //     // Send a PATCH request to update the players_score field
  //     $.ajax({
  //         url: `https://krinik.in/user_match_get/${match.id}`, // API endpoint with match ID
  //         type: 'PATCH',
  //         contentType: 'application/json',
  //         data: JSON.stringify(updatedData), // Send only the players_score field as an array
  //         success: function(response) {
  //             console.log("Player scores posted successfully for match", match.id, response);
  //         },
  //         error: function(error) {
  //             console.error("Error posting player scores for match", match.id, error);
  //             alert("Failed to submit player scores for match " + match.id + ".");
  //         }
  //     });
  // });
  
  
  
      // Optionally redirect after submitting
    // window.location.href = "match-name.html";
  // }
  
  let matchScores = []; 
  const processPlayerData = () => {
    // Initialize arrays to store player data
    const dataToPost = [];
    const userplayerdata = [];
  
    // Get all rows from the table body
    const rows = document.querySelectorAll("table tbody tr");
  
    rows.forEach((row) => {
      // Get the run value and convert it to a number
      const runInput = row.querySelector(".run-input");
      const runValue = runInput && runInput.value ? Number(runInput.value) : 0;
  
      // Get playerId and matchId from the data attributes
      const playerId = Number(row.getAttribute("data-player-id"));
      const matchId = row.getAttribute("data-match-id");
  
      // Get matchName from a data attribute or an input field
      const matchIdData1 = Number(matchIdData) ;
  console.log(matchIdData,"mid")
      // Create the player data objects
      const playerData = {
        player_declare: playerId,
        team_declare: matchId,
        total_run: runValue,
        select_match: matchIdData1,
      };
  
      const playerData1 = {
        player_id: playerId,
        run: runValue,
      };
  
      // Push the player data objects into their respective arrays
      dataToPost.push(playerData);
      userplayerdata.push(playerData1);
    });
  console.log(dataToPost)
  console.log(userplayerdata)
  
    // Return or use the arrays as needed
    return { dataToPost, userplayerdata };
  };  
  
  const postAndUpdateRuns = (dataToPost) => {
    dataToPost.forEach((data) => {
      // POST request to submit the run data to the pool_declare endpoint
      fetch('https://krinik.in/pool_declare/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Convert the playerData object to JSON string
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to post data for ${data.player_declare}`);
          }
          let datashowing1 =  response.json();
          let datashowing = datashowing1.data
          console.log(datashowing,"pool_declare")
          console.log(`Data posted successfully for player ${data.player_declare}`);
        })
        .catch((error) => {
          console.error(`Error posting data for player ${data.player_declare}:`, error);
          alert(`Failed to submit run data for player ${data.player_declare}.`);
        });
  
      // GET request to fetch the current total_run value for the player
      fetch(`https://krinik.in/player_get/${data.player_declare}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch total_run for player ${data.player_declare}`);
          }
          return response.json();
        })
        .then((responseData) => {
          console.log(responseData, "Response from player_get");
          if (responseData && typeof responseData.data.total_run === 'number') {
            const currentRun = responseData.data.total_run; // Current total_run from API
            console.log(`Current total_run for player ${data.player_declare}: ${currentRun}`);
  
            // Add the new run value to the existing total_run
            const updatedRun = currentRun + data.total_run;
            console.log(`Updated total_run (current + new) for player ${data.player_declare}: ${updatedRun}`);
  
            // PATCH request to update the total_run field with the new value
            fetch(`https://krinik.in/player_get/${data.player_declare}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ total_run: updatedRun }),
            })
              .then((patchResponse) => {
                if (!patchResponse.ok) {
                  throw new Error(`Failed to update total_run for player ${data.player_declare}`);
                }
                console.log(`Total run updated successfully for player ${data.player_declare}`);
              })
              .catch((patchError) => {
                console.error(`Error updating total run for player ${data.player_declare}:`, patchError);
                alert(`Failed to update total run for player ${data.player_declare}.`);
              });
          } else {
            console.error(`Error: total_run is not present or invalid for player ${data.player_declare}`);
          }
        })
        .catch((getError) => {
          console.error(`Error fetching current total_run for player ${data.player_declare}:`, getError);
          alert(`Failed to fetch current total_run for player ${data.player_declare}.`);
        });
    });
  };
  
  const updatePlayerScores = async (user_match_data, userplayerdata) => {
    try {
      // Loop through each match in user_match_data
      for (const match of user_match_data) {
        const players_score = [];
  
        // Loop through the players in the match
        for (const player of match.player) {
          // Find the corresponding player in userplayerdata using player_id
          const matchedPlayer = userplayerdata.find(p => p.player_id === player.id);
  
          if (matchedPlayer) {
            // Push the matched player data to the players_score array
            players_score.push(matchedPlayer);
          }
        }
  
        // Prepare the data object with players_score array
        const updatedData = {
          players_score: players_score  // Set players_score with the filtered players
        };
  
        // Send a PATCH request to update the players_score field
        const response = await $.ajax({
          url: `https://krinik.in/user_match_get/${match.id}`,  // API endpoint with match ID
          type: 'PATCH',
          contentType: 'application/json',
          data: JSON.stringify(updatedData),  // Send the players_score field as an array
        });
  
        console.log("Player scores posted successfully for match", match.id, response);
      }
    } catch (error) {
      console.error("Error posting player scores:", error);
      alert("Failed to submit player scores. Please try again.");
    }
  };
  
  
  const updateMatchScores = async (user_match_data1, userplayerdata) => {
      // Array to store match scores
      matchScores = [];
  
  
      // Map through matches and calculate scores asynchronously
      const matchPromises = user_match_data1.map(async (match) => {
          let totalMatchScore = 0; // Reset totalMatchScore for each match
  
          // Loop through players in the match
          match.player.forEach(player => {
              // Find corresponding player in userplayerdata using player_id
              const matchedPlayer = userplayerdata.find(p => p.player_id === player.id);
  
              if (matchedPlayer) {
                  // Get player's run or default to 0
                  const playerRun = matchedPlayer.run || 0;
                  let finalRun = playerRun;
  
                  // Adjust runs for captain and vice-captain
                  if (player.match_captain) {
                      finalRun = playerRun * 2; // Double the runs for captain
                  } else if (player.match_vice_captain) {
                      finalRun = playerRun * 1.5; // 1.5x runs for vice-captain
                  }
  
                  // Add adjusted run to the total match score
                  totalMatchScore += finalRun;
              }
          });
  
          // Log the calculated total score for debugging
          console.log(`Total Match Score for match ${match.id}:`, totalMatchScore);
  
          // Store the total score for this match
          matchScores.push({
              matchId: match.id,
              pool_name: match.pool_name,
              score: totalMatchScore
          });
  
          // PATCH the total match score to the API
          try {
              await $.ajax({
                  url: `https://krinik.in/user_match_get/${match.id}`, // Update using match ID
                  type: 'PATCH',
                  contentType: 'application/json',
                  data: JSON.stringify({
                      score: totalMatchScore // Send the calculated total score
                  }),
                  success: function(response) {
                      console.log(`Total match score updated successfully for match ${match.id}`, response);
                  },
                  error: function(error) { // Error handling for the AJAX call
                      console.error(`Error updating match score for match ${match.id}:`, error);
                  }
              });
          } catch (error) {
              console.error(`Failed to update score for match ${match.id}:`, error);
          }
      });
  
      // Wait for all asynchronous operations to complete
      await Promise.all(matchPromises);
  
      // Log final match scores array
      console.log("Final Match Scores:", matchScores);
  
      // Return match scores for further use if needed
      return matchScores;
  };
  
  const matchScoring = async (user_match_data, userplayerdata) => {
    // Create an empty array to store match scores
    
  
    // Iterate over each match in user_match_data
    await Promise.all(user_match_data.map(async (match) => {
      let players_score1 = [];  // Store player details for this match
  
      // Iterate over userplayerdata to match players with the current match
      await Promise.all(userplayerdata.map(async (player) => {
        // Find the matching player in the current match
        const matchedPlayer = match.player.find(p => p.id === player.player_id);
  
        // If a match is found, push relevant details to players_score1
        if (matchedPlayer) {
          players_score1.push({
            playerId: matchedPlayer.id,
            playerName: matchedPlayer.player_name,
            isCaptain: matchedPlayer.match_captain,
            isViceCaptain: matchedPlayer.match_vice_captain
          });
  
          console.log('Matched player:', matchedPlayer);  // Debugging log
        } else {
          console.log('No match found for player:', player);  // Debugging log
        }
      }));
  
      // Check if this match already exists in matchScores
      const existingMatchScore = matchScores.find(score => score.matchId === match.id);
  
      if (existingMatchScore) {
        // If it exists, update the existing entry
        existingMatchScore.pool_name = match.pool_name;
        existingMatchScore.pool_type = match.pool_type;
        existingMatchScore.price = match.invest_amount;
        existingMatchScore.multiX = match.multi_x;
        existingMatchScore.players_details = players_score1;

  
        // Add additional data to the existing match score
        existingMatchScore.additionalData = "Updated additional data"; // Update additional field
        console.log('Updated Match Scoring:', existingMatchScore);  // Debugging log
      
        // console.log('New Match Scoring:', matchScore);  // Debugging log
      }
    }));
  
    // Log the final match scores array
    console.log('Final Match Scores:', matchScores);
  
    // Return the matchScores array after processing all matches
    return matchScores;
  };
  
  const updateMatchWinningStatus = async (matchScores) => {
    // Group match scores by `pool_name`, `pool_type`, and `price`
    const groupedScores = matchScores.reduce((acc, match) => {
      const key = `${match.pool_name}-${match.pool_type}-${match.price}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(match);
      return acc;
    }, {});
  
    console.log(groupedScores, "Grouped Scores by Pool and Type");
  
    // Iterate over each group to determine the winning status
    for (const poolKey in groupedScores) {
      const poolMatches = groupedScores[poolKey];
  
      // Find the maximum score for the group
      const maxScore = Math.max(...poolMatches.map((match) => match.score));
  
      console.log(`Processing Pool: ${poolKey}, Max Score: ${maxScore}`);
  
      // Assign "Winner" to all matches with `score === maxScore`
      for (const match of poolMatches) {
        const winningStatus = match.score === maxScore ? "Winner" : "Contestant";
  
        // Update the local matchScores array
        const existingMatch = matchScores.find((m) => m.matchId === match.matchId);
        if (existingMatch) {
          existingMatch.winning_status = winningStatus;
        }
  
        // Send AJAX PATCH request to update the backend
        await $.ajax({
          url: `https://krinik.in/user_match_get/${match.matchId}`,
          type: "PATCH",
          contentType: "application/json",
          data: JSON.stringify({ winning_status: winningStatus }),
          success: function (response) {
            console.log(`Winning status updated successfully for match ${match.matchId}`, response);
          },
          error: function (error) {
            console.error(`Error updating winning status for match ${match.matchId}:`, error);
          },
        });
      }
    }
  
    // Return the updated match scores
    return matchScores;
  };
  
 
  
  
  // const allocateMoneyToWinners = async (matchScores, totalMoney) => {
  //   try {
  //     // Group matches for winners only by pool, type, price, and multiX
  //     const MoneyPay = matchScores.reduce((acc, match) => {
  //       if (match.winning_status === "Winner") {
  //         const key = `${match.pool_name}-${match.pool_type}-${match.price}-winner`;
  
  //         if (!acc[key]) {
  //           acc[key] = [];
  //         }
  //         acc[key].push(match);
  //       }
  //       return acc;
  //     }, {});
  
  //     console.log(MoneyPay, "Grouped Money Pay for Winners Only by Pool, Type, Price, and MultiX");
  
  //     // Allocate money based on multiX and player matching
  //     const matchMoneydeclare = Object.keys(MoneyPay).map(poolKey => {
  //       const matchMoney = MoneyPay[poolKey];
  
  //       // Function to check if player arrays are identical
  //       const arePlayerDetailsIdentical = (players1, players2) => {
  //         const sorted1 = players1.map(p => p.player_id).sort();
  //         const sorted2 = players2.map(p => p.player_id).sort();
  //         return JSON.stringify(sorted1) === JSON.stringify(sorted2);
  //       };
  
  //       // Process each match in the pool group
  //       const allocationPromises = matchMoney.map(async (match, index) => {
  //         const matchPlayersDetails = match.players_details;
  
  //         // Determine if prize should be split based on identical players
  //         let shouldSplit = false;
  //         for (let i = 0; i < matchMoney.length; i++) {
  //           if (i !== index && arePlayerDetailsIdentical(matchPlayersDetails, matchMoney[i].players_details)) {
  //             shouldSplit = true;
  //             break;
  //           }
  //         }
  
  //         // Calculate prize amount
  //         const totalPrize = match.price * match.multiX;
  //         const finalPrize = shouldSplit ? totalPrize / 2 : totalPrize;
  
  //         // Deduct prize from totalMoney
  //         totalMoney -= finalPrize;
  
  //         // Allocate prize to each player
  //         for (let player of match.players_details) {
  //           const playerId = player.player_id;
  //           try {
  //             await $.ajax({
  //               url: `https://krinik.in/user_match_get/${match.matchId}`,
  //               type: 'PATCH',
  //               contentType: 'application/json',
  //               data: JSON.stringify({
  //                 player_id: playerId,
  //                 total_amount: finalPrize
  //               }),
  //               success: function(response) {
  //                 console.log(`Prize money ${finalPrize} allocated successfully for player ${playerId} in match ${match.matchId}`, response);
  //               },
  //               error: function(error) {
  //                 console.error(`Error allocating prize money for player ${playerId} in match ${match.matchId}:`, error);
  //               }
  //             });
  //           } catch (error) {
  //             console.error(`Failed to allocate prize money for player ${playerId} in match ${match.matchId}:`, error);
  //           }
  //         }
  //       });
  
  //       return Promise.all(allocationPromises);
  //     });
  
  //     // Wait for all prize allocations to complete
  //     await Promise.all(matchMoneydeclare);
  
  //     console.log(`Remaining total money after allocations: ${totalMoney}`);
  
  //     // Fetch the current balance in admin wallet
  //     let currentWalletBalance = 0;
  //     let currentadminId;
  //     await $.ajax({
  //       url: `https://krinik.in/admin_wallet/`,
  //       type: 'GET',
  //       success: function(response) {
  //         if (response.status === "success" && response.data && response.data.length > 0) {
  //           currentadminId = response.data[0].id;
  //           currentWalletBalance = response.data[0].total_amount; // Access total_amount from the first item in data array
  //           console.log(`Fetched current admin wallet balance: ${currentWalletBalance}`);
  //         } else {
  //           console.error("Invalid response format or no data available in admin wallet response.");
  //         }
  //       },
  //       error: function(error) {
  //         console.error(`Error fetching current admin wallet balance:`, error);
  //       }
  //     });
  
  //     // Calculate the new remaining balance by adding totalMoney (even if negative)
  //     let moneyall = currentWalletBalance + totalMoney;
  
  //     // Update the admin wallet with the new balance (optional)
  //     await $.ajax({
  //       url: `https://krinik.in/admin_wallet/${currentadminId}/`,
  //       type: 'PATCH',
  //       contentType: 'application/json',
  //       data: JSON.stringify({
  //         total_amount: moneyall
  //       }),
  //       success: function(response) {
  //         console.log(`Admin wallet updated with new balance: ${moneyall}`, response);
  //       },
  //       error: function(error) {
  //         console.error(`Error updating admin wallet balance:`, error);
  //       }
  //     });
  
  //   } catch (error) {
  //     console.error("Error during money allocation process:", error);
  //   }
  // };
  

  // const allocateMoneyToWinners = async (matchScores, totalMoney) => {
  //   try {
  //     // Group matches for winners only by pool, type, price, and multiX
  //     const MoneyPay = matchScores.reduce((acc, match) => {
  //       if (match.winning_status === "Winner") {
  //         const key = `${match.pool_name}-${match.pool_type}-${match.price}-winner`;
  
  //         if (!acc[key]) {
  //           acc[key] = [];
  //         }
  //         acc[key].push(match);
  //       }
  //       return acc;
  //     }, {});
  
  //     console.log(MoneyPay, "Grouped Money Pay for Winners Only by Pool, Type, Price, and MultiX");
  
  //     // Allocate money based on multiX and player matching
  //     const matchMoneydeclare = Object.keys(MoneyPay).map(poolKey => {
  //       const matchMoney = MoneyPay[poolKey];
  
  //       // Function to check if player arrays are identical
  //       const arePlayerDetailsIdentical = (players1, players2) => {
  //         const sorted1 = players1.map(p => p.player_id).sort();
  //         const sorted2 = players2.map(p => p.player_id).sort();
  //         return JSON.stringify(sorted1) === JSON.stringify(sorted2);
  //       };
  
  //       // Process each match in the pool group
  //       const allocationPromises = matchMoney.map(async (match, index) => {
  //         const matchPlayersDetails = match.players_details;
  
  //         // **Scenario 1: Each user gets the full ₹500 prize without splitting**
  //         let finalPrize = match.price * match.multiX; // No splitting in this case
  
  //         // **Scenario 2: Split prize among all identical player groups**
  //         let groups = [];
  //         for (let i = 0; i < matchMoney.length; i++) {
  //           const currentMatchPlayersDetails = matchMoney[i].players_details;
  //           if (arePlayerDetailsIdentical(matchPlayersDetails, currentMatchPlayersDetails)) {
  //             groups.push(matchMoney[i]);
  //           }
  //         }
  
  //         // Split prize based on number of identical groups (not by 2)
  //         if (groups.length > 1) {
  //           finalPrize = (match.price * match.multiX) / groups.length; // Split by the number of identical groups
  //         }
  
  //         // Deduct prize from totalMoney
  //         totalMoney -= finalPrize;
  
  //         // Allocate prize to each player
  //         for (let player of match.players_details) {
  //           const playerId = player.player_id;
  //           try {
  //             await $.ajax({
  //               url: `https://krinik.in/user_match_get/${match.matchId}`,
  //               type: 'PATCH',
  //               contentType: 'application/json',
  //               data: JSON.stringify({
  //                 player_id: playerId,
  //                 total_amount: finalPrize
  //               }),
  //               success: function(response) {
  //                 console.log(`Prize money ${finalPrize} allocated successfully for player ${playerId} in match ${match.matchId}`, response);
  //               },
  //               error: function(error) {
  //                 console.error(`Error allocating prize money for player ${playerId} in match ${match.matchId}:`, error);
  //               }
  //             });
  //           } catch (error) {
  //             console.error(`Failed to allocate prize money for player ${playerId} in match ${match.matchId}:`, error);
  //           }
  //         }
  //       });
  
  //       return Promise.all(allocationPromises);
  //     });
  
  //     // Wait for all prize allocations to complete
  //     await Promise.all(matchMoneydeclare);
  
  //     console.log(`Remaining total money after allocations: ${totalMoney}`);
  
  //     // Fetch the current balance in admin wallet
  //     let currentWalletBalance = 0;
  //     let currentadminId;
  //     await $.ajax({
  //       url: `https://krinik.in/admin_wallet/`,
  //       type: 'GET',
  //       success: function(response) {
  //         if (response.status === "success" && response.data && response.data.length > 0) {
  //           currentadminId = response.data[0].id;
  //           currentWalletBalance = response.data[0].total_amount; // Access total_amount from the first item in data array
  //           console.log(`Fetched current admin wallet balance: ${currentWalletBalance}`);
  //         } else {
  //           console.error("Invalid response format or no data available in admin wallet response.");
  //         }
  //       },
  //       error: function(error) {
  //         console.error(`Error fetching current admin wallet balance:`, error);
  //       }
  //     });
  
  //     // Calculate the new remaining balance by adding totalMoney (even if negative)
  //     let moneyall = currentWalletBalance + totalMoney;
  
  //     // Update the admin wallet with the new balance (optional)
  //     await $.ajax({
  //       url: `https://krinik.in/admin_wallet/${currentadminId}/`,
  //       type: 'PATCH',
  //       contentType: 'application/json',
  //       data: JSON.stringify({
  //         total_amount: moneyall
  //       }),
  //       success: function(response) {
  //         console.log(`Admin wallet updated with new balance: ${moneyall}`, response);
  //       },
  //       error: function(error) {
  //         console.error(`Error updating admin wallet balance:`, error);
  //       }
  //     });
  
  //   } catch (error) {
  //     console.error("Error during money allocation process:", error);
  //   }
  // };
 
  const allocateMoneyToWinners = async (matchScores, totalMoney) => {
    try {
      // Step 1: Group matches by pool, type, price, and multiX
      const MoneyPay = matchScores.reduce((acc, match) => {
        if (match.winning_status === "Winner") {
          const key = `${match.pool_name}-${match.pool_type}-${match.price}-winner`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(match);
        }
        return acc;
      }, {});
  
      console.log(MoneyPay, "Grouped Money Pay for Winners Only by Pool, Type, Price, and MultiX");
  
      // Step 2: Identify identical player groups
      const identicalPlayerGroups = Object.keys(MoneyPay).reduce((acc, poolKey) => {
        const matches = MoneyPay[poolKey];
  
        matches.forEach(match => {
          const matchPlayersDetails = match.players_details;
  
          // Step 3: Create a unique identifier for player details (e.g., sorted player IDs)
          const sortedPlayerIds = matchPlayersDetails
            .map(player => player.playerId)
            .sort()
            .join("-"); // Create a sorted string of player IDs to identify identical groups
  
          if (!acc[sortedPlayerIds]) {
            acc[sortedPlayerIds] = [];
          }
          acc[sortedPlayerIds].push(match);
        });
  
        return acc;
      }, {});
  
      console.log(identicalPlayerGroups, "Grouped Matches by Identical Players");
  
      // Step 4: Process each identical group
      const matchMoneyDeclare = Object.keys(identicalPlayerGroups).map(async (playerKey) => {
        const groupMatches = identicalPlayerGroups[playerKey];
        const finalPrizePerGroup = groupMatches[0].price * groupMatches[0].multiX;
  
        console.log(groupMatches, "Group Matches for Identical Players");
        console.log(finalPrizePerGroup, "Initial Prize");
  
        // Split prize among identical groups
        const prizePerMatch = finalPrizePerGroup / groupMatches.length;
  
        // Deduct the prize from the total money
        totalMoney -= prizePerMatch;
  
        // Allocate prize to each player in each match of the identical group
        for (const match of groupMatches) {
          for (const player of match.players_details) {
            const playerId = player.playerId;
  
            try {
              await $.ajax({
                url: `https://krinik.in/user_match_get/${match.matchId}`,
                type: "PATCH",
                contentType: "application/json",
                data: JSON.stringify({
                  player_id: playerId,
                  total_amount: prizePerMatch,
                }),
                success: (response) => {
                  console.log(`Prize money ${prizePerMatch} allocated successfully for player ${playerId} in match ${match.matchId}`, response);
                },
                error: (error) => {
                  console.error(`Error allocating prize money for player ${playerId} in match ${match.matchId}:`, error);
                },
              });
            } catch (error) {
              console.error(`Failed to allocate prize money for player ${playerId} in match ${match.matchId}:`, error);
            }
          }
        }
      });
  
      // Wait for all prize allocations to complete
      await Promise.all(matchMoneyDeclare);
  
      console.log(`Remaining total money after allocations: ${totalMoney}`);
  
      // Fetch the current balance in admin wallet
      let currentWalletBalance = 0;
      let currentAdminId;
      await $.ajax({
        url: `https://krinik.in/admin_wallet/`,
        type: "GET",
        success: (response) => {
          if (response.status === "success" && response.data?.length > 0) {
            currentAdminId = response.data[0].id;
            currentWalletBalance = response.data[0].total_amount;
            console.log(`Fetched current admin wallet balance: ${currentWalletBalance}`);
          } else {
            console.error("Invalid response format or no data available in admin wallet response.");
          }
        },
        error: (error) => {
          console.error("Error fetching current admin wallet balance:", error);
        },
      });
  
      // Calculate and update the new admin wallet balance
      const updatedWalletBalance = currentWalletBalance + totalMoney;
      await $.ajax({
        url: `https://krinik.in/admin_wallet/${currentAdminId}/`,
        type: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({
          total_amount: updatedWalletBalance,
        }),
        success: (response) => {
          console.log(`Admin wallet updated with new balance: ${updatedWalletBalance}`, response);
        },
        error: (error) => {
          console.error("Error updating admin wallet balance:", error);
        },
      });
    } catch (error) {
      console.error("Error during money allocation process:", error);
    }
  };
  
  
  

  const fetchUserMatchData = async () => {
    try {
      const response = await fetch(`https://krinik.in/user_match_get/`);
      if (!response.ok) {
        throw new Error("Failed to fetch match data");
      }
      return await response.json(); // Returns the user match data
    } catch (error) {
      console.error("Error fetching match data:", error);
      return null;
    }
  };
  // console.log(fetchUserMatchData(),"oklokl")
  
  
  const postData = async () => {
    // Step 1: Process player data
    const { dataToPost, userplayerdata } = processPlayerData(); // Get dataToPost and userplayerdata
  
    if (dataToPost.length > 0) {
    // Step 2: Post and update runs
    await postAndUpdateRuns(dataToPost); // Pass dataToPost to postAndUpdateRuns
  
    // Step 3: Fetch user match data from API
    try {
      const response = await fetch(`https://krinik.in/user_match_get/`); // Adjust API URL
      if (!response.ok) {
        throw new Error("Failed to fetch match data");
      }
  
      const userMatchData = await response.json(); // Assume it returns an array of matches
     
      let user_match_data1 = [];
      if (userMatchData && Array.isArray(userMatchData.data)) {
        user_match_data1 = userMatchData.data.filter((match) => match.match.id === NumberId);
      }
  
      // Step 5: Update match scores
      if (user_match_data1.length > 0) {
        
        await updatePlayerScores(user_match_data1, userplayerdata); 
        const matchScores = await updateMatchScores(user_match_data1, userplayerdata);
          console.log("Match scores updated in API:", matchScores);
  
          // Step 5.2: Call matchScoring to update global matchScores and perform additional processing
          if (matchScores) {
            const updatedMatchScores = await matchScoring(user_match_data1, userplayerdata);
            console.log("Match scores updated globally:", updatedMatchScores);
            if(updateMatchScores){
  
             const updatedWinner =  await updateMatchWinningStatus(updatedMatchScores); // Use updatedMatchScores from the previous step
              console.log("Winning status updated for all matches.");
  
              if(updatedWinner){
                await allocateMoneyToWinners(updatedMatchScores, totalMoney); // Pass the updated match scores and totalMoney to allocate
                console.log("Prize money allocated to winners successfully.");
                await sendNotification(null, {
                  title: "Result Declared!",
                  body: "The results are out! Check the app to see if you’re a winner!"
              });
              
              }
            }
          }
        } else {
          console.error("Invalid match data fetched from API");
        }
     
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    } else {
      console.error("No data to post");
    }
  };
  
  // const postData = async () => {
  //   // Step 1: Process player data
  //   const { dataToPost, userplayerdata } = processPlayerData(); // Get dataToPost and userplayerdata
  
  //   if (dataToPost.length > 0) {
  //     // Step 2: Post and update runs
  //     await postAndUpdateRuns(dataToPost); // Pass dataToPost to postAndUpdateRuns
  
  //     // Step 3: Fetch user match data from API
  //     try {
  //       const response = await fetch(`https://krinik.in/user_match_get/`); // Adjust API URL
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch match data");
  //       }
  
  //       const userMatchData = await response.json(); // Assume it returns an array of matches
  //       let user_match_data1 = [];
  //       if (userMatchData && Array.isArray(userMatchData.data)) {
  //         user_match_data1 = userMatchData.data.filter((match) => match.match.id === NumberId);
  //       }
  
  //       // Step 5: Update match scores
  //       if (user_match_data1.length > 0) {
          
  //         await updatePlayerScores(user_match_data1, userplayerdata); 
  //         const matchScores = await updateMatchScores(user_match_data1, userplayerdata);
  //         console.log("Match scores updated in API:", matchScores);
  
  //         // Step 5.2: Call matchScoring to update global matchScores and perform additional processing
  //         if (matchScores) {
  //           const updatedMatchScores = await matchScoring(user_match_data1, userplayerdata);
  //           console.log("Match scores updated globally:", updatedMatchScores);
  
  //           // Call user_match_get after matchScoring
  //           const userMatchDataAfterScoring = await fetchUserMatchData();
  //           if (!userMatchDataAfterScoring) {
  //             console.error("Error fetching match data after scoring");
  //             return;
  //           }
  
  //           // Step 6: Update match winning status
  //           const updatedWinner = await updateMatchWinningStatus(updatedMatchScores); // Use updatedMatchScores from the previous step
  //           console.log("Winning status updated for all matches.");
  
  //           // Call user_match_get before updateMatchWinningStatus
  //           const userMatchDataBeforeWinnerUpdate = await fetchUserMatchData();
  //           if (!userMatchDataBeforeWinnerUpdate) {
  //             console.error("Error fetching match data before updating winning status");
  //             return;
  //           }
  
  //           // Step 7: Allocate money to winners based on updated match scores
  //           await allocateMoneyToWinners(updatedWinner, totalMoney); // Pass the updated match scores and totalMoney to allocate
  //           console.log("Prize money allocated to winners successfully.");
  
  //           // Call user_match_get again before allocating money to winners
  //           // const userMatchDataAfterWinnerUpdate = await fetchUserMatchData();
  //           // if (!userMatchDataAfterWinnerUpdate) {
  //           //   console.error("Error fetching match data after updating winning status");
  //           //   return;
  //           // }
  //         }
  //       } else {
  //         console.error("Invalid match data fetched from API");
  //       }
     
  //     } catch (error) {
  //       console.error("Error fetching match data:", error);
  //     }
  //   } else {
  //     console.error("No data to post");
  //   }
  // };
  
  // fetchData(NumberId);
  // Set up the click event handler for the submit button
  
  
  // const postData = async () => {
  //   // Step 1: Process player data
  //   const { dataToPost, userplayerdata } = processPlayerData();
  //   if (!dataToPost.length) {
  //     console.error("No data to post");
  //     return;
  //   }
  
  //   // Step 2: Post and update runs
  //   await postAndUpdateRuns(dataToPost);
  
  //   // Step 3: Fetch user match data
  //   const userMatchData = await fetchUserMatchData();
  //   if (!userMatchData) {
  //     console.error("Failed to fetch user match data");
  //     return;
  //   }
  
  //   // Filter matches by specific condition (e.g., match ID)
  //   const user_match_data1 = userMatchData.filter((match) => match.match.id === NumberId);
  //   if (!user_match_data1.length) {
  //     console.error("Invalid match data fetched from API");
  //     return;
  //   }
  
  //   // Step 4: Update match scores
  //   await updatePlayerScores(user_match_data1, userplayerdata);
  //   const matchScores = await updateMatchScores(user_match_data1, userplayerdata);
  //   if (!matchScores) {
  //     console.error("Failed to update match scores");
  //     return;
  //   }
  
  //   console.log("Match scores updated:", matchScores);
  
  //   // Step 5: Update match winning status
  //   const updatedMatchScores = await updateMatchWinningStatus(matchScores);
  //   if (!updatedMatchScores) {
  //     console.error("Failed to update match winning status");
  //     return;
  //   }
  
  //   console.log("Winning status updated successfully");
  
  //   // Step 6: Allocate money to winners
  //   await allocateMoneyToWinners(updatedMatchScores, totalMoney);
  //   console.log("Prize money allocated to winners successfully");
  // };
  window.onload = checkAdminAccess();
  $(document).ready(function() {
    $("#submitButton").on("click", function() {
      // postRunData(); // Call the function to post data
      postData()
    });
  });
  
  