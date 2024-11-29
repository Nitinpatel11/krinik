import {checkAdminAccess}  from "../js/initial.js"
document.addEventListener('DOMContentLoaded', async function () {
  let initialData = {};
  let leagueMatchName

  let allPlayers = {
    'dropdown-players-A': [],
    'dropdown-players-B': []
  };
  let disablePlayerA
  let disablePlayerB
  let ActivePlayerA
  let ActivePlayerB
  let teams = [];
  let playersData
  let matchData
  let arr = [];
  let leaguestartDate
let leagueendDate
let startPicker

  // Initialize Flatpickr date pickers
  // $(function () {
  //   let startPicker = flatpickr('#match-start-date', {
  //     dateFormat: 'd-m-Y H:i',
  //     enableTime: true,
  //     minDate: 'today', // Disable past dates
  //     onChange: function (selectedDates, dateStr, instance) {
  //       if (selectedDates.length > 0) {
  //         endPicker.set('minDate', selectedDates[0]);
  //         // Close the picker if both date and time are selected
  //         // if (dateStr.includes(' ')) {
  //         //     instance.close(); // Close the picker after full date-time selection
  //         // }
  //       }
  //     },
  //     onReady: function (selectedDates, dateStr, instance) {
  //       addCustomButtons(instance, '#match-start-date');
  //     }
  //   });

  //   let endPicker = flatpickr('#match-end-date', {
  //     dateFormat: 'd-m-Y H:i',
  //     enableTime: true,
  //     onOpen: function () {
  //       const startDate = startPicker.selectedDates[0];
  //       if (startDate) {
  //         endPicker.set('minDate', startDate);
  //       }
  //     },
  //     onChange: function (selectedDates, dateStr, instance) {
  //       if (selectedDates.length > 0) {
  //         // Close the picker if both date and time are selected
  //         // if (dateStr && dateStr.includes(' ')) {
  //         //     instance.close(); // Close the picker after full date-time selection
  //         // }
  //       }
  //     },
  //     onReady: function (selectedDates, dateStr, instance) {
  //       addCustomButtons(instance, '#match-end-date');
  //     }
  //   });

  //   // Open Flatpickr on calendar icon click
  //   $('#calendarIconStart').click(function () {
  //     startPicker.open();
  //   });
  //   $('#calendarIconEnd').click(function () {
  //     endPicker.open();
  //   });
  //   let okButtonClicked = false;



  //   function addCustomButtons(instance, inputSelector) {
  //     // Ensure the calendarContainer is available
  //     if (!instance || !instance.calendarContainer) {
  //       console.error('Flatpickr instance or calendar container not found.');
  //       return;
  //     }

  //     // Check if the footer already exists and remove it
  //     let existingFooter = instance.calendarContainer.querySelector('.flatpickr-footer');
  //     if (existingFooter) {
  //       existingFooter.remove();
  //     }

  //     // Create footer and buttons
  //     const footer = document.createElement('div');
  //     footer.className = 'flatpickr-footer';

  //     const okButton = document.createElement('button');
  //     okButton.type = 'button';
  //     okButton.className = 'flatpickr-ok-button';
  //     okButton.textContent = 'OK';
  //     okButton.addEventListener('click', function () {
  //       okButtonClicked = true;
  //       instance.close();
  //     });

  //     const clearButton = document.createElement('button');
  //     clearButton.type = 'button';
  //     clearButton.className = 'flatpickr-clear-button';
  //     clearButton.textContent = 'Clear';
  //     clearButton.addEventListener('click', function () {
  //       document.querySelector(inputSelector).value = '';
  //       instance.clear();
  //     });

  //     footer.appendChild(okButton);
  //     footer.appendChild(clearButton);

  //     // Append the footer to the calendar container
  //     instance.calendarContainer.appendChild(footer);
  //   }

  //   // Modify the onChange event handler to only update the input value when the OK button is clicked
  //   instance.config.onChange = function (selectedDates, dateStr, instance) {
  //     if (okButtonClicked) {
  //       document.querySelector(inputSelector).value = dateStr;
  //       okButtonClicked = false; // Reset the flag
  //     }
  //   };
  // });
  $(function () {
    // Initialize Flatpickr
     startPicker = flatpickr('#match-start-date', {
        dateFormat: 'd-m-Y H:i',
        enableTime: true,
        minDate: leaguestartDate, // Set the initial minDate
        maxDate: leagueendDate,  // Set the initial maxDate
        onChange: function (selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                // No endPicker, so no need to set minDate or maxDate for another picker.
            }
        },
        onReady: function (selectedDates, dateStr, instance) {
            addCustomButtons(instance, '#match-start-date');
        }
    });

    // Open Flatpickr on calendar icon click
    $('#calendarIconStart').click(function () {
        startPicker.open();
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
            instance.close(); // Close the picker
        });

        const clearButton = document.createElement('button');
        clearButton.type = 'button';
        clearButton.className = 'flatpickr-clear-button';
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', function () {
            document.querySelector(inputSelector).value = ''; // Clear input value
            instance.clear(); // Clear picker
        });

        footer.appendChild(okButton);
        footer.appendChild(clearButton);

        // Append the footer to the calendar container
        instance.calendarContainer.appendChild(footer);
    }

    // Modify the onChange event handler to only update the input value when the OK button is clicked
    startPicker.config.onChange = function (selectedDates, dateStr, instance) {
        if (okButtonClicked) {
            document.querySelector('#match-start-date').value = dateStr;
            okButtonClicked = false; // Reset the flag
        }
    };
})

  async function fetchTeams(leagueName) {
    try {
      const response = await fetch(`https://krinik.in/team_get/?league_name=${leagueName}`);
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
  const matchId = Number(urlParams.get('id'))

  if (matchId) {
    try {
      matchData = await fetchMatchById(matchId);
      console.log(matchData, "olpi")
      
      await fetchLeagues();
      leaguestartDate = matchData.select_league.start_league_date;
                    leagueendDate = matchData.select_league.end_league_date;

                    console.log({
                        start: leaguestartDate,
                        end: leagueendDate
                    }, "Selected League Dates");

                    // Update the Flatpickr instance minDate and maxDate
                    startPicker.set('minDate', leaguestartDate);
                    startPicker.set('maxDate', leagueendDate);
      if (matchData && matchData.select_league) {
        await fetchTeams(matchData.select_league.league_name);
        populateFormFields(matchData);
        updateTeamSelects();
        // populatePlayerDropdown(players, dropdownId);
      }

      initialData = {
        // match_end_date: matchData.match_end_date,

        match_start_date: matchData.match_start_date,

        select_league: matchData.select_league.league_name,

        select_player_A: matchData.select_player_A.map(player => player.id),

        select_player_B: matchData.select_player_B.map(player => player.id),
        select_team_A: matchData.select_team_A.team_name,

        select_team_B: matchData.select_team_B.team_name,
        player_list: matchData.player_list.map(player => player)

      };
      console.log(initialData, "initial")
    } catch (error) {
      console.error('Failed to fetch or populate match data:', error);
    }
  } else {
    console.error('Match ID not found in URL');
  }

  async function fetchMatchById(matchId) {
    try {
      const response = await fetch(`https://krinik.in/match_get/${matchId}/`);
      if (!response.ok) throw new Error('Failed to fetch match data');
      const data = await response.json();
      if (data.status === 'success' && data.data) {
        leagueMatchName = data.data.select_league.league_name
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
      const response = await fetch('https://krinik.in/league_get/');
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
      const response = await fetch(`https://krinik.in/team_get/`);
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
  async function fetchPlayers(teamName, dropdownId, disabledPlayers) {
    try {
      const response = await fetch('https://krinik.in/player_get/');
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();

      console.log(data, "data");
      if (data.status === 'success' && Array.isArray(data.data)) {
        playersData = data.data.filter(player => player.team_name.team_name === teamName && player.league_name === leagueMatchName);
        allPlayers[dropdownId] = playersData;
        console.log(playersData, "players12");
        populatePlayerDropdown(playersData, dropdownId, disabledPlayers);
      } else {
        console.error('Invalid data format for players:', data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  }
  async function populateFormFields(matchData) {
    console.log('Match data:', matchData);

    // Ensure disable_player arrays are defined for populatePlayerDropdown
    disablePlayerA = matchData.disable_player_A || [];
    disablePlayerB = matchData.disable_player_B || [];
    ActivePlayerA = matchData.select_player_A || [];
    ActivePlayerB = matchData.select_player_B || [];

    console.log(disablePlayerA, "disableo")
    arr = matchData.player_list
    console.log(arr, "ayu")
    populatePlayerDropdown(ActivePlayerA, 'dropdown-players-A', disablePlayerA);
    populatePlayerDropdown(ActivePlayerB, 'dropdown-players-B', disablePlayerB);

    // Adding players to selected-players-A by default
    const selectedPlayersDivA = document.getElementById('selected-players-A');
    if (selectedPlayersDivA) {
      selectedPlayersDivA.innerHTML = ''; // Clear existing content

      (Array.isArray(matchData.select_player_A) ? matchData.select_player_A : []).forEach(player => {
        const playerId = String(player.id);
        console.log(playerId, "playedIdche")
        const playerName = player.player_name;

        selectedPlayersDivA.insertAdjacentHTML('beforeend', `
            <div class="col-md-6 d-flex align-items-center justify-content-between player-wrapper">
                <p class="form-control p-3 d-flex align-content-center justify-content-between player-option" data-id="${playerId}">
                    ${playerName} <span class="remove-player" data-id="${playerId}"><i class="bi bi-x"></i></span>
                </p>
            </div>
        `);
      });
    }

    // Adding players to selected-players-B by default
    const selectedPlayersDivB = document.getElementById('selected-players-B');
    if (selectedPlayersDivB) {
      selectedPlayersDivB.innerHTML = ''; // Clear existing content

      (Array.isArray(matchData.select_player_B) ? matchData.select_player_B : []).forEach(player => {
        const playerId = String(player.id);
        const playerName = player.player_name;

        selectedPlayersDivB.insertAdjacentHTML('beforeend', `
            <div class="col-md-6 d-flex align-items-center justify-content-between player-wrapper">
                <p class="form-control p-3 d-flex align-content-center justify-content-between player-option" data-id="${playerId}">
                    ${playerName} <span class="remove-player" data-id="${playerId}"><i class="bi bi-x"></i></span>
                </p>
            </div>
        `);
      });
    }

    // Populate other form fields if elements exist
    const leagueNameInput = document.getElementById('league-name');
    const teamAInput = document.getElementById('team-A');
    const teamBInput = document.getElementById('team-B');
    const startDateInput = document.getElementById('match-start-date');

    if (leagueNameInput) leagueNameInput.value = matchData.select_league?.league_name || '';
    if (teamAInput) teamAInput.value = matchData.select_team_A?.team_name || '';
    if (teamBInput) teamBInput.value = matchData.select_team_B?.team_name || '';
    if (startDateInput) startDateInput.value = matchData.match_start_date || '';

    console.log('Form fields populated');
  }




  function populatePlayerDropdown(players, dropdownId, disabledPlayers) {
    const dropdown = document.getElementById(dropdownId);
    const selectedPlayersDiv = dropdownId === 'dropdown-players-A' ? 'selected-players-A' : 'selected-players-B';
    const selectedPlayers = Array.from(document.getElementById(selectedPlayersDiv).querySelectorAll('.player-option'))
      .map(option => option.dataset.id);
    console.log(selectedPlayers, "plokpoil12345566")
    dropdown.innerHTML = '';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search players...';
    searchInput.className = 'search-input';
    searchInput.addEventListener('input', function (event) {
      filterPlayers(event.target.value, dropdownId, disabledPlayers, selectedPlayers); // Pass disabledPlayers here
    });
    dropdown.appendChild(searchInput);

    const playerContainer = document.createElement('div');
    playerContainer.className = 'player-container';

    const disabledPlayerIds = Array.isArray(disabledPlayers)
      ? disabledPlayers.map(player => String(player.id))
      : [];
    console.log(disabledPlayerIds, "selectedplayers")

    // Filter players to exclude selected and disabled players
    const filteredPlayers = players.filter(player => !selectedPlayers.includes(String(player.id)) && !disabledPlayerIds.includes((player.id)));


    filteredPlayers.forEach((player, index) => {
      if (index < 6) { // Limit to display only the first 6 players
        const playerOption = document.createElement('a');
        playerOption.href = '#';
        playerOption.className = 'player-option';
        playerOption.dataset.id = player.id;
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
          if (!arr.includes(Number(playerId))) {
            arr.push(Number(playerId)); // Convert playerId to a number before pushing
          }


          console.log(arr, "arrr");

          playerOption.remove();

          dropdown.style.display = 'none';
        });
        playerContainer.appendChild(playerOption);
      }
    });

    if (filteredPlayers.length > 6) {
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

        // Check if the player ID is already in the array
        if (!arr.includes(Number(playerId))) {
          arr.push(Number(playerId)); // Convert playerId to a number before pushing
        }


        console.log(arr, "arrr");

        dropdown.style.display = 'none';
      }
    });
  }

  function filterPlayers(searchText, dropdownId, disabledPlayers, selectedPlayers) {
    const dropdown = document.getElementById(dropdownId);
    const players = allPlayers[dropdownId];

    // Extract IDs of selected players and disabled players
    const selectedPlayerIds = Array.from(
      document.querySelectorAll(`#${dropdownId === 'dropdown-players-A' ? 'selected-players-A' : 'selected-players-B'} .player-option`)
    ).map(player => Number(player.dataset.id)); // Ensure IDs are numbers

    const disabledPlayerIds = disabledPlayers.map(player => player.id);

    // Filter out players who are selected, disabled, or don't match the search text
    const filteredPlayers = players.filter(player =>
      !selectedPlayerIds.includes(player.id) &&          // Exclude selected players
      !disabledPlayerIds.includes(player.id) &&          // Exclude disabled players
      player.player_name.toLowerCase().includes(searchText.toLowerCase()) // Match search text
    );

    // Clear dropdown and add filtered players
    dropdown.innerHTML = '';

    // Add search input to dropdown
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search players...';
    searchInput.className = 'search-input';
    searchInput.value = searchText;
    searchInput.addEventListener('input', function (event) {
      filterPlayers(event.target.value, dropdownId, disabledPlayers, selectedPlayers);
    });
    dropdown.appendChild(searchInput);
    searchInput.focus(); // Keep the input field focused

    // Append each filtered player to the dropdown
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

  // document.addEventListener('click', function (event) {
  //   if (event.target.classList.contains('remove-player') || event.target.closest('.remove-player')) {
  //     const parentDiv = event.target.closest('.player-wrapper');
  //     parentDiv.remove();
  //   }

  //   const dropdownA = document.getElementById('dropdown-players-A');
  //   const dropdownB = document.getElementById('dropdown-players-B');

  //   if (!event.target.closest('#dropdown-players-A') && !event.target.closest('#select-player-A')) {
  //     dropdownA.style.display = 'none';
  //   }

  //   if (!event.target.closest('#dropdown-players-B') && !event.target.closest('#select-player-B')) {
  //     dropdownB.style.display = 'none';
  //   }
  // });



  document.addEventListener('click', function (event) {
    // Check if the clicked element is a remove button
    if (event.target.classList.contains('remove-player') || event.target.closest('.remove-player')) {
      const parentDiv = event.target.closest('.player-wrapper');
      const playerId = Number(event.target.dataset.id || event.target.closest('.remove-player').dataset.id); // Convert to number

      // Remove player element from the DOM
      parentDiv.remove();

      // Update arr to remove the playerId
      arr = arr.filter(id => id !== playerId);
      console.log(arr, "Updated arr after removal");
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
          filterPlayers('', 'dropdown-players-A', disablePlayerA, ActivePlayerA); // Reset player list with disabled players
          searchInput.focus();
        }
      }
    }
  });

  // Click event for 'select-player-B'
  document.getElementById('select-player-B').addEventListener('click', function () {
    const dropdown = document.getElementById('dropdown-players-B');
    if (!dropdown.disabled) {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      if (dropdown.style.display === 'block') {
        const searchInput = dropdown.querySelector('.search-input');
        if (searchInput) {
          searchInput.value = ''; // Clear input field
          filterPlayers('', 'dropdown-players-B', disablePlayerB, ActivePlayerB); // Reset player list with disabled players
          searchInput.focus();
        }
      }
    }
  });


  updatePlayerSelectionEnabled();

  // function populatePlayersSelect(players, selectId) {
  //   const selectElement = document.getElementById(selectId);
  //   selectElement.innerHTML = '';

  //   players.forEach(player => {
  //     const option = document.createElement('option');
  //     option.value = player.id; // Assuming 'id' is the player ID
  //     option.textContent = player.player_name;
  //     selectElement.appendChild(option);
  //   });
  // }

  // function filterPlayers(searchTerm, dropdownId) {
  //   const playerContainer = document.getElementById(dropdownId).querySelector('.player-container');
  //   const playerOptions = playerContainer.querySelectorAll('.player-option');

  //   playerOptions.forEach(playerOption => {
  //     if (playerOption.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
  //       playerOption.style.display = 'block';
  //     } else {
  //       playerOption.style.display = 'none';
  //     }
  //   });
  // }


  function checkOverlap(teamA, teamB, startDate1, existingMatches) {
    // console.log(leagueExist, "leagueche");
    const startDate = document.getElementById('match-start-date').value;

    if (!existingMatches || existingMatches.length === 0) {
      return { teamAOverlap: false, teamBOverlap: false, dateOverlap: false };
    }

    // Log team names for debugging
    // const leagueOverlap = existingMatches.some(match => match.select_league.league_name === leagueExist);
    // console.log('league Overlap:', leagueOverlap);

    const teamAOverlap = existingMatches.some(match => match.select_team_A.team_name === teamA || match.select_team_B.team_name === teamA);
    console.log('Team A Overlap:', teamAOverlap);

    const teamBOverlap = existingMatches.some(match => match.select_team_A.team_name === teamB || match.select_team_B.team_name === teamB);
    console.log('Team B Overlap:', teamBOverlap);

    const dateOverlap = existingMatches.some(match => {
      const matchStartDateStr = match.match_start_date;
      const [year, month, day] = matchStartDateStr.split(/[- ]+/); // Assuming date is in "YYYY-MM-DD"
      const matchStartDate = `${year}-${month}-${day}`;

      const [startYear, startMonth, startDay] = startDate.split(/[- ]+/);
      const startDateObj = `${startYear}-${startMonth}-${startDay}`;

      // Check if dates and teams overlap
      const teamsOverlap = (match.select_team_A.team_name === teamA || match.select_team_B.team_name === teamA) ||
        (match.select_team_A.team_name === teamB || match.select_team_B.team_name === teamB);

      return startDateObj === matchStartDate && teamsOverlap;
    });
    console.log('Date and Teams Overlap:', dateOverlap);

    return { teamAOverlap, teamBOverlap, dateOverlap };
  }


  function arraysEqual(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false; // Ensure both are arrays
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }



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
  existingMatches = await myFetch("https://krinik.in/match_get/", "GET");
  console.log(existingMatches, "ok")

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
    // const endDate = document.getElementById('match-end-date');
    const errorSpanStart = document.getElementById('error-match-start-date');
    // const errorSpanEnd = document.getElementById('error-match-end-date');

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
    // const validEndDate = validateDate(endDate, errorSpanEnd);

    return validStartDate
    // && validEndDate;
  }
  function validateForm() {
    const leagueValid = validateLeagueSelection();
    const teamValid = validateTeamSelection();
    const playerValid = validatePlayerSelection();
    const datesValid = validateMatchDates();

    return leagueValid && teamValid && playerValid && datesValid;
  }

  async function submitMatchData(data) {

    // If all data is valid, prepare the payload
    const payload = {
      select_league: data.select_league,
      select_team_A: data.select_team_A,
      select_team_B: data.select_team_B,
      select_player_A: data.select_player_A.map(player => player), // Only IDs
      select_player_B: data.select_player_B.map(player => player), // Only IDs
      match_start_date: data.match_start_date, // Ensure the date is correctly formatted
      player_list: data.player_list
    };

    console.log('Form data before sending:');
    // Log each field of the payload
    Object.keys(payload).forEach(key => {
      console.log(key, payload[key]);
    });

    try {
      const response = await fetch(`https://krinik.in/match_get/${matchId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit match data: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
       window.location.href = "./manage-match.html"
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the match data.');
    }
  }


  const form = document.getElementById('match-form');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log(arr, "submit arr"); // Should reflect updated list after removals

    // Collect form values
    const leagueName = document.getElementById('league-name').value;
    const teamA = document.getElementById('team-A').value;
    const teamB = document.getElementById('team-B').value;
    const startDate = document.getElementById('match-start-date').value;

    // Collect selected players' IDs for Team A and Team B
    const selectedPlayersA = Array.from(document.querySelectorAll('#selected-players-A .player-option'))
      .map(player => Number(player.dataset.id.trim()));
    const selectedPlayersB = Array.from(document.querySelectorAll('#selected-players-B .player-option'))
      .map(player => Number(player.dataset.id.trim()));
    const currentData = {
      match_start_date: startDate,
      select_league: leagueName,
      select_player_A: selectedPlayersA || [],
      select_player_B: selectedPlayersB || [],
      select_team_A: teamA,
      select_team_B: teamB,
      player_list: arr // Updated arr with any removed players excluded
    };


    // console.log(currentData, "current")
    // FormData object to send via fetch
    const overlapResult = checkOverlap(teamA, teamB, startDate, existingMatches);

    // Check if the form is valid
    if (validateForm()) {
      const hasMatchTimeChanged = currentData.match_start_date !== initialData.match_start_date;
      const hasPlayerAChanged = !arraysEqual(currentData.select_player_A, initialData.select_player_A);
      const hasPlayerBChanged = !arraysEqual(currentData.select_player_B, initialData.select_player_B);

      if ( hasPlayerAChanged || hasPlayerBChanged) {
        if (confirm("Are you sure you want to edit it?")) {
            await submitMatchData(currentData); // Submit updated data
            console.log(currentData, "currentData");
          }
      }
        else if(hasMatchTimeChanged ) {
         
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
        }else{
          if (confirm("Are you sure you want to edit it?")) {
            await submitMatchData(currentData); // Submit updated data
            console.log(currentData, "currentData");
          }
        }
        
      } else {
        if (confirm("Are you sure you want to edit it?")) {
          await submitMatchData(initialData);
          console.log(initialData, "initialData");
        }
        
      }
    
      // Proceed with form submission if there are no overlap errors
     
      
    } else {
      console.log('Form validation failed. Please check all fields.');
    }

  });


  window.onload = checkAdminAccess();
})
