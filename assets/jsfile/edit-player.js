
// Regular expression to validate input (no numbers or whitespace)
const noNumberOrWhitespaceRegex = /^(?!.*[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}])^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/u;
const alphanumericRegex = /^[a-zA-Z0-9._]+(?: [a-zA-Z0-9._]+)*$/u;
;

// Default image source
const defaultImageSrc = '/assets/images/default_player.png';

// Array to store existing players fetched from API
let existingPlayers = [];

// Variable to store initial data
let initialData = {};

// Function to fetch leagues from API
async function fetchLeagues() {
  try {
    const response = await fetch('https://krinik.pythonanywhere.com/league_get/');
    if (!response.ok) {
      throw new Error('Failed to fetch leagues');
    }
    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      populateSelect1(data.data);
      document.getElementById('league-name').addEventListener('change', function () {
        const leagueName = this.value;
        fetchTeams(leagueName);
      });
    } else {
      console.error('Invalid data format for leagues:', data);
    }
  } catch (error) {
    console.error('Error fetching leagues:', error);
  }
}

async function fetchExistingPlayers() {
  try {
    const response = await fetch("https://krinik.pythonanywhere.com/player_get/");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const existingPlayers1 = await response.json();
    existingPlayers = existingPlayers1.data;
    // populateSelect(existingPlayers); 
    console.log(existingPlayers)// Populate league dropdown
  } catch (error) {
    console.error('Error fetching or processing existing leagues:', error);
  }
}

// Function to fetch teams based on the selected league
async function fetchTeams(leagueName) {
  try {
    const response = await fetch('https://krinik.pythonanywhere.com/team_get/');
    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }
    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      const teams = data.data.filter(team => team.league_name === leagueName);
      populateSelect(document.getElementById('team-name'), teams, 'team_name', 'Select Team');
    } else {
      console.error('Invalid data format for teams:', data);
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
  }
}

// Function to populate select dropdown with fetched data
function populateSelect(selectElement, data, key, defaultOptionText) {
  selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`;
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item[key];
    option.textContent = item[key];
    selectElement.appendChild(option);
  });
}

function populateSelect1(data) {
  const selectElement = document.getElementById('league-name');
  selectElement.innerHTML = '<option value="">Select League</option>';

  const currentDate = moment().toDate(); // Get the current date as a Date object
  console.log("Current Date: ", currentDate);

  data.forEach(league => {
      const leagueEndDate = moment(league.end_league_date, 'DD-MM-YYYY').toDate(); // Convert end_league_date to a Date object
      console.log("League End Date: ", leagueEndDate);

      // Compare Date objects directly
      if (currentDate < leagueEndDate) {
          const option = document.createElement('option');
          option.value = league.league_name;
          option.textContent = league.league_name;
          selectElement.appendChild(option);
      }
  });
}

// Function to validate input fields
function validateInput(inputId, errorId, validationFunction, emptyMessage, invalidMessage) {
const inputElement = document.getElementById(inputId);
const errorElement = document.getElementById(errorId);

function validate() {
    const value = inputElement.value.trim();
    if (value === '') {
        errorElement.innerHTML = emptyMessage;
        errorElement.style.display = 'inline';
        return false;
    } else if (!validationFunction(value)) {
        errorElement.innerHTML = invalidMessage;
        errorElement.style.display = 'inline';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

inputElement.addEventListener('input', validate);
inputElement.addEventListener('change', validate);

return validate();
}
function validateLeagueSelection() {
  const leagueSelect = document.getElementById('league-name');
  const errorSpan = document.getElementById('error-league-name');

  if (!leagueSelect || !errorSpan) {
    console.error('League selection elements not found');
    return false;
  }

  function validate() {
    if (leagueSelect.value === '') {
      errorSpan.innerHTML = 'Please select a league';
      errorSpan.style.display = 'inline';
      return false;
    } else {
      errorSpan.style.display = 'none';
      return true;
    }
  }

  leagueSelect.addEventListener('change', validate);
  return validate();
}

function validateTeamSelection() {
  const teamSelect = document.getElementById('team-name');
  const errorSpan = document.getElementById('error-team-name');

  if (!teamSelect || !errorSpan) {
    console.error('Team selection elements not found');
    return false;
  }

  function validate() {
    if (teamSelect.value === '') {
      errorSpan.innerHTML = 'Please select a team';
      errorSpan.style.display = 'inline';
      return false;
    } else {
      errorSpan.style.display = 'none';
      return true;
    }
  }

  teamSelect.addEventListener('change', validate);
  return validate();
}

async function fetchPlayerData() {
  try {
    const id = urlParams.get('id');
    if (!id) {
      console.warn('No player ID found in URL.');
      return;
    }

    const url = `https://krinik.pythonanywhere.com/player_get/${id}/`;
    console.log('Fetching player data from:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch player data');
    }

    const playerData1 = await response.json();
    const playerData = playerData1.data;
    console.log(playerData);
    editPlayerData(playerData);
    // initialData = playerData; // Store initial data
  } catch (error) {
    console.error('Error fetching player data:', error);
  }
}


