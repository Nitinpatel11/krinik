
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Get the team name from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Fetch data
    const viewPlayer = await fetch(`https://krinik.in/view_player/${id}/`);
    console.log(viewPlayer)


    const playerResponse = await fetch(`https://krinik.in/player_get/${id}/`);
 
console.log(playerResponse)
    const viewPlayerDetails1 = await viewPlayer.json();
    const viewPlayerDetails = viewPlayerDetails1[0]
    const playerTotalRun = viewPlayerDetails1[1]

    console.log(viewPlayerDetails)

    const playerData = (await playerResponse.json()).data;
    console.log(playerData)


    const teamImagePreview = document.getElementById('leagueImagePreview');
    const teamNameHeading = document.getElementById('leagueNameHeading');
    const startLeagueDate = document.getElementById('startLeagueDate');

 
    teamNameHeading.textContent = playerData.player_name;
    startLeagueDate.value = playerTotalRun.total_runs;


    // Display team image
    if (playerData.player_image) {
      teamImagePreview.src = 'https://krinik.in' + playerData.player_image;
    } else {
      teamImagePreview.src = ''; // Clear image source if no image available
    }

 
    const playerListBody = document.getElementById('playerList');

    // Clear existing content
    playerListBody.innerHTML = '';

    // Iterate over filtered players and create rows in the table
    viewPlayerDetails.forEach((player, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                                      <td>${index + 1}</td>
                                      <td colspan="3">${player.player_league}</td>
                                      <td colspan="3">${player.player_team}</td>
                                       <td colspan="3">${player.opponent_team}</td>
                                      <td colspan="3">${player.runs}</td>
                                      <td colspan="3">${player.match_date}</td>`;
                                      
                                      
      playerListBody.appendChild(row);
    });
    // } else {
    //   console.error('Team details not found for team name:', teamName);
    // }
  } catch (error) {
    console.error('Error fetching data:', error);
  }


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
});

