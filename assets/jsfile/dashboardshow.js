let todaysUserCount;
let totalUserCount;

async function fetchData() {
  try {
    const data = await $.ajax({
      url: "https://krinik.in/user_get/",
      method: "GET",
    });

    if (data && data.status === "success") {
      const rankList = data.data;

      // Get today's date in "YYYY-MM-DD" format
      const today = new Date().toISOString().split("T")[0];

      // Filter today's users based on `date_time` field
      const todaysUsers = rankList.filter(user => user.date_time.startsWith(today));
      // Sort rankList by `date_time` in descending order (most recent first)
      const recentUsers = [...rankList].sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
      
      console.log(recentUsers)
      // Display counts
      todaysUserCount = todaysUsers.length;
      totalUserCount = rankList.length;

      // Render cards and table
      renderCards();
      renderRecentUsersTable(recentUsers);
    } else {
      console.error("Error: Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

function renderCards() {
  const cardData = [
    { title: "Todays Register User", value: todaysUserCount || 0 },
    { title: "Total Register User", value: totalUserCount || 0 },
    { title: "Total Credits", value: 200 },
    { title: "Total Debits", value: 200 },
    { title: "Total Wallet Amount", value: 200 },
    { title: "Total Transaction", value: 200 },
  ];

  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = ''; // Clear existing cards, if any

  cardData.forEach(card => {
    const cardHTML = createCard(card.title, card.value, false); // Assume `false` for `isAdmin`
    cardContainer.innerHTML += cardHTML;
  });
}

function renderRecentUsersTable(recentUsers) {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = ''; // Clear existing rows, if any

  recentUsers.forEach((user, index) => {
    const rowHTML = createRow({
      regNo: index + 1,
      regName: user.name || "N/A",
      regMobile: user.mobile_no || "N/A",
      // depNo: "N/A", // Update based on your data structure
      // depMobile: "N/A", // Update based on your data structure
      // depAmount: "N/A", // Update based on your data structure
      // depStatus: "N/A", // Update based on your data structure
      // withNo: "N/A", // Update based on your data structure
      // withMobile: "N/A", // Update based on your data structure
      // withAmount: "N/A", // Update based on your data structure
      // withStatus: "N/A", // Update based on your data structure
    }, false);
    tableBody.innerHTML += rowHTML;
  });
}

function createCard(title, value, isAdmin) {
  const extraClass = isAdmin ? 'blur' : ''; // Add 'blur' if it's super admin
  return `
    <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-1">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-12">
              <h5 class="text-center">${title}</h5>
              <div class="mt-2 d-flex align-items-center justify-content-center">
                <span href="#" class="btn btn-primary btn-sm data-padding btn-font ${extraClass}">${value}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createRow(data, isAdmin) {
  const rowClass = isAdmin ? 'blur' : ''; // Add 'blur' if it's super admin
  return `
    <tr class="${rowClass}">
      <td>${data.regNo}</td>
      <td>${data.regName}</td>
      <td>${data.regMobile}</td>
     
    </tr>
  `;
}

// Fetch data on page load
fetchData();




const style = document.createElement('style');
style.innerHTML = `
  .blur {
    filter: blur(4px);
  }
`;
document.head.appendChild(style);


 // <td>${data.depNo}</td>
      // <td>${data.depMobile}</td>
      // <td>${data.depAmount}</td>
      // <td class="status">${data.depStatus}</td>
      // <td>${data.withNo}</td>
      // <td>${data.withMobile}</td>
      // <td>${data.withAmount}</td>
      // <td class="status">${data.withStatus}</td>