async function submitFormData(data, method) {
  const formData = new FormData();
  formData.append('league_name', data.league_name);
  if (data.player_image instanceof File) {
    formData.append('player_image', data.player_image);
  }
  formData.append('player_name', data.player_name);
  formData.append('player_short_name', data.player_short_name);
  formData.append('team_name', data.team_name);
  formData.append('total_run', 25);
  formData.append('status', "enable"); // Append total_run

  console.log('Form data before sending:');
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  try {
    const response = await fetch(`https://krinik.pythonanywhere.com/player_get/${id}/`, {
      method: method,
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to edit player: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);
    window.location.href = 'manage-player.html';

  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while editing the player.');
  }
}


function toCapitalizeCase(str) {
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

document.getElementById('player-name').addEventListener('input', function (event) {
  this.value = toCapitalizeCase(this.value);
});
// Event listener to convert short team name to uppercase
document.getElementById('short-player-name').addEventListener('input', function (event) {
  this.value = this.value.toUpperCase();
});

// Event listener for file input to preview image
document.getElementById('file-input').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const previewImage = document.getElementById('preview-player-image');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function isValidTeamName1(value) {
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}]/u;
  const alphanumericRegex = /^[a-zA-Z0-9._]+(?: [a-zA-Z0-9._]+)*$/u;
  
  // Check for emoji
  if (emojiRegex.test(value)) {
      return false; // Invalid if emoji found
  }
  
  // Check for alphanumeric, ., _ and spaces
  if (!alphanumericRegex.test(value)) {
      return false; // Invalid if non-alphanumeric characters found
  }
  
  // Check for purely numeric input
  if (/^\d+$/.test(value)) {
      return false; // Invalid if input is purely numeric
  }
  
  return true; // Valid input
}


// Function to check if there is overlap in player names or short names within the same league and team
async function checkPlayerOverlap(playerName, shortPlayerName, leagueName, teamName, existingPlayers) {
  console.log("Checking overlap for:", playerName, shortPlayerName, leagueName, teamName);
  console.log("Existing players:", existingPlayers);

  if (!existingPlayers || existingPlayers.length === 0) {
    return { playerNameOverlap: false, shortPlayerNameOverlap: false };
  }

  const normalizedPlayerName = playerName.trim().toLowerCase();
  const normalizedShortName = shortPlayerName.trim().toLowerCase();

  const playerNameOverlap = existingPlayers.some(player => {
    const normalizedExistingPlayerName = (player.player_name || '').trim().toLowerCase();
    const normalizedExistingLeagueName = (player.league_name || '').trim().toLowerCase();
    const normalizedExistingTeamName = (player.team_name.team_name || '').trim().toLowerCase();
    return normalizedExistingPlayerName === normalizedPlayerName &&
      normalizedExistingLeagueName === leagueName.trim().toLowerCase() &&
      normalizedExistingTeamName === teamName.trim().toLowerCase();
  });

  const shortPlayerNameOverlap = existingPlayers.some(player => {
    const normalizedExistingShortName = (player.player_short_name || '').trim().toLowerCase();
    const normalizedExistingLeagueName = (player.league_name || '').trim().toLowerCase();
    const normalizedExistingTeamName = (player.team_name.team_name || '').trim().toLowerCase();
    return normalizedExistingShortName === normalizedShortName &&
      normalizedExistingLeagueName === leagueName.trim().toLowerCase() &&
      normalizedExistingTeamName === teamName.trim().toLowerCase();
  });

  console.log("Player Name Overlap:", playerNameOverlap);
  console.log("Short Player Name Overlap:", shortPlayerNameOverlap);

  return { playerNameOverlap, shortPlayerNameOverlap };
}

// Function to fetch player data if ID is provided in URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');


