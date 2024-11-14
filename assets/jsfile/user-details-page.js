document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const userUnlockText = document.getElementById("user-unlock-text");
let userScratchData
  console.log(id);

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
      userScratchData = userData1.data.scrach_list.map(p=>p.id);

      const userData5 = userData.user_id;

      console.log(userScratchData, "id che nathi");
      editPlayerData(userData);
      // const newAmounts = await addAmount(userData5);
      //  console.log(newAmounts ,"id che")
      // if (newAmounts) {
      //   document.getElementById("wallet-amount").textContent =
      //     newAmounts.totalPlayCoin;
      //   document.getElementById("winning-amount").textContent =
      //     newAmounts.totalWinningCoin;
      // }
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  }
  async function handleDeleteUser(id) {
    
    if (confirm('Are you sure you want to delete this user?')) {
      const url = `https://krinik.in/user_get/${id}/`;
      try {
        const response = await fetch(url, { method: "DELETE" });
  
        if (response.ok) {
          fetchUserData();
          window.location.href = "user.html"
        } else {
          console.error("Failed to delete the league");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  }
  async function lock() {
    const userUnlockText = document.getElementById("user-unlock-text");

    if (!userUnlockText) {
      console.error("Element with ID user-unlock-text not found");
      return;
    }

    const currentState = userUnlockText.textContent.toLowerCase();
    const newState = currentState === "block" ? "unblock" : "block";

    // Update the text content
    userUnlockText.textContent = toCapitalizeCase(newState);

    // Send PATCH request to update the state on the server
    try {
      const url = `https://krinik.in/user_get/${id}/`; // Updated URL
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newState }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      console.log(`User status updated to: ${newState}`);
      // Refresh user data to reflect changes
      fetchUserData();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  }

  async function assignRandomCouponToUser(userId) {
    const coupon = await getRandomCoupon();
    console.log(coupon,"coupon")
    if (coupon) {
        await assignCouponToUser(userId, coupon);
    } else {
        console.error('No coupon available to assign.');
    }
}

async function getRandomCoupon() {
  try {
      const response = await fetch('https://krinik.in/scratch_coupon_get/');
      const result = await response.json();

      if (result.status === 'success' && result.data.length > 0) {
          // Get the list of ids from the data
          const ids = result.data.map(item => item.id);

          // Generate a random index from the ids array
          const randomIndex = Math.floor(Math.random() * ids.length);

          const randomId = ids[randomIndex];  // Get the random ID
          
          // Find the coupon object with the random ID
          // const coupon = result.data.find(item => item.id === randomId);
          // console.log(coupon,"cou")
          console.log(randomId);  // Log to verify the random ID
          return randomId;  // Return the coupon with the random ID
      }
  } catch (error) {
      console.error('Error fetching scratch coupons:', error);
  }
}



async function assignCouponToUser(userId, newCoupon) {
  const userEndpoint = `https://krinik.in/user_get/${userId}/`;

  try {
     
      // Step 3: Add the new coupon to the existing scrach_list
       userScratchData.push(newCoupon);
      
      // Step 4: Prepare the PATCH request data with the updated scratch list
      const patchData = {
          scrach_list: userScratchData
      };

      // Step 5: Send the PATCH request to update the user's scrach_list
      const response = await fetch(userEndpoint, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(patchData)
      });

      if (response.ok) {
          alert('Scratch Coupon assigned successfully!');
          console.log('Coupon assigned successfully!');
          const updatedUserData = await response.json();
          console.log("Updated User Data:", updatedUserData);  // log updated user data for verification
      } else {
          console.error('Failed to assign coupon:', response.statusText);
      }
  } catch (error) {
      console.error('Error assigning coupon:', error);
  }
}




  function editPlayerData(response) {
    const userFullName = document.getElementById("user-fullname");
    const userImageView = document.getElementById("user-image-view");
    const userMob = document.getElementById("user-mob");
    const userEmail = document.getElementById("user-email");
    const regTime = document.getElementById("reg-time");
    const walletAmount = document.getElementById("wallet-amount");
    const bonusAmount = document.getElementById("bonus-amount");
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
      userMob.textContent = response.mobile_no;
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

      console.log(userFullName.textContent);
    } else {
      console.error("Data is not in the expected format:", response);
    }
  }

  // async function addAmount(response1) {
  //   if (!id) {
  //     console.warn("No player ID found in URL.");
  //     return;
  //   }
  
  //   try {
  //     const url = `https://krinik.in/add_wallet/`;
  //     console.log("Fetching player data from:", url);
  
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch player data");
  //     }
  
  //     const addAmount1 = await response.json();
  //     const addAmount = addAmount1.data;
  
  //     // Find matching data
  //     const matchingData = addAmount ? addAmount.find((item) => item.user_id == response1) : null;
  
  //     if (!matchingData) {
  //       console.warn("No matching data found for player ID:", response1);
  //       return;
  //     }
  
  //     // Set global mainId if matchingData is found
  //     const mainId = matchingData.id;
  //     console.log(matchingData, "data");
  
  //     // Get DOM elements for updating
  //     const playerId = document.getElementById("playerid");
  //     const playerName = document.getElementById("player-name");
  //     const playerTotalAmount = document.getElementById("player-total-amount");
  //     const playerTotalWinning = document.getElementById("player-total-winning");
  //     const playerAddAmount = document.getElementById("player-add-amount");
  //     const playerWinningAmount = document.getElementById("player-winning-amount");
  //     const playerId1 = document.getElementById("playerid1");
  //     const playerName1 = document.getElementById("player-name1");
  //     const playerTotalAmount1 = document.getElementById("player-total-amount1");
  //     const playerTotalWinning1 = document.getElementById("player-total-winning1");
  //     const playerDeductAmount = document.getElementById("deductAmountInPlay");
  //     const playerWinningAmount1 = document.getElementById("deductAmountInWinning");
  
  //     // Populate fields if matchingData exists
  //     playerId.value = matchingData.user_id;
  //     playerName.value = matchingData.user_name;
  //     playerTotalAmount.value = matchingData.Total_Play_Coin;
  //     playerTotalWinning.value = matchingData.Total_Winning_Coin;
  //     playerId1.value = matchingData.user_id;
  //     playerName1.value = matchingData.user_name;
  //     playerTotalAmount1.value = matchingData.Total_Play_Coin;
  //     playerTotalWinning1.value = matchingData.Total_Winning_Coin;
  
  //     // Clear input fields for new amounts
  //     playerAddAmount.value = "";
  //     playerWinningAmount.value = "";
  //     playerDeductAmount.value = "";
  //     playerWinningAmount1.value = "";
  
  //     // Store matching data globally or within a closure
  //     window.currentMatchingData = matchingData;
  
  //     return {
  //       totalPlayCoin: matchingData.Total_Play_Coin,
  //       totalWinningCoin: matchingData.Total_Winning_Coin,
  //     };
  //   } catch (error) {
  //     console.error("Error fetching player data:", error);
  //   }
  // }
  

  // Event listener for the Submit button in the Add Amount modal
  // document.querySelector("#addSubmit").addEventListener("click", async () => {
  //   const matchingData = window.currentMatchingData;
  //   const playerTotalAmount = document.getElementById(
  //     "player-total-amount"
  //   ).value;
  //   const playerTotalWinning = document.getElementById(
  //     "player-total-winning"
  //   ).value;
  //   const playerAddAmount = document.getElementById("player-add-amount").value;
  //   const playerWinningAmount = document.getElementById(
  //     "player-winning-amount"
  //   ).value;

  //   if (!matchingData) {
  //     console.error("No matching data found for submission.");
  //     return;
  //   }

  //   const amount1 =
  //     parseFloat(playerTotalAmount) + parseFloat(playerAddAmount || 0);
  //   const amount2 =
  //     parseFloat(playerTotalWinning) + parseFloat(playerWinningAmount || 0);

  //   const matchUrl = `https://krinik.in/add_wallet/${mainId}/`;

  //   try {
  //     const patchResponse = await fetch(matchUrl, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         Total_Play_Coin: amount1,
  //         Total_Winning_Coin: amount2,
  //       }),
  //     });

  //     if (!patchResponse.ok) {
  //       throw new Error("Failed to update player amounts");
  //     }

  //     console.log("Player amounts updated successfully");
  //     // Optionally, refresh the data to reflect the changes
  //     fetchUserData();
  //   } catch (error) {
  //     console.error("Error updating player amounts:", error);
  //   }
  // });

  // document.querySelector("#deductAmount").addEventListener("click", async () => {
  //     const matchingData = window.currentMatchingData;
  //     const playerTotalAmount = document.getElementById(
  //       "player-total-amount"
  //     ).value;
  //     const playerTotalWinning = document.getElementById(
  //       "player-total-winning"
  //     ).value;
  //     const playerDeductAmount =
  //       document.getElementById("deductAmountInPlay").value;
  //     const playerWinningAmount1 = document.getElementById("deductAmountInWinning").value;

  //     if (!matchingData) {
  //       console.error("No matching data found for submission.");
  //       return;
  //     }

  //     const amount1 =
  //       parseFloat(playerTotalAmount) - parseFloat(playerDeductAmount || 0);
  //     const amount2 =
  //       parseFloat(playerTotalWinning) - parseFloat(playerWinningAmount1 || 0);

  //     const matchUrl = `https://krinik.in/add_wallet/${mainId}/`;

  //     try {
  //       const patchResponse = await fetch(matchUrl, {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           Total_Play_Coin: amount1,
  //           Total_Winning_Coin: amount2,
  //         }),
  //       });

  //       if (!patchResponse.ok) {
  //         throw new Error("Failed to update player amounts");
  //       }

  //       console.log("Player amounts updated successfully");
  //       // Optionally, refresh the data to reflect the changes
  //       fetchUserData();
  //     } catch (error) {
  //       console.error("Error updating player amounts:", error);
  //     }
  //   });

  function disableButton(button) {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
    button.style.pointerEvents = "none"; // Prevent interaction
  }

  function enableButton(button) {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
    button.style.pointerEvents = "auto"; // Allow interaction
  }
  function toCapitalizeCase(str) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  function redirectToHistoryPage(page) {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");

    if (id) {
      window.location.href = `${page}.html?id=${id}`;
    } else {
      console.error("No player ID found in URL.");
    }
  }
  document
    .getElementById("user-unlock")
    .addEventListener("click", () => lock());
    document
    .getElementById("user-delete")
    .addEventListener("click", () => handleDeleteUser(id));
  // Event handlers for buttons
  document
    .getElementById("user-transaction-history")
    .addEventListener("click", () =>
      redirectToHistoryPage("user-transaction-history")
    );
    document
    .getElementById("user-scratch-gift")
    .addEventListener("click", () => assignRandomCouponToUser(id));
  document
    .getElementById("user-game-history")
    .addEventListener("click", () =>
      redirectToHistoryPage("user-pool-history")
    );
  document
    .getElementById("user-withdraw")
    .addEventListener("click", () =>
      redirectToHistoryPage("user-withdraw-history")
    );

  //   document.getElementById('addSubmit').onclick = function(e) {
  //     // Setup the options for Razorpay payment
  //     var options = {
  //         "key": "rzp_test_bilBagOBVTi4lE", // Your API Key from Razorpay Dashboard
  //         "amount": 50000, // Amount in paise (₹500 = 50000 paise)
  //         "currency": "INR", // Currency type (INR for Indian Rupees)
  //         "name": "Your Business Name", // Your business name
  //         "description": "Payment for XYZ Service", // A description for the transaction
  //         "image": "https://example.com/your-logo.png", // Your logo (optional)
  //         "handler": function (response){
  //             // This function is called when the payment is successful
  //             alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
              
  //             // Here you can handle what happens after payment, like sending payment ID to your server
  //             console.log(response);
  //         },
  //         "prefill": {
  //             "name": "John Doe", // Prefilled name of the customer
  //             "email": "john@example.com", // Prefilled email of the customer
  //             "contact": "9999999999" // Prefilled contact number
  //         },
  //         "theme": {
  //             "color": "#F37254" // Theme color of the Razorpay checkout
  //         }
  //     };

  //     // Create a new Razorpay instance with the options defined above
  //     var rzp1 = new Razorpay(options);

  //     // Open the Razorpay checkout popup
  //     rzp1.open();

  //     // Prevent the form from submitting (optional, since we're not using a form here)
  //     e.preventDefault();
  // }

  fetchUserData();
});
