
document.addEventListener('DOMContentLoaded', function () {
    // Get the league name from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const leagueName = urlParams.get('leagueName');

    // Get reference to the table body
    const teamTableBody = document.getElementById('teamTableBody');

    // Fetch team data from the API
    fetch('https://krinik.in/team_get/')
        .then(response => response.json())
        .then(data => {
            const teamData = data.data;

            // Filter the team data based on the league name
            const filteredTeams = teamData.filter(team => team.league_name === leagueName);

            // Update table with filtered team data
            teamTableBody.innerHTML = ''; // Clear existing rows

            if (filteredTeams.length === 0) {
                $("#noDataFound").show();
                $("#pagination").hide();
                $("#table-scrolling").css("overflow-x", "hidden"); // Add this line
                return;
              } else {
                $("#noDataFound").hide();
                $("#pagination").show();
                $("#table-scrolling").css("overflow-x", "auto"); // Add this line
              }
            filteredTeams.forEach((team, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td colspan="3">${team.team_name}</td>
                   
                
                    <!-- Add more cells as needed -->
                `;
                teamTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching team data:', error);
            // Handle error, such as displaying a message to the user
        });
});

document.addEventListener('DOMContentLoaded', function () {
// Get the league name from the URL
const urlParams = new URLSearchParams(window.location.search);
const leagueName = urlParams.get('leagueName');

// Get references to HTML elements
const leagueNameHeading = document.getElementById('leagueNameHeading');
const startLeagueDateInput = document.getElementById('startLeagueDate');
const endLeagueDateInput = document.getElementById('endLeagueDate');
const leagueImagePreview = document.getElementById('leagueImagePreview');

// Fetch league details based on league name
fetch('https://krinik.in/league_get/')
.then(response => response.json())
.then(data => {
const leagueData = data.data;

// Find the league data with matching league name
const filteredLeague = leagueData.find(league => league.league_name === leagueName);

if (filteredLeague) {
// Update HTML elements with league details
leagueNameHeading.textContent = filteredLeague.league_name;
startLeagueDateInput.value = filteredLeague.start_league_date;
endLeagueDateInput.value = filteredLeague.end_league_date;

// Display league image
if (filteredLeague.league_image) {
    leagueImagePreview.src = 'https://krinik.in' + filteredLeague.league_image;
} else {
    leagueImagePreview.src = ''; // Clear image source if no image available
}
} else {
console.error('League details not found for league name:', leagueName);
}
})
.catch(error => {
console.error('Error fetching league data:', error);
// Handle error, such as displaying a message to the user
});
});

