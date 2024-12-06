import {getAdminType}  from "../js/initial.js"

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const userUnlockText = document.getElementById("user-unlock-text");


const walletAmount = document.getElementById("wallet-amount");
const bonusAmount = document.getElementById("bonus-amount");

  async function fetchUserData() {
    try {
      if (!id) {
        console.warn("No player ID found in URL.");
        return;
      }

      const url = `https://krinik.in/user_get/${id}/`;
      console.log("Fetching player data from:", url);

     

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch player data");
      }

      const userData1 = await response.json();
      const userData = userData1.data;
      userScratchData = userData.scrach_list.map(p=>p.value.id);

      // const userData5 = userData.user_id;

      console.log(userScratchData, "id che nathi");
      editPlayerData(userData);
      
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  }



  function editPlayerData(response) {
    const userFullName = document.getElementById("user-fullname");
    const userImageView = document.getElementById("user-image-view");
    const userMob = document.getElementById("user-mob");
    const userEmail = document.getElementById("user-email");
    const regTime = document.getElementById("reg-time");
   
    const referAmount = document.getElementById("refer-amount");
    const userUnlock = document.getElementById("user-unlock-text");
    const userDelete = document.getElementById("user-delete");
    const userTransactionHistory = document.getElementById(
      "user-transaction-history"
    );
    // const userDeduction = document.getElementById("user-deduction");
    // const userAddAmount = document.getElementById("user-add-amount");
    const userScratch = document.getElementById("user-scratch-gift");

    const userGameHistory = document.getElementById("user-game-history");
    const userWithdraw = document.getElementById("user-withdraw");
    let mainId

    if (response) {
      // Update image source
      userImageView.src = `https://krinik.in${response.image}`;

      // Set form field values
      userFullName.textContent = response.name;
      userMob.textContent = `+${response.mobile_no}`;
      userEmail.textContent = response.email;
      regTime.textContent = response.date_time;
      walletAmount.textContent = response.wallet_amount;
      bonusAmount.textContent = response.bonus_amount;
      referAmount.textContent = response.referral_amount;
      userUnlock.textContent = toCapitalizeCase(response.status);

      // Update button states based on userUnlock text
      if (userUnlock.textContent === "Unblock") {
        disableButton(userDelete);
        disableButton(userTransactionHistory);
        // disableButton(userDeduction);
        // disableButton(userAddAmount);
        disableButton(userScratch);

        disableButton(userGameHistory);
        disableButton(userWithdraw);
      } else if (userUnlock.textContent === "Block") {
        enableButton(userDelete);
        enableButton(userScratch);
        enableButton(userTransactionHistory);
        // enableButton(userDeduction);
        // enableButton(userAddAmount);
        enableButton(userGameHistory);
        enableButton(userWithdraw);
      }
      if (isSuperAdmin && isStatusTrue) {
    disableButton(userTransactionHistory);
        // disableButton(userDeduction);
        // disableButton(userAddAmount);
        disableButton(userScratch);

        disableButton(userGameHistory);
        disableButton(userWithdraw);

      }

      console.log(userFullName.textContent);
    } else {
      console.error("Data is not in the expected format:", response);
    }
  }


  function toCapitalizeCase(str) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }
 
//   function redirectToHistoryPage(page) {
//     const urlParams = new URLSearchParams(window.location.search);
//     const name = urlParams.get("name");

//     if (id) {
//       window.location.href = `${page}.html?id=${id}`;
//     } else {
//       console.error("No player ID found in URL.");
//     }
//   }

  fetchUserData();
  window.onload = checkAdminAccess();
});
