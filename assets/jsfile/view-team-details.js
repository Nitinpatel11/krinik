document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Get the team name from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const teamName = urlParams.get("teamName");

    // Fetch team data
    const teamResponse = await fetch(
      `https://krinik.pythonanywhere.com/team_get/`
    );
    const teamResponse1 = await fetch(
      `https://krinik.pythonanywhere.com/league_get/`
    );
    const teamResponse2 = await fetch(
      `https://krinik.pythonanywhere.com/player_get/`
    );

    const teamData = (await teamResponse.json()).data;
    const leagueData = (await teamResponse1.json()).data;
    const playerData = (await teamResponse2.json()).data;

    // Find the team data with matching team name
    const specificTeam = teamData.find((team) => team.team_name === teamName);
    console.log(specificTeam);
    // Filter players based on the team and league
    const filteredPlayers = playerData.filter((player) => {
      return (
        player.team_name === specificTeam.team_name &&  player.league_name == specificTeam.league_name
      );
    });
    console.log(filteredPlayers);
    // Find the league data with the matching team name

    if (filteredPlayers) {
      const leagueName = specificTeam.team_name;

      const teamImagePreview = document.getElementById("leagueImagePreview");
      const teamNameHeading = document.getElementById("leagueNameHeading");
      const startTeamDateInput = document.getElementById("startLeagueDate");
      const endTeamDateInput = document.getElementById("endLeagueDate");

      teamNameHeading.textContent = specificTeam.team_name;

      // Display team image
      if (specificTeam.team_image) {
        teamImagePreview.src =
          "https://krinik.pythonanywhere.com" + specificTeam.team_image;
      } else {
        teamImagePreview.src = ""; // Clear image source if no image available
      }

      startTeamDateInput.value = moment(
        specificTeam.team_date,
        "YYYY-MM-DD"
      ).format("DD-MM-YYYY");

      // Get reference to the tbody where players will be appended
      const playerListBody = document.getElementById("playerList");

      // Clear existing content
      playerListBody.innerHTML = "";

      // Iterate over filtered players and create rows in the table
      filteredPlayers.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                              <td>${index + 1}</td>
                              <td colspan"3"">${player.player_name}</td>
                          `;
        playerListBody.appendChild(row);
      });
    } else {
      console.error("Team details not found for team name:", teamName);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
