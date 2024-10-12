
document.addEventListener('DOMContentLoaded', async function () {



  let initialData = {};

  let allPlayers = {
    'dropdown-players-A': [],
    'dropdown-players-B': []
  };
  let teams = [];





  async function fetchTeams(leagueName) {
    try {
      const response = await fetch(`https://krinik.pythonanywhere.com/team_get/?league_name=${leagueName}`);
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        teams = data.data.filter(team => team.league_name === leagueName);
        updateTeamSelects();
      } else {
        console.error('Invalid data format for teams:', data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }

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

  document.getElementById('team-A').addEventListener('change', function () {
    clearSelectedPlayers('team-A');
    updateTeamSelects();
  });

  document.getElementById('team-B').addEventListener('change', function () {
    clearSelectedPlayers('team-B');
    updateTeamSelects();
  });

  const urlParams = new URLSearchParams(window.location.search);
  const matchId = urlParams.get('id');

  if (matchId) {
    try {
      const matchData = await fetchMatchById(matchId);
      console.log(matchData, "olpi")
      await fetchLeagues();
      if (matchData && matchData.select_league) {
        await fetchTeams(matchData.select_league.league_name);
        populateFormFields(matchData);
        updateTeamSelects();
        // populatePlayerDropdown(players, dropdownId);
      }

      const initialData = {
     
       
match_end_date: matchData.match_end_date,

match_start_date: matchData.match_start_date,

select_league: matchData.select_league,

select_player_A: matchData.select_player_A,

select_player_B: matchData.select_player_B,
select_team_A: matchData.select_team_A,

select_team_B:matchData.select_team_B 

      };
      console.log(initialData,"initial")
    } catch (error) {
      console.error('Failed to fetch or populate match data:', error);
    }
  } else {
    console.error('Match ID not found in URL');
  }

  async function fetchMatchById(matchId) {
    try {
      const response = await fetch(`https://krinik.pythonanywhere.com/match_get/${matchId}/`);
      if (!response.ok) throw new Error('Failed to fetch match data');
      const data = await response.json();
      if (data.status === 'success' && data.data) {
        return data.data;
      } else {
        throw new Error('Invalid data format for match');
      }
    } catch (error) {
      console.error('Error fetching match data:', error);
      return null;
    }
  }




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

  async function fetchLeagues() {
    try {
      const response = await fetch('https://krinik.pythonanywhere.com/league_get/');
      if (!response.ok) throw new Error('Failed to fetch leagues');
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        populateSelect(document.getElementById('league-name'), data.data, 'league_name', 'Select League');
      } else {
        console.error('Invalid data format for leagues:', data);
      }
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  }

  async function fetchTeams(leagueName) {
    try {
      const response = await fetch(`https://krinik.pythonanywhere.com/team_get/`);
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        teams = data.data.filter(team => team.league_name === leagueName);
        updateTeamSelects();
      } else {
        console.error('Invalid data format for teams:', data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }

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

  document.getElementById('team-A').addEventListener('change', function () {
    clearSelectedPlayers('team-A');
    updateTeamSelects();
  });

  document.getElementById('team-B').addEventListener('change', function () {
    clearSelectedPlayers('team-B');
    updateTeamSelects();
  });




  // Function to fetch players for a given team
  async function fetchPlayers(teamName, dropdownId) {
    try {
      const response = await fetch('https://krinik.pythonanywhere.com/player_get/');
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        const players = data.data.filter(player => player.team_name === teamName);
        allPlayers[dropdownId] = players;
        populatePlayerDropdown(players, dropdownId);
      } else {
        console.error('Invalid data format for players:', data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  }

  function populatePlayerDropdown(players, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const selectedPlayersDiv = dropdownId === 'dropdown-players-A' ? 'selected-players-A' : 'selected-players-B';
    const selectedPlayers = Array.from(document.getElementById(selectedPlayersDiv).querySelectorAll('.player-option'))
      .map(option => option.dataset.id);

    dropdown.innerHTML = '';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search players...';
    searchInput.className = 'search-input';
    searchInput.addEventListener('input', function (event) {
      filterPlayers(event.target.value, dropdownId);
    });
    dropdown.appendChild(searchInput);

    const playerContainer = document.createElement('div');
    playerContainer.className = 'player-container';

    players.filter(player => !selectedPlayers.includes(player.id)).forEach((player, index) => {
      if (index < 6) { // Limit to display only first 6 players
        const playerOption = document.createElement('a');
        playerOption.href = '#';
        playerOption.className = 'player-option';
        playerOption.dataset.id = player.id; // Assuming 'id' is the player ID
        playerOption.textContent = player.player_name;
        playerOption.addEventListener('click', function (event) {
          event.preventDefault();
          const playerId = player.id;
          const playerName = player.player_name;
          const selectedPlayersDiv = dropdownId === 'dropdown-players-A' ? 'selected-players-A' : 'selected-players-B';

          if (!document.querySelector(`#${selectedPlayersDiv} .player-option[data-id="${playerId}"]`)) {
            document.getElementById(selectedPlayersDiv).insertAdjacentHTML('beforeend', `
            <div class="col-md-6 d-flex align-items-center justify-content-between player-wrapper">
              <p class="form-control p-3 d-flex align-content-center justify-content-between player-option" data-id="${playerId}">
                ${playerName} <span class="remove-player" data-id="${playerId}"><i class="bi bi-x"></i></span>
              </p>
            </div>
          `);
          }

          dropdown.style.display = 'none';
        });
        playerContainer.appendChild(playerOption);
      }
    });

    if (players.length > 6) {
      playerContainer.style.maxHeight = '200px'; // Set max height with scrollbar if more than 6 players
      playerContainer.style.overflowY = 'auto'; // Enable vertical scrollbar
    }

    dropdown.appendChild(playerContainer);

    dropdown.addEventListener('click', function (event) {
      if (event.target.classList.contains('player-option')) {
        event.preventDefault();
        const playerId = event.target.dataset.id;
        const playerName = event.target.textContent;
        const selectedPlayersDiv = dropdownId === 'dropdown-players-A' ? 'selected-players-A' : 'selected-players-B';

        if (!document.querySelector(`#${selectedPlayersDiv} .player-option[data-id="${playerId}"]`)) {
          document.getElementById(selectedPlayersDiv).insertAdjacentHTML('beforeend', `
          <div class="col-md-6 d-flex align-items-center justify-content-between player-wrapper">
            <p class="form-control p-3 d-flex align-content-center justify-content-between player-option" data-id="${playerId}">
              ${playerName} <span class="remove-player" data-id="${playerId}"><i class="bi bi-x"></i></span>
            </p>
          </div>
        `);
        }

        dropdown.style.display = 'none';
      }
    });
  }


  function filterPlayers(searchText, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const players = allPlayers[dropdownId];
    const filteredPlayers = players.filter(player => player.player_name.toLowerCase().includes(searchText.toLowerCase()));

    dropdown.innerHTML = '';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search players...';
    searchInput.className = 'search-input';
    searchInput.value = searchText;
    searchInput.addEventListener('input', function (event) {
      filterPlayers(event.target.value, dropdownId);
    });
    dropdown.appendChild(searchInput);
    searchInput.focus(); // Keep the input field focused

    filteredPlayers.forEach(player => {
      const playerOption = document.createElement('a');
      playerOption.href = '#';
      playerOption.className = 'player-option';
      playerOption.dataset.id = player.id;
      playerOption.textContent = player.player_name;
      dropdown.appendChild(playerOption);
    });
  }
  function clearAllSelectedPlayers() {
    document.getElementById('selected-players-A').innerHTML = '';
    document.getElementById('selected-players-B').innerHTML = '';
  }

  function clearSelectedPlayers(teamId) {
    if (teamId === 'team-A') {
      document.getElementById('selected-players-A').innerHTML = '';
    } else if (teamId === 'team-B') {
      document.getElementById('selected-players-B').innerHTML = '';
    }
  }
  function populateSelect(selectElement, data, key, placeholder) {
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item[key];
      option.textContent = item[key];
      selectElement.appendChild(option);
    });
  }


  function updatePlayerSelectionEnabled() {
    const leagueSelected = document.getElementById('league-name').value;
    const teamASelected = document.getElementById('team-A').value;
    const teamBSelected = document.getElementById('team-B').value;

    if (leagueSelected && teamASelected) {
      fetchPlayers(teamASelected, 'dropdown-players-A');
      document.getElementById('select-player-A').disabled = false;
    } else {
      document.getElementById('select-player-A').disabled = true;
    }

    if (leagueSelected && teamBSelected) {
      fetchPlayers(teamBSelected, 'dropdown-players-B');
      document.getElementById('select-player-B').disabled = false;

    } else {
      document.getElementById('select-player-B').disabled = true;

    }
  }

  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-player') || event.target.closest('.remove-player')) {
      const parentDiv = event.target.closest('.player-wrapper');
      parentDiv.remove();
    }

    const dropdownA = document.getElementById('dropdown-players-A');
    const dropdownB = document.getElementById('dropdown-players-B');

    if (!event.target.closest('#dropdown-players-A') && !event.target.closest('#select-player-A')) {
      dropdownA.style.display = 'none';
    }

    if (!event.target.closest('#dropdown-players-B') && !event.target.closest('#select-player-B')) {
      dropdownB.style.display = 'none';
    }
  });


  document.getElementById('select-player-A').addEventListener('click', function () {
    const dropdown = document.getElementById('dropdown-players-A');
    if (!dropdown.disabled) {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      if (dropdown.style.display === 'block') {
        const searchInput = dropdown.querySelector('.search-input');
        if (searchInput) {
          searchInput.value = ''; // Clear input field
          filterPlayers('', 'dropdown-players-A'); // Reset player list
          searchInput.focus();
        }
      }
    }
  });

  document.getElementById('select-player-B').addEventListener('click', function () {
    const dropdown = document.getElementById('dropdown-players-B');
    if (!dropdown.disabled) {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      if (dropdown.style.display === 'block') {
        const searchInput = dropdown.querySelector('.search-input');
        if (searchInput) {
          searchInput.value = ''; // Clear input field
          filterPlayers('', 'dropdown-players-B'); // Reset player list
          searchInput.focus();
        }
      }
    }
  });



  async function populateFormFields(matchData) {
    console.log('Match data:', matchData);

    populatePlayerDropdown(matchData.select_player_A, 'dropdown-players-A');
    populatePlayerDropdown(matchData.select_player_B, 'dropdown-players-B');

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

  updatePlayerSelectionEnabled();

  function populatePlayersSelect(players, selectId) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '';

    players.forEach(player => {
      const option = document.createElement('option');
      option.value = player.id; // Assuming 'id' is the player ID
      option.textContent = player.player_name;
      selectElement.appendChild(option);
    });
  }

  function filterPlayers(searchTerm, dropdownId) {
    const playerContainer = document.getElementById(dropdownId).querySelector('.player-container');
    const playerOptions = playerContainer.querySelectorAll('.player-option');

    playerOptions.forEach(playerOption => {
      if (playerOption.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
        playerOption.style.display = 'block';
      } else {
        playerOption.style.display = 'none';
      }
    });
  }

 

 
  









})


















 async function myFetch(url, type, data) {
            try {
                let responseData;

                if (type === "GET") {
                    const res = await fetch(url, {
                        method: type,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (res.ok) {
                        console.log("HTTP request successful");
                    } else {
                        console.log("HTTP request unsuccessful");
                    }

                    responseData = await res.json();
                    return responseData.data; // Assuming the API returns data array
                } else if (type === "DELETE") {
                    const res = await fetch(url, {
                        method: type,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (res.ok) {
                        console.log("HTTP request successful");
                    } else {
                        console.log("HTTP request unsuccessful");
                    }

                    return res;
                } else if (type === "POST" || type === "PUT") {
                    const res = await fetch(url, {
                        method: type,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (res.ok) {
                        console.log("HTTP request successful");
                    } else {
                        console.log("HTTP request unsuccessful");
                    }

                    responseData = await res.json();
                    return responseData;
                }
            } catch (error) {
                console.error("Fetch error:", error);
                throw error; // Re-throw the error to handle it where myFetch is called
            }
        }
        let existingMatches = []
        existingMatches = await myFetch("https://krinik.pythonanywhere.com/match_get/", "GET");
        console.log(existingMatches, "ok")


















  // Initialize Flatpickr date pickers
  $(function () {
    let startPicker = flatpickr('#match-start-date', {
      dateFormat: 'd-m-Y H:i',
      enableTime: true,
      minDate: 'today', // Disable past dates
      onChange: function (selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
          endPicker.set('minDate', selectedDates[0]);
          // Close the picker if both date and time are selected
          // if (dateStr.includes(' ')) {
          //     instance.close(); // Close the picker after full date-time selection
          // }
        }
      },
      onReady: function (selectedDates, dateStr, instance) {
        addCustomButtons(instance, '#match-start-date');
      }
    });

    let endPicker = flatpickr('#match-end-date', {
      dateFormat: 'd-m-Y H:i',
      enableTime: true,
      onOpen: function () {
        const startDate = startPicker.selectedDates[0];
        if (startDate) {
          endPicker.set('minDate', startDate);
        }
      },
      onChange: function (selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
          // Close the picker if both date and time are selected
          // if (dateStr && dateStr.includes(' ')) {
          //     instance.close(); // Close the picker after full date-time selection
          // }
        }
      },
      onReady: function (selectedDates, dateStr, instance) {
        addCustomButtons(instance, '#match-end-date');
      }
    });

    // Open Flatpickr on calendar icon click
    $('#calendarIconStart').click(function () {
      startPicker.open();
    });
    $('#calendarIconEnd').click(function () {
      endPicker.open();
    });
    let okButtonClicked = false;



    function addCustomButtons(instance, inputSelector) {
      // Ensure the calendarContainer is available
      if (!instance || !instance.calendarContainer) {
        console.error('Flatpickr instance or calendar container not found.');
        return;
      }

      // Check if the footer already exists and remove it
      let existingFooter = instance.calendarContainer.querySelector('.flatpickr-footer');
      if (existingFooter) {
        existingFooter.remove();
      }

      // Create footer and buttons
      const footer = document.createElement('div');
      footer.className = 'flatpickr-footer';

      const okButton = document.createElement('button');
      okButton.type = 'button';
      okButton.className = 'flatpickr-ok-button';
      okButton.textContent = 'OK';
      okButton.addEventListener('click', function () {
        okButtonClicked = true;
        instance.close();
      });

      const clearButton = document.createElement('button');
      clearButton.type = 'button';
      clearButton.className = 'flatpickr-clear-button';
      clearButton.textContent = 'Clear';
      clearButton.addEventListener('click', function () {
        document.querySelector(inputSelector).value = '';
        instance.clear();
      });

      footer.appendChild(okButton);
      footer.appendChild(clearButton);

      // Append the footer to the calendar container
      instance.calendarContainer.appendChild(footer);
    }

    // Modify the onChange event handler to only update the input value when the OK button is clicked
    instance.config.onChange = function (selectedDates, dateStr, instance) {
      if (okButtonClicked) {
        document.querySelector(inputSelector).value = dateStr;
        okButtonClicked = false; // Reset the flag
      }
    };
  });






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

// Validate team selection
function validateTeamSelection() {
    const teamSelectA = document.getElementById('team-A');
    const teamSelectB = document.getElementById('team-B');
    const errorSpanA = document.getElementById('error-team-A');
    const errorSpanB = document.getElementById('error-team-B');

    function validateTeam(teamSelect, errorSpan) {
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

    const validTeamA = validateTeam(teamSelectA, errorSpanA);
    const validTeamB = validateTeam(teamSelectB, errorSpanB);

    return validTeamA && validTeamB;
}

// Validate player selection
// Validate player selection
function validatePlayerSelection() {
    const teamASelected = document.getElementById('team-A').value;
    const teamBSelected = document.getElementById('team-B').value;
    const errorSpanA = document.getElementById('error-players-A');
    const errorSpanB = document.getElementById('error-players-B');

    function validatePlayers(teamSelect, errorSpan, teamId) {
        if (!teamSelect || !errorSpan) {
            console.error('Team selection elements not found');
            return false;
        }

        function validate() {
            const selectedPlayers = document.querySelectorAll(`#selected-players-${teamId} .player-option`);
            if (selectedPlayers.length === 0) {
                errorSpan.innerHTML = `Please select at least one player for Team ${teamId}`;
                errorSpan.style.display = 'inline';
                return false;
            } else {
                errorSpan.style.display = 'none';
                return true;
            }
        }

        const playerSelect = document.getElementById(`select-player-${teamId}`);
        playerSelect.addEventListener('change', validate);
        return validate();
    }

    const validTeamA = validatePlayers(teamASelected, errorSpanA, 'A');
    const validTeamB = validatePlayers(teamBSelected, errorSpanB, 'B');

    return validTeamA && validTeamB;
}

// Validate match dates
function validateMatchDates() {
    const startDate = document.getElementById('match-start-date');
    const endDate = document.getElementById('match-end-date');
    const errorSpanStart = document.getElementById('error-match-start-date');
    const errorSpanEnd = document.getElementById('error-match-end-date');

    function validateDate(dateInput, errorSpan) {
        if (!dateInput || !errorSpan) {
            console.error('Date input elements not found');
            return false;
        }

        function validate() {
            if (!dateInput.value) {
                errorSpan.innerHTML = 'Please select a date';
                errorSpan.style.display = 'inline';
                return false;
            } else {
                errorSpan.style.display = 'none';
                return true;
            }
        }

        dateInput.addEventListener('change', validate);
        return validate();
    }

    const validStartDate = validateDate(startDate, errorSpanStart);
    const validEndDate = validateDate(endDate, errorSpanEnd);

    return validStartDate && validEndDate;
}

function validateForm() {
    const leagueValid = validateLeagueSelection();
    const teamValid = validateTeamSelection();
    const playerValid = validatePlayerSelection();
    const datesValid = validateMatchDates();

    return leagueValid && teamValid && playerValid && datesValid;
}












function checkOverlap(teamA, teamB, startDate1, existingMatches) {
    const startDate = document.getElementById('match-start-date').value;

    if (!existingMatches || existingMatches.length === 0) {
        return { teamAOverlap: false, teamBOverlap: false, dateOverlap: false };
    }

    // Log team names for debugging


    const teamAOverlap = existingMatches.some(match => {
        return match.select_team_A.team_name === teamA || match.select_team_B.team_name === teamA;
    });
    console.log('Team A Overlap:', teamAOverlap);

    const teamBOverlap = existingMatches.some(match => {
        return match.select_team_A.team_name === teamB || match.select_team_B.team_name === teamB;
    });
    console.log('Team B Overlap:', teamBOverlap);

    const dateOverlap = existingMatches.some(match => {
        const matchStartDateStr1 = match.match_start_date;
        const [day, month, year] = matchStartDateStr1.split(/[- ]+/);
        const matchStartDateStr = `${day}-${month}-${year}`;

        const startDateStr = startDate;
        const [startDay, startMonth, startYear] = startDateStr.split(/[- ]+/);
        const startDateObj = `${startDay}-${startMonth}-${startYear}`;

        return startDateObj === matchStartDateStr;
    });
    console.log('Date Overlap:', dateOverlap);

    return { teamAOverlap, teamBOverlap, dateOverlap };
}














  const form = document.getElementById('match-form');
  form.addEventListener('submit', async function (event) {
      event.preventDefault();

      // Collect all necessary form data
      const leagueName = document.getElementById('league-name').value;
      const teamA = document.getElementById('team-A').value;
      const teamB = document.getElementById('team-B').value;
      const startDate = document.getElementById('match-start-date').value;
      const endDate = document.getElementById('match_end_date').value;




      // Collect selected players' names for Team A
      const selectedPlayersA = Array.from(document.querySelectorAll('#selected-players-A .player-option'))
          .map(player => player.textContent.trim());

      // Collect selected players' names for Team B
      const selectedPlayersB = Array.from(document.querySelectorAll('#selected-players-B .player-option'))
          .map(player => player.textContent.trim());

          const currentData = {
           

match_end_date: endDate,

match_start_date: startDate,

select_league: leagueName,

select_player_A: selectedPlayersA,

select_player_B: selectedPlayersB,
select_team_A: teamA,

select_team_B:teamB // Define player_image here
};

console.log(currentData,"current")
      // FormData object to send via fetch
      const formData = new FormData();
      formData.append('select_league', leagueName);
      formData.append('select_team_A', teamA);
      formData.append('select_team_B', teamB);

      // Append each player individually to formData for select_player_A
      selectedPlayersA.forEach(player => {
          formData.append('select_player_A', player);
      });

      // Append each player individually to formData for select_player_B
      selectedPlayersB.forEach(player => {
          formData.append('select_player_B', player);
      });

      formData.append('match_start_date', document.getElementById('match-start-date').value);
      formData.append('match_end_date', document.getElementById('match-end-date').value);

      // Example of logging values for debugging
      // console.log(teamA);
      // console.log(selectedPlayersA);

      // Now you can use formData to send this data via fetch or any other method.


      // Now you can use formData to send this data via fetch or any other method.
      // Perform overlap check
      const overlapResult = checkOverlap(teamA, teamB, startDate, existingMatches);

      // Log form data for verification
      console.log('Form data before sending:');
      formData.map((value, key) => {
          console.log(key, value);
      });

      // Check if the form is valid
      if (validateForm()) {


          // Handle overlap errors
          if (overlapResult.teamAOverlap && overlapResult.teamBOverlap && overlapResult.dateOverlap) {
              document.getElementById('error-team-A').innerHTML = 'Team-A name already exists';
              document.getElementById('error-team-A').style.display = 'inline';
              document.getElementById('error-team-B').innerHTML = 'Team-B name already exists';
              document.getElementById('error-team-B').style.display = 'inline';

             

          } else if (overlapResult.teamAOverlap && overlapResult.dateOverlap) {
              document.getElementById('error-team-A').innerHTML = 'Team-A name already exists';
              document.getElementById('error-team-A').style.display = 'inline';

          } else if (overlapResult.teamBOverlap && overlapResult.dateOverlap) {

              document.getElementById('error-team-B').innerHTML = 'Team-B name already exists';
              document.getElementById('error-team-B').style.display = 'inline';
          } else {
              // Proceed with form submission if there are no overlap errors
              if (confirm("Are you sure you want to add this match?")) {
                  try {
                      const response = await fetch('https://krinik.pythonanywhere.com/match_get/', {
                          method: 'PATCH',
                          body: formData
                      });

                      if (!response.ok) {
                          const errorText = await response.text();
                          throw new Error(`Failed to submit match data: ${response.status} ${response.statusText} - ${errorText}`);
                      }

                      const responseData = await response.json();
                      console.log('Response data:', responseData);
                      // window.location.href = 'manage-match.html'; // Redirect on successful submission
                  } catch (error) {
                      console.error('Error:', error);
                      alert('An error occurred while submitting the match data.');
                  }
              }
          }
      } else {
          console.log('Form validation failed. Please check all fields.');
      }

  });

  history.pushState(null, null, window.location.href);
       
     




  window.addEventListener('pageshow', function (event) {
if (event.persisted || (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD)) {
// Reload the page only once
window.location.reload();
}

});