// Function to populate form fields with player data for editing
function editPlayerData(response) {
  const leagueName = document.getElementById('league-name');
  const teamName = document.getElementById('team-name');
  const playerName = document.getElementById('player-name');
  const shortPlayerName = document.getElementById('short-player-name');
  const imageFile = document.getElementById('preview-player-image');

  if (response) {
    // Update image source
    imageFile.src = `https://krinik.pythonanywhere.com${response.player_image}`;

    // Set form field values
    leagueName.value = response.league_name;
    teamName.value = response.team_name.team_name;
    playerName.value = response.player_name;
    shortPlayerName.value = response.player_short_name;

    // Fetch teams for the selected league and set team name after fetching
    fetchTeams(response.league_name).then(() => {
      teamName.value = response.team_name.team_name;
    });

    const initialData = {
      league_name: leagueName.value,
      team_name: teamName.value,
      player_name: playerName.value,
      player_short_name: shortPlayerName.value,
      player_image: response.player_image // Set initialData.player_image to the response.player_image
    };
  } else {
    console.error("Data is not in the expected format:", response);
  }
}

// Event listener when DOM is fully loaded
document.addEventListener('DOMContentLoaded', async function () {
  try {
    await fetchLeagues();
    await fetchPlayerData();
    await fetchExistingPlayers()

    const form = document.getElementById('player-form');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const leagueName = document.getElementById('league-name').value;
      const teamName = document.getElementById('team-name').value;
      const playerName = document.getElementById('player-name').value;
      const shortPlayerName = document.getElementById('short-player-name').value;
      const imageFileInput = document.getElementById('file-input');
      const previewImage = document.getElementById('preview-player-image');


      const isValidLeagueName = validateLeagueSelection();
      const isValidTeamName = validateTeamSelection();
      const isValidPlayerName = validateInput(
        'player-name', 
        'error-player-name',
        isValidTeamName1,
        'Please enter a player name',
        'Please enter a valid player name'
      );

      const isValidShortPlayerName = validateInput(
        'short-player-name',
        'error-short-player-name',
        isValidTeamName1,
        'Please enter a short player name',
        'Please enter a valid short player name'
      );
      const currentData = {
        league_name: leagueName,
        team_name: teamName,
        player_name: playerName,
        player_short_name: shortPlayerName,
        player_image: previewImage.src // Define player_image here
      };
      try {
        const overlapResult = await checkPlayerOverlap(playerName, shortPlayerName, leagueName, teamName, existingPlayers);

        if (isValidLeagueName && isValidTeamName && isValidPlayerName && isValidShortPlayerName) {
          const hasLeagueChanged = currentData.leagueName !== initialData.league_name;
          const hasTeamChanged = currentData.teamName !== initialData.team_name;
          const hasPlayerChanged = currentData.playerName !== initialData.player_name;
          const hasShortPlayerChanged = currentData.shortPlayerName !== initialData.player_short_name;
          const hasImageChanged = currentData.player_image !== initialData.player_image;

          if (hasLeagueChanged || hasTeamChanged || hasPlayerChanged || hasShortPlayerChanged || hasImageChanged) {

            const imageFile = imageFileInput.files[0];
            if (imageFile) {
              currentData.player_image = imageFile;
            }

            console.log(currentData)

            if (hasImageChanged) {
              if (confirm("are you confirm to edit it?")) {

                await submitFormData(currentData, 'PATCH');
              }
            }
            else if (overlapResult.playerNameOverlap && overlapResult.shortPlayerNameOverlap) {
              document.getElementById('error-player-name').innerHTML = 'Player with same name already exists in this team.';
              document.getElementById('error-player-name').style.display = 'inline';
              document.getElementById('error-short-player-name').innerHTML = 'Player with short name already exists in this team.';
              document.getElementById('error-short-player-name').style.display = 'inline';
            } else if (overlapResult.playerNameOverlap) {
              document.getElementById('error-player-name').innerHTML = 'Player with same name already exists in this team.';
              document.getElementById('error-player-name').style.display = 'inline';
            } else if (overlapResult.shortPlayerNameOverlap) {
              document.getElementById('error-short-player-name').innerHTML = 'Player with short name already exists in this team.';
              document.getElementById('error-short-player-name').style.display = 'inline';
            } else {
              await submitFormData(currentData, 'PATCH');
            }
          } else {
            await submitFormData(initialData, 'PATCH');
          }
        }

      } catch (error) {
        console.error('Error during form submission:', error);
      }
    });


  } catch (error) {
    console.error('Error during DOMContentLoaded event:', error);
  }
});
