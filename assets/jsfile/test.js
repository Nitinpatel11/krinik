

// Global Variables
let leagueSelect = document.getElementById('league-name'); 
let errorSpanLeague = document.getElementById('error-league-name');

let teamSelectA = document.getElementById('team-A');
let teamSelectB = document.getElementById('team-B');
let errorSpanA = document.getElementById('error-team-A');
let errorSpanB = document.getElementById('error-team-B');

let errorSpanPlayersA = document.getElementById('error-players-A');
let errorSpanPlayersB = document.getElementById('error-players-B');

let startDate = document.getElementById('match-start-date');
let endDate = document.getElementById('match-end-date');
let errorSpanStart = document.getElementById('error-match-start-date');
let errorSpanEnd = document.getElementById('error-match-end-date');



let initialData = {};
let allPlayers = { 'dropdown-players-A': [], 'dropdown-players-B': [] };
let teams = [];

// Generic fetch function
async function fetchData(url, errorMessage) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(errorMessage);
    const data = await response.json();
    if (data.status === 'success') return data.data;
    throw new Error('Invalid data format');
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}

// Fetch and update teams based on selected league
async function fetchTeams(leagueName) {
  const data = await fetchData(`https://krinik.pythonanywhere.com/team_get/?league_name=${leagueName}`, 'Failed to fetch teams');
  if (data) {
    teams = data.filter(team => team.league_name === leagueName);
    updateTeamSelects();
  }
}

// Fetch leagues and populate dropdown
async function fetchLeagues() {
  const leagues = await fetchData('https://krinik.pythonanywhere.com/league_get/', 'Failed to fetch leagues');
  if (leagues) {
    populateSelect(document.getElementById('league-name'), leagues, 'league_name', 'Select League');
  }
}

// Fetch match data by ID
async function fetchMatchById(matchId) {
  return await fetchData(`https://krinik.pythonanywhere.com/match_get/${matchId}/`, 'Failed to fetch match data');
}

// Function to update team dropdowns
function updateTeamSelects() {
  const teamASelected = document.getElementById('team-A').value;
  const teamBSelected = document.getElementById('team-B').value;

  const teamsForA = teams.filter(team => team.team_name !== teamBSelected);
  const teamsForB = teams.filter(team => team.team_name !== teamASelected);

  populateSelect(document.getElementById('team-A'), teamsForA, 'team_name', 'Select Team A');
  populateSelect(document.getElementById('team-B'), teamsForB, 'team_name', 'Select Team B');

  document.getElementById('team-A').value = teamASelected;
  document.getElementById('team-B').value = teamBSelected;

  updatePlayerSelectionEnabled();
}

// Event listeners for team selections
function addTeamSelectionListeners() {
  document.getElementById('team-A').addEventListener('change', () => {
    clearSelectedPlayers('team-A');
    updateTeamSelects();
  });

  document.getElementById('team-B').addEventListener('change', () => {
    clearSelectedPlayers('team-B');
    updateTeamSelects();
  });
}

// Populate dropdowns and selections
function populateSelect(selectElement, data, key, placeholder) {
  selectElement.innerHTML = `<option value="">${placeholder}</option>`;
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item[key];
    option.textContent = item[key];
    selectElement.appendChild(option);
  });
}

// Event listener for league selection change
document.getElementById('league-name').addEventListener('change', async function () {
  const leagueName = this.value;
  await fetchTeams(leagueName);
  clearAllSelectedPlayers();
  document.getElementById('team-A').value = '';
  document.getElementById('team-B').value = '';
});

// Function to clear all selected players
function clearAllSelectedPlayers() {
  document.getElementById('selected-players-A').innerHTML = '';
  document.getElementById('selected-players-B').innerHTML = '';
}

// Function to clear players of a specific team
function clearSelectedPlayers(teamId) {
  const selectedPlayersDiv = teamId === 'team-A' ? 'selected-players-A' : 'selected-players-B';
  document.getElementById(selectedPlayersDiv).innerHTML = '';
}

// Fetch and populate players for a given team
async function fetchPlayers(teamName, dropdownId) {
  const data = await fetchData('https://krinik.pythonanywhere.com/player_get/', 'Failed to fetch players');
  if (data) {
    const players = data.filter(player => player.team_name === teamName);
    allPlayers[dropdownId] = players;
    populatePlayerDropdown(players, dropdownId);
  }
}

// Populate player dropdown with search functionality
function populatePlayerDropdown(players, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const selectedPlayersDiv = dropdownId === 'dropdown-players-A' ? 'selected-players-A' : 'selected-players-B';
  const selectedPlayers = Array.from(document.getElementById(selectedPlayersDiv).querySelectorAll('.player-option'))
    .map(option => option.dataset.id);

  dropdown.innerHTML = createSearchInput(dropdownId);

  const playerContainer = createPlayerContainer(players.filter(player => !selectedPlayers.includes(player.id)), dropdownId);
  dropdown.appendChild(playerContainer);
}

// Create search input for filtering players
function createSearchInput(dropdownId) {
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search players...';
  searchInput.className = 'search-input';
  searchInput.addEventListener('input', (event) => filterPlayers(event.target.value, dropdownId));
  return searchInput;
}

