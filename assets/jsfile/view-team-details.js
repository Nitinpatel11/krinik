document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Get the team name from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const teamName = Number(urlParams.get("teamName"));

    // Fetch team data
    const teamResponse = await fetch(
      `https://krinik.in/team_get/`
    );
    // const teamResponse1 = await fetch(
    //   `https://krinik.in/league_get/`
    // );
    const teamResponse2 = await fetch(
      `https://krinik.in/player_get/`
    );

    // const [data, data1, user_match,admin_wallet] = await Promise.all([
    //   $.ajax({ url: `https://krinik.in/match_get/`, method: "GET" }),
    //   $.ajax({ url: `https://krinik.in/player_get/`, method: "GET" }),
     
    // ]);

    const teamData = (await teamResponse.json()).data;
    // const leagueData = (await teamResponse1.json()).data;
    const playerData = (await teamResponse2.json()).data;
    console.log(playerData,"playDta")
    
    // Find the team data with matching team name
    const specificTeam = teamData.find((team) => team.id === teamName);
    console.log(specificTeam);
    // Filter players based on the team and league
    const filteredPlayers = playerData.filter((player) => {
      return (
        player.team_name.id === specificTeam.id 
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
          "https://krinik.in" + specificTeam.team_image;
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

      if (filteredPlayers.length === 0) {
        $("#noDataFound").show();
        $("#pagination").hide();
        $("#table-scrolling").css("overflow-x", "hidden"); // Add this line
        return;
      } else {
        $("#noDataFound").hide();
        $("#pagination").show();
        $("#table-scrolling").css("overflow-x", "auto"); // Add this line
      }

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
