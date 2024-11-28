import {checkAdminAccess}  from "../js/initial.js"

   var rankList = [];
  var array = [];
  var array_length = 0;
  var table_size = 10;
  var start_index = 1;
  var end_index = 0;
  var current_index = 1;
  var max_index = 0;// Define end_index or calculate based on data length
let userId
const urlParams = new URLSearchParams(window.location.search);
let id = Number(urlParams.get('id'));
let userMatchDataFiltered

const totalpoolData = document.getElementById("total-league-data") 


async function fetchUserData() {
  try {
    if (!id) {
      console.warn('No player ID found in URL.');
      return;
    }

    // Fetch player data
    const playerUrl = `https://krinik.in/add_pool_get/${id}/`;
    console.log('Fetching player data from:', playerUrl);

    const response = await fetch(playerUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch player data');
    }

    const userData1 = await response.json();
    const userData = userData1.data;
    const userId = userData.id;
    const matchId = userData.select_match.match_id;

    console.log(matchId, "matchId");

    const poolName = userData.pool_name;
    const poolType = userData.pool_type;
    console.log(poolType, "poolType");

    // Fetch pool data
    const poolUrl = `https://krinik.in/user_match_get/`;
    console.log('Fetching pool data from:', poolUrl);

    const poolResponse = await fetch(poolUrl);
    if (!poolResponse.ok) {
      throw new Error('Failed to fetch pool data');
    }

    const userMatchData1 = await poolResponse.json();
    const userMatchData = userMatchData1.data;

    // Check poolType and poolName
    if (poolType && poolName) {
      editPlayerData(poolType, poolName);
    }

    // Filter by match ID and status
   userMatchDataFiltered = userMatchData.filter(
      (p) => p.match.id === matchId && p.user_data.status === "block"
    );

    console.log(userMatchDataFiltered, "Filtered Data");

    // Count money
    if (userMatchDataFiltered.length) {
      const totalMoney = userMatchDataFiltered.reduce(
        (total, curr) => {
          // Check if poolType and poolName match
          if (curr.pool_type === poolType && curr.pool_name === poolName) {
            return total + curr.invest_amount;
          }
          return total;
        },
        0
      );
    
      totalpoolData.textContent = totalMoney;
      console.log(totalMoney, "Total Money");
      fetchData(userMatchDataFiltered,poolType,poolName);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function editPlayerData(poolType, poolName) {
  const contestName = document.getElementById("contestName");
  if (poolType || poolName) {
    contestName.textContent = `${poolName} - ${poolType}`;
  } else {
    console.error("Invalid pool data:", poolType, poolName);
  }
}

// function fetchData(filteredData) {
//   try {
//     const result = filteredData.reduce((acc, item) => {
//       const userId = item.user_data.user_id;
//       if (!acc[userId]) {
//         acc[userId] = {
//           user: item.user_data,
//           totalAmount: 0
//         };
//       }
//       acc[userId].totalAmount += item.invest_amount;
//       return acc;
//     }, {});

//     console.log(result, "Aggregated Result");

//     const array = Object.values(result);
//     console.log(array, "Array");

//     if (array.length) {
//       filterAndDisplay(array);
//     } else {
//       console.log('No data to display');
//     }
//   } catch (error) {
//     console.error("Error processing data", error);
//   }
// }



function fetchData(filteredData, poolType, poolName) {
  // console.log(typeof poolName,"poo")
  try {
    const result = filteredData.reduce((acc, item) => {
      const userId = item.user_data.user_id;

      // Check if poolType and poolName match
      if (item.pool_type === poolType && item.pool_name === poolName) {
        if (!acc[userId]) {
          acc[userId] = {
            user: item.user_data,
            totalAmount: 0
          };
        }
        acc[userId].totalAmount += item.invest_amount;
      }

      return acc;
    }, {});

    console.log(result, "Filtered and Aggregated Result");

   array = Object.values(result);
    console.log(array, "Array");

    if (array.length) {
      filterAndDisplay(array); // Update your display logic here
    } else {
      console.log('No data matching poolType and poolName.');
    }
  } catch (error) {
    console.error("Error processing data", error);
  }
}



fetchUserData();



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

window.indexPagination = indexPagination
window.next = next
window.prev = prev


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
      // var status = getStatus(showdata["start_league_date"], showdata["end_league_date"]);
// console.log(showdata,"showdata")
// console.log(showdata["player_pair"].length,"prj")
      var tr = $("<tr></tr>");

      var noCell = $("<td></td>").text(i + 1);
      var userNameCell = $("<td colspan='3'></td>").text(showdata.user.name || "");
      var amountCell = $("<td colspan='3'> </td>").text(showdata.totalAmount || 0);
      
      // const noCell = $("<td></td>").text(i + 1);
      // const userNameCell = $("<td ></td>").text(showdata.user.name || "");
      // const totalAmountCell = $("<td > </td>").text(showdata.totalAmount || 0);
      // const poolCountCell = $("<td ></td>").text(showdata.poolCount || 0);

      // var logoCell = $("<td></td>").html(
      //   showdata["league_image"]
      //     ? `<img src="https://krinik.in${showdata["league_image"]}" alt="" class="team-logo lazyload" />`
      //     : ""
      // );
      // var pairCell = $("<td colspan='2'></td>").text(showdata.pool_name["pool_name"].length || "");
      // var totalPoolCell = $("<td colspan='2'> </td>").text(showdata["player_pair"].length || "");



      // var dateCell = $("<td colspan='2'></td>").text(
      //   (showdata["start_league_date"] || "") +
      //   " - " +
      //   (showdata["end_league_date"] || "")
      // );
      // var statusCell = $("<td colspan='2'></td>").text(status);
      // var viewCell = $("<td></td>").html(
      //   // '<span class="sortable" onclick="window.location.href=\'view-league-details.html\'"><i class="far fa-eye"></i></span>'
      //     '<span class="sortable" onclick="viewLeagueDetails(\'' + showdata["league_name"] + '\')"><i class="far fa-eye"></i></span>'
      // );
      // var editCell = $("<td></td>").html(
      //   '<span class="sortable" onclick="handleEdit(' + showdata["id"] + ')"><i class="far fa-edit"></i></span>'
      // );
      // var deleteCell = $("<td></td>").html(
      //   '<span class="sortable" onclick="handleDelete(' + showdata["id"] + ')"><i class="fa-solid fa-ban"></i></span>'
      // );

      tr.append(noCell)
        .append(userNameCell)
        .append(amountCell)
       

    //     if (showdata.refund === true) {
    //   noCell.addClass("disabled-row");
    //   userNameCell.addClass("disabled-row");
    //   amountCell.addClass("disabled-row");
    //   pairCell.addClass("disabled-row");
    //   totalPoolCell.addClass("disabled-row");
    //   deleteCell.addClass("disabled-row");

      
    // }

//     async function handleDelete(id) {
  
//   if (confirm('Are you sure you want to delete this league?')) {
//     const url = `https://krinik.in/league_get/${id}/`;
//     try {
//       const response = await fetch(url, { method: "PATCH" });

//       if (response.ok) {
//         await fetchUserData();
//       } else {
//         console.error("Failed to delete the league");
//       }
//     } catch (error) {
//       console.error("Error deleting data:", error);
//     }
//   }
// }

    

      $("table tbody").append(tr);
    }
  }



//   function redirectToHistoryPage(page) {
//   const urlParams = new URLSearchParams(window.location.search);
//   const name = urlParams.get('name');
  
//   if (id) {
//     window.location.href = `${page}.html?id=${id}`;
//   } else {
//     console.error('No player ID found in URL.');
//   }
// }

// document.getElementById("contestResult").addEventListener("click", () => redirectToHistoryPage('contest-result'));

const table = document.getElementById('contestTable');
const downloadBtn = document.getElementById('download-btn');

// downloadBtn.addEventListener('click', () => {
// const workbook = XLSX.utils.table_to_book(table, { sheet: 'Contest Data' });
// const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
// const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
// const url = URL.createObjectURL(data);
// const a = document.createElement('a');
// a.href = url;
// a.download = 'contest_data.xlsx';
// a.click();

// URL.revokeObjectURL(url);
// a.remove();
// });
window.onload = checkAdminAccess();