// Create player container with limited display
function createPlayerContainer(filteredPlayers, dropdownId) {
  const playerContainer = document.createElement('div');
  playerContainer.className = 'player-container';

  filteredPlayers.slice(0, 6).forEach(player => {
    const playerOption = createPlayerOption(player, dropdownId);
    playerContainer.appendChild(playerOption);
  });

  if (filteredPlayers.length > 6) {
    playerContainer.style.maxHeight = '200px';
    playerContainer.style.overflowY = 'auto';
  }

  return playerContainer;
}

// Create individual player option element
function createPlayerOption(player, dropdownId) {
  const playerOption = document.createElement('a');
  playerOption.href = '#';
  playerOption.className = 'player-option';
  playerOption.dataset.id = player.id;
  playerOption.textContent = player.player_name;
  playerOption.addEventListener('click', function (event) {
    event.preventDefault();
    addPlayerToSelected(player, dropdownId);
    this.closest('.player-container').style.display = 'none';
  });
  return playerOption;
}

// Add selected player to the corresponding div
function addPlayerToSelected(player, dropdownId) {
  const selectedPlayersDiv = dropdownId === 'dropdown-players-A' ? 'selected-players-A' : 'selected-players-B';
  if (!document.querySelector(`#${selectedPlayersDiv} .player-option[data-id="${player.id}"]`)) {
    document.getElementById(selectedPlayersDiv).insertAdjacentHTML('beforeend', `
      <div class="col-md-6 d-flex align-items-center justify-content-between player-wrapper">
        <p class="form-control p-3 d-flex align-content-center justify-content-between player-option" data-id="${player.id}">
          ${player.player_name} <span class="remove-player" data-id="${player.id}"><i class="bi bi-x"></i></span>
        </p>
      </div>
    `);
  }
}

// Filter players based on search input
function filterPlayers(searchText, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const filteredPlayers = allPlayers[dropdownId].filter(player =>
    player.player_name.toLowerCase().includes(searchText.toLowerCase())
  );

  dropdown.innerHTML = createSearchInput(dropdownId);
  const playerContainer = createPlayerContainer(filteredPlayers, dropdownId);
  dropdown.appendChild(playerContainer);
}

// Initialize functionality when match ID is available
(async function initialize() {
  const urlParams = new URLSearchParams(window.location.search);
  const matchId = urlParams.get('id');

  if (matchId) {
    try {
      const matchData = await fetchMatchById(matchId);
      if (matchData) {
        await fetchLeagues();
        if (matchData.select_league) {
          await fetchTeams(matchData.select_league.league_name);
          populateFormFields(matchData);
          updateTeamSelects();
        }

        initialData = {
          match_end_date: matchData.match_end_date,
          match_start_date: matchData.match_start_date,
          select_league: matchData.select_league,
          select_player_A: matchData.select_player_A,
          select_player_B: matchData.select_player_B,
          select_team_A: matchData.select_team_A,
          select_team_B: matchData.select_team_B
        };
        console.log('Initial Data:', initialData);
      }
    } catch (error) {
      console.error('Failed to fetch or populate match data:', error);
    }
  } else {
    console.error('Match ID not found in URL');
  }

  addTeamSelectionListeners();
})();





// Utility function for common validation logic
function validateElement(element, errorSpan, validationMessage, isValid) {
    if (!element || !errorSpan) {
        console.error('Required elements not found');
        return false;
    }

    function validate() {
        if (!isValid(element)) {
            errorSpan.innerHTML = validationMessage;
            errorSpan.style.display = 'inline';
            return false;
        } else {
            errorSpan.style.display = 'none';
            return true;
        }
    }

    element.addEventListener('change', validate);
    return validate();
}

// Utility function to check if a select input is non-empty
function isNonEmptySelect(element) {
    return element.value !== '';
}

// Utility function to check if players are selected
function hasSelectedPlayers(teamId) {
    const selectedPlayers = document.querySelectorAll(`#selected-players-${teamId} .player-option`);
    return selectedPlayers.length > 0;
}

// League validation
function validateLeagueSelection() {
    return validateElement(leagueSelect, errorSpanLeague, 'Please select a league', isNonEmptySelect);
}

// Team validation
function validateTeamSelection() {
    const validTeamA = validateElement(teamSelectA, errorSpanA, 'Please select a team', isNonEmptySelect);
    const validTeamB = validateElement(teamSelectB, errorSpanB, 'Please select a team', isNonEmptySelect);

    return validTeamA && validTeamB;
}

// Player validation
function validatePlayerSelection() {
    const validTeamA = validateElement(
        teamSelectA,
        errorSpanPlayersA,
        'Please select at least one player for Team A',
        () => hasSelectedPlayers('A')
    );

    const validTeamB = validateElement(
        teamSelectB,
        errorSpanPlayersB,
        'Please select at least one player for Team B',
        () => hasSelectedPlayers('B')
    );

    return validTeamA && validTeamB;
}

// Date validation
function validateMatchDates() {
    const validStartDate = validateElement(startDate, errorSpanStart, 'Please select a start date', isNonEmptySelect);
    const validEndDate = validateElement(endDate, errorSpanEnd, 'Please select an end date', isNonEmptySelect);

    return validStartDate && validEndDate;
}

// Validate everything
function validateAll() {
    const validLeague = validateLeagueSelection();
    const validTeams = validateTeamSelection();
    const validPlayers = validatePlayerSelection();
    const validDates = validateMatchDates();

    return validLeague && validTeams && validPlayers && validDates;
}




