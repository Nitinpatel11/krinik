import {checkAdminAccess}  from "../js/initial.js"
  document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  console.log(id);

  let rankList = [];
  let current_index = 1;
  const table_size = 10;
  let array = [];
  let array_length = 0;
  let start_index = 1;
  let end_index = 0;
  let max_index = 0;
  let userId = null;

  async function fetchUserData() {
    try {
      if (!id) {
        console.warn('No player ID found in URL.');
        return;
      }

      const url = `https://krinik.in/user_get/${id}/`;
      console.log('Fetching player data from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }

      const userData1 = await response.json();
      const userData = userData1.data;
      userId = userData.id;

      console.log(userData, "data");
      fetchData(userId);
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  }

  async function fetchData(userId) {
    try {
      const response = await fetch(`https://krinik.in/user_pool_history_get/`);
      if (!response.ok) {
        throw new Error('Failed to fetch pool history data');
      }

      const data = await response.json();

      if (data && data.status === "success" && data.data) {
        array = data.data;
        console.log(array, "arr");

        // Filter and log matching data
        const matchingData = array.filter(item => item.user_data.id === userId);
        if (matchingData.length > 0) {
          console.log('Matching data found:', matchingData);
        } else {
          console.log('No matching data found.');
        }

        rankList = matchingData;
        filterAndDisplay();
      } else {
        console.error("Error: Invalid data format or ID mismatch");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  function filterAndDisplay() {
    filterRankList();
    preLoadCalculations();
    displayIndexButtons();
    displayTableRows();
    highlightIndexButton();
  }

  function preLoadCalculations() {
    array_length = rankList.length;
    max_index = Math.ceil(array_length / table_size);
  }
  $(document).ready(function () {
      const $dropdownBtn3 = $('#dropdownBtn3');
  const $dropdownContent3 = $('#dropdownContent3');
  const $selectedStatus = $('#selectedStatus');
  const $arrow = $('#arrowBar'); // Ensure this selector matches your HTML
  const $clearStatus = $('#clearStatus');

  function toggleDropdown() {
    const isExpanded = $dropdownContent3.toggleClass('show').hasClass('show');
    $dropdownBtn3.attr('aria-expanded', isExpanded);
  }

  // Click event for the selected status element to toggle the dropdown
  $selectedStatus.on('click', function() {
    toggleDropdown();
  });

  // Click event for the arrow to toggle the dropdown
  $arrow.on('click', function() {
    toggleDropdown();
  });

  // Click event for selecting an item from the dropdown
  $dropdownContent3.on('click', 'a', function() {
    const selectedValue = $(this).data('value');
    $selectedStatus.text(selectedValue).data('value', selectedValue);
    $dropdownContent3.removeClass('show');

    if (selectedValue === 'All Status') {
      $arrow.show();
      $clearStatus.hide();
    } else {
      $arrow.hide();
      $clearStatus.show();
    }
    filterRankList(); // Filter based on the selected status
  });

  // Click event for clearing the selected status
  $clearStatus.on('click', function() {
    $selectedStatus.text('All Status').data('value', 'All Status');
    $arrow.show();
    $clearStatus.hide();
    $dropdownContent3.removeClass('show'); // Hide the dropdown content
    $dropdownBtn3.attr('aria-expanded', 'false'); // Ensure dropdown button is collapsed
    filterRankList(); // Filter with the reset status
  });

  // Click event for closing the dropdown if clicked outside
  $(document).on('click', function(event) {
    if (!$selectedStatus.is(event.target) && !$selectedStatus.has(event.target).length && !$dropdownContent3.has(event.target).length && !$arrow.is(event.target) && !$clearStatus.is(event.target)) {
      $dropdownContent3.removeClass('show');
      $dropdownBtn3.attr('aria-expanded', 'false');
    }
  });



      // Initialize Flatpickr
      let picker = flatpickr('#rangePicker', {
        mode: 'range',
        dateFormat: 'd-m-Y',
        onClose: function (selectedDates, dateStr, instance) {
          if (!selectedDates || selectedDates.length === 0) {
            instance.clear();
            $('#rangePicker').text('Start & End Date').removeClass('has-dates');
            $('#clearDates').hide();
            $('#calendarIcon').show();
          } else {
            $('#rangePicker').text(selectedDates.map(date => instance.formatDate(date, 'd-m-Y')).join(' - ')).addClass('has-dates');
            $('#clearDates').show();
            $('#calendarIcon').hide();
          }
          filterRankList();
        },
        clickOpens: false,
        allowInput: false
      });

      $('#rangePicker, #calendarIcon').click(function () {
        if (!$('#rangePicker').hasClass('has-dates')) {
          picker.open();
        }
      });

      $('#clearDates').click(function () {
        picker.clear();
        $('#rangePicker').text('Start & End Date').removeClass('has-dates');
        $('#clearDates').hide();
        $('#calendarIcon').show();
        filterRankList();
      });

      function updateAmountFilters() {
    const startAmount = $('#startAmountRange').val().trim();
    const endAmount = $('#endAmountRange').val().trim();

    // Show or hide clear buttons based on input values
    if (startAmount !== '' && endAmount === '') {
      $('#clearAmountStart').show();
      $('#clearAmountEnd').hide();
    } else if (startAmount !== '' && endAmount !== '') {
      $('#clearAmountStart').show();
      $('#clearAmountEnd').show();
    } else if (startAmount === '' && endAmount === '') {
      $('#clearAmountStart').hide();
      $('#clearAmountEnd').hide();
    } else if (startAmount === '' && endAmount !== '') {
      $('#clearAmountStart').hide();
      $('#clearAmountEnd').show();
    }

    // Always call filterRankList to apply the filter
    filterRankList();
  }

  $('#startAmountRange').on('input', function () {
    updateAmountFilters();
  });

  // Event listeners for the end amount range input
  $('#endAmountRange').on('input', function () {
    updateAmountFilters();
  });

  // Event listener for clearing the start amount range
  $('#clearAmountStart').click(function () {
    $('#startAmountRange').val('');
    updateAmountFilters(); // Call the update function to handle the UI changes
  });

  // Event listener for clearing the end amount range
  $('#clearAmountEnd').click(function () {
    $('#endAmountRange').val('');
    updateAmountFilters(); // Call the update function to handle the UI changes
  });

  // Initial call to update filters and hide/show clear buttons on page load
  updateAmountFilters();
  $('#tab_filter_text').on('input', function () {
    filterRankList();
  });
    });

  function filterRankList() {
    var tab_filter_text = $("#tab_filter_text").val().toLowerCase().trim();
    var datefilter = $('#rangePicker').text().trim();
    const statusFilter = $("#selectedStatus").data('value') || '';
    console.log(statusFilter,"oklp1")
    let startDate, endDate;

    var startAmount = parseFloat($('#startAmountRange').val().trim()) || -Infinity;
    var endAmount = parseFloat($('#endAmountRange').val().trim()) || Infinity;

    if (datefilter !== '' && datefilter !== 'Start & End Date') {
        var dates = datefilter.split(' - ');
        startDate = moment(dates[0], 'D-M-YYYY').startOf('day').toDate();
        endDate = moment(dates[1], 'D-M-YYYY').endOf('day').toDate();
   
      }
    const filteredArray = rankList.filter(object => {
      var matchesText = true, matchesStatus = true, matchesDate = true, matchesAmount = true;
      if (tab_filter_text !== '') {
     return matchesText = (object.match.select_league.league_name && object.match.select_league.league_name.toLowerCase().includes(tab_filter_text)) ||
        (object.pool_name.pool_name && object.pool_name.pool_name.toLowerCase().includes(tab_filter_text)) ||
        (object.pool_type && object.pool_type.toLowerCase().includes(tab_filter_text));

      }
      //   if (statusFilter !== 'All Status') {
      //   const status = getStatus((object.status).toLowerCase())
      //   console.log(status,"okli")
      //   matchesStatus = (status === statusFilter.toLowerCase( ));
      //   // console.log(matchesStatus ,"okli")
      // }
      let status = object.status.toLowerCase();
    let statusup = "";
    if (status === "success") {
      statusup = "win";
    } else if (status === "fail") {
      statusup = "lose";
    }

    // Filter based on status dropdown
    if (statusFilter !== 'All Status') {
      matchesStatus = (statusup === statusFilter.toLowerCase());
    }

      if (startDate && endDate) {
          const objectDate = moment(object.date_time, 'YYYY-MM-DD HH:mm:ss').toDate();
          matchesDate = (objectDate >= startDate && objectDate <= endDate);
          // console.log('Object Date:', objectDate, 'Matches Date:', matchesDate);
        }

         if (!isNaN(object.entry_fee)) {
          const amount = parseFloat(object.entry_fee);
          matchesAmount = (amount >= startAmount && amount <= endAmount);
          // console.log('Object Amount:', amount, 'Matches Amount:', matchesAmount);
        }
        if (!isNaN(object.winning_amount)) {
          const amount = parseFloat(object.winning_amount);
          matchesAmount = (amount >= startAmount && amount <= endAmount);
          // console.log('Object Amount:', amount, 'Matches Amount:', matchesAmount);
        }

      return matchesText && matchesStatus && matchesDate && matchesAmount ;
    });

    array = filteredArray;
    preLoadCalculations();
    current_index = 1;
    displayIndexButtons();
    highlightIndexButton();
    displayTableRows();
  }

  // function getStatus(start_date, end_date) {
  //   const currentDate = new Date();
  //   const startDate = moment(start_date, "DD/MM/YYYY").toDate();
  //   const endDate = moment(end_date, "DD/MM/YYYY").toDate();

  //   if (startDate < currentDate && currentDate <= endDate) {
  //     return "Running";
  //   } else if (startDate < currentDate && endDate < currentDate) {
  //     return "Completed";
  //   } else if (startDate > currentDate && endDate > currentDate) {
  //     return "Upcoming";
  //   } else {
  //     return "unknown";
  //   }
  // }
  function getStatus(status) {
      if (status === "success" || status === "Success") {
        return `<span  style="color:green;font-weight:900">Win</span>`;
      } else if (status === "fail" || status === "Fail") {
        return `<span "style="color:red;font-weight:900">Lose</span>`;
      } else {
        return "unknown";
      }
    }

  function displayIndexButtons() {
    const $indexButtons = $(".index_buttons ul");
    $indexButtons.empty();

    if (array_length <= table_size) return;

    if (current_index > 1) {
      $indexButtons.append('<li><button class="paginate_button page-item previous" onclick="prev()">Previous</button></li>');
    }

    const show_page = getElidedPageRange(current_index, max_index);

    show_page.forEach(i => {
      if (i === current_index) {
        $indexButtons.append(`<li><button class="paginate_button page-item active">${i}</button></li>`);
      } else if (i === "...") {
        $indexButtons.append('<li><button class="paginate_button page-item">...</button></li>');
      } else {
        $indexButtons.append(`<li><button class="paginate_button page-item" onclick="indexPagination(${i})">${i}</button></li>`);
      }
    });

    if (current_index < max_index) {
      $indexButtons.append('<li><button class="paginate_button page-item next" onclick="next()">Next</button></li>');
    }

    highlightIndexButton();
  }

  function getElidedPageRange(current, total) {
    const delta = 1;
    const range = [];
    const left = current - delta;
    const right = current + delta + 1;
    let last = 0;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= left && i < right)) {
        if (last + 1 !== i) {
          range.push("...");
        }
        range.push(i);
        last = i;
      }
    }

    return range;
  }

  function highlightIndexButton() {
    start_index = (current_index - 1) * table_size + 1;
    end_index = Math.min(start_index + table_size - 1, array_length);
    $("#datatable_info").text(`Showing ${start_index} to ${end_index} of ${array_length} items`);
    $(".index_buttons ul a").removeClass("active");
    $(`.index_buttons ul a:contains(${current_index})`).addClass("active");
    displayTableRows();
  }

  function prev() {
    if (current_index > 1) {
      current_index--;
      displayIndexButtons();
      highlightIndexButton();
    }
  }

  function next() {
    if (current_index < max_index) {
      current_index++;
      displayIndexButtons();
      highlightIndexButton();
    }
  }

  function indexPagination(index) {
    current_index = index;
    displayIndexButtons();
    highlightIndexButton();
  }

  function displayTableRows() {
    const $tableBody = $("table tbody");
    $tableBody.empty();

    const tab_start = start_index - 1;
    const tab_end = end_index;

    if (array.length === 0) {
      $("#noDataFound").show();
      $("#pagination").hide();
      $("#table-scrolling").css("overflow-x", "hidden");
      return;
    } else {
      $("#noDataFound").hide();
      $("#pagination").show();
      $("#table-scrolling").css("overflow-x", "auto");
    }

    

    for (let i = tab_start; i < tab_end; i++) {
      const showdata = array[i];
      var status = getStatus(showdata["status"]);
   
      var tr = $("<tr></tr>");

        var noCell = $("<td></td>").text(i + 1);
        var poolNameCell = $("<td colspan='3'></td>").text(showdata.pool_name["pool_name"] || "");
        var poolTypeCell = $("<td colspan='2'></td>").text(showdata["pool_type"] || "");
        var leagueNameCell = $("<td colspan='3'></td>").text(showdata.match.select_league["league_name"] || "");
        var bidAmountCell = $("<td colspan='3'></td>").text(showdata["winning_amount"] || "");
        var statusCell = $("<td colspan='2'></td>").html(status);
        var entryFeeCell = $("<td colspan='3'></td>").text(showdata["entry_fee"] || "");
        var dateCell = $("<td colspan='2'></td>").text(moment(showdata["date"], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss'));
        tr.append(noCell)
          .append(poolNameCell)
          .append(poolTypeCell)
          .append(leagueNameCell)
          .append(bidAmountCell)
          .append(statusCell)
          .append(entryFeeCell)
          .append(dateCell)



          // .append(logoCell)


          $("table tbody").append(tr);
    }

  }

  function createCell(text, type = 1) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
  }

  fetchUserData();
  window.onload = checkAdminAccess();
});
