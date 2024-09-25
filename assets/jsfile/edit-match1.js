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

const urlParams = new URLSearchParams(window.location.search);
  const matchId = urlParams.get('id');

async function EditMatch() {
     

  initialize(matchId)
    
}



// fetchdata function
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


  // initialize


  async function initialize(matchId) {
 
  
    if (matchId) {
      try {
        const matchData = await fetchMatchById(matchId);
        if (matchData) {
            await fetchLeagues();
            if (matchData.select_league) {
                await fetchTeams(matchData.select_league.league_name);
                populateFormFields(matchData);
            // updateTeamSelects();
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
  
    // addTeamSelectionListeners();
  }



  async function fetchMatchById(matchId) {
    return await fetchData(`https://krinik.pythonanywhere.com/match_get/${matchId}/`, 'Failed to fetch match data');
  }

  async function fetchLeagues() {
    const leagues = await fetchData('https://krinik.pythonanywhere.com/league_get/', 'Failed to fetch leagues');
    if (leagues) {
      populateSelect(leagueSelect, leagues, 'league_name', 'Select League');
    }
  }

  async function fetchTeams(leagueName) {
    const data = await fetchData(`https://krinik.pythonanywhere.com/team_get/?league_name=${leagueName}`, 'Failed to fetch teams');
    if (data) {
      teams = data.filter(team => team.league_name === leagueName);
      updateTeamSelects();
    }
  }
  document.getElementById('league-name').addEventListener('change', async function () {
    const leagueName = this.value;
    await fetchTeams(leagueName);
    // clearAllSelectedPlayers();

    
    document.getElementById('team-A').value = '';
    document.getElementById('team-B').value = '';
  });

  function updateTeamSelects() {
    const teamASelected = document.getElementById('team-A').value;
    const teamBSelected = document.getElementById('team-B').value;

    const teamsForA = teams.filter(team => team.team_name !== teamBSelected);
    const teamsForB = teams.filter(team => team.team_name !== teamASelected);

    populateSelect(document.getElementById('team-A'), teamsForA, 'team_name', 'Select Team A');
    populateSelect(document.getElementById('team-B'), teamsForB, 'team_name', 'Select Team B');

    document.getElementById('team-A').value = teamASelected;
    document.getElementById('team-B').value = teamBSelected;

    // updatePlayerSelectionEnabled();
  }

  document.getElementById('team-A').addEventListener('change', function () {
    clearSelectedPlayers('team-A');
    updateTeamSelects();
  });

  document.getElementById('team-B').addEventListener('change', function () {
    clearSelectedPlayers('team-B');
    updateTeamSelects();
  });


  function populateSelect(selectElement, data, key, placeholder) {
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item[key];
      option.textContent = item[key];
      selectElement.appendChild(option);
    });
  }


  async function populateFormFields(matchData) {
    console.log('Match data:', matchData);

    // populatePlayerDropdown(matchData.select_player_A, 'dropdown-players-A');
    // populatePlayerDropdown(matchData.select_player_B, 'dropdown-players-B');

    // Adding players to selected-players-A by default
    const selectedPlayersDivA = document.getElementById('selected-players-A');
    selectedPlayersDivA.innerHTML = ''; // Clear existing content

    matchData.select_player_A.forEach(player => {
      const playerId = player.id;
      const playerName = player.player_name;

      selectedPlayersDivA.insertAdjacentHTML('beforeend', `
        <div class="col-md-6 d-flex align-items-center justify-content-between player-wrapper">
            <p class="form-control p-3 d-flex align-content-center justify-content-between player-option" data-id="${playerId}">
                ${playerName} <span class="remove-player" data-id="${playerId}"><i class="bi bi-x"></i></span>
            </p>
        </div>
    `);
    });

    // Similarly, you can add players to selected-players-B if needed
    const selectedPlayersDivB = document.getElementById('selected-players-B');
    selectedPlayersDivB.innerHTML = ''; // Clear existing content

    matchData.select_player_B.forEach(player => {
      const playerId = player.id;
      const playerName = player.player_name;

      selectedPlayersDivB.insertAdjacentHTML('beforeend', `
        <div class="col-md-6 d-flex align-items-center justify-content-between player-wrapper">
            <p class="form-control p-3 d-flex align-content-center justify-content-between player-option" data-id="${playerId}">
                ${playerName} <span class="remove-player" data-id="${playerId}"><i class="bi bi-x"></i></span>
            </p>
        </div>
    `);
    });

    // Populate other form fields
    const leagueNameInput = document.getElementById('league-name');
    const teamAInput = document.getElementById('team-A');
    const teamBInput = document.getElementById('team-B');
    const startDateInput = document.getElementById('match-start-date');
    const endDateInput = document.getElementById('match-end-date');

    leagueNameInput.value = matchData.select_league?.league_name || '';
    teamAInput.value = matchData.select_team_A?.team_name || '';
    teamBInput.value = matchData.select_team_B?.team_name || '';

    startDateInput.value = matchData.match_start_date || '';
    endDateInput.value = matchData.match_end_date || '';

    console.log('Form fields populated');
  }




window.onload = function() {
    EditMatch();  // Call the EditMatch function when the page is fully loaded
};