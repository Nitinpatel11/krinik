
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Get the team name from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('playerName');

    // Fetch data
    const teamResponse = await fetch('https://krinik.pythonanywhere.com/team_get/');
    const playerResponse = await fetch('https://krinik.pythonanywhere.com/player_get/');
    const leagueResponse = await fetch('https://krinik.pythonanywhere.com/league_get/');
    const matchResponse = await fetch('https://krinik.pythonanywhere.com/match_get/');

    const playerData = (await playerResponse.json()).data;
    const matchData = (await matchResponse.json()).data;
    const leagueData = (await leagueResponse.json()).data;
    const teamData = (await teamResponse.json()).data;
    console.log(matchData,"match")
    let filteredMatches
    // Find the specific player data
    const specificPlayer = playerData.find(player => player.player_name === playerName);

    if (specificPlayer) { 

         filteredMatches = matchData.filter(match => {
          return match.player_name === specificPlayer.player_name && teamData.some(team => team.team_name === match.team_name) &&
            leagueData.some(league => league.league_name === match.league_name);
        });

        console.log(filteredMatches,"opl");
      } else {
        console.log('Team not found for the player.');
      }


    const teamImagePreview = document.getElementById('leagueImagePreview');
    const teamNameHeading = document.getElementById('leagueNameHeading');
    // const startTeamDateInput = document.getElementById('startLeagueDate');
    // const endTeamDateInput = document.getElementById('endLeagueDate');

    teamNameHeading.textContent = specificPlayer.player_name;

    // Display team image
    if (specificPlayer.player_image) {
      teamImagePreview.src = 'https://krinik.pythonanywhere.com' + specificPlayer.player_image;
    } else {
      teamImagePreview.src = ''; // Clear image source if no image available
    }

 
    const playerListBody = document.getElementById('playerList');

    // Clear existing content
    playerListBody.innerHTML = '';

    // Iterate over filtered players and create rows in the table
    filteredMatches.forEach((player, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                                      <td>${index + 1}</td>
                                      <td colspan"3"">${player.select_league.league_name}</td>
                                  `;
      playerListBody.appendChild(row);
    });
    // } else {
    //   console.error('Team details not found for team name:', teamName);
    // }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

