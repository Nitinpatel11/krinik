import {checkAdminAccess,sendNotification}  from "../js/initial.js"

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const user_id = urlParams.get("user_id");

    let updateWinning = 0;
     
    let userData5
    const Approvebtn = document.getElementById("Approvebtn");
    const Rejectbtn = document.getElementById("Rejectbtn");

    const userFullName = document.getElementById("user-fullname");
    const userImageView = document.getElementById("user-image-view");
    const userMob = document.getElementById("user-mob");
    const userEmail = document.getElementById("user-email");

    const depositAmount = document.getElementById("deposit-amount");
    const bonusAmount = document.getElementById("bonus-amount");
    const referAmount = document.getElementById("refer-amount");
    const winningAmount = document.getElementById("winning-amount");
    const totalAmount = document.getElementById("total-amount");
    const withdrawAmount = document.getElementById("withdraw-amount");
    const giftBonusButton = document.getElementById("gift-bonus-btn");
    
    const defaultBonusBtn = document.getElementById('defaultBonusBtn');
  const manualBonusInput = document.getElementById('manualBonusInput');
  const giftBonusForm = document.getElementById('gift-bonus-form');
  const giftBonusModal = document.getElementById('giftBonusModal');
  
  // When "Default Bonus" is clicked, set the value in the input field
  defaultBonusBtn.addEventListener('click', function() {    
    manualBonusInput.value = 1000; // Set the input value to 1000
  });

  // Prevent the modal from closing when the form is submitted and close it manually
  giftBonusForm.addEventListener('submit',async function(e) {
    e.preventDefault(); // Prevent the form from submitting normally
    // Close the modal after submitting the form
    if (confirm("Are you sure you want to approve it?")) {
        const currentWalletAmount = parseFloat(totalAmount.textContent);
        console.log(currentWalletAmount,"currentWalletAmount")
        const newWalletAmount1 = currentWalletAmount - parseFloat(withdrawAmount.textContent) ;
        console.log(newWalletAmount1,'new che')
        const newWalletAmount = Number(newWalletAmount1) + Number(manualBonusInput.value)
        console.log(newWalletAmount,"newWalletAmount")
        const bonusAddAmount = parseFloat(bonusAmount.textContent) + Number(manualBonusInput.value)
        
        console.log(bonusAddAmount,"bonusAddAmount")

        await patchData(updateWinning, 0, newWalletAmount,bonusAddAmount);
    }


    const modal = new bootstrap.Modal(giftBonusModal);
    modal.hide();
    // Optionally, you can handle the bonus submission here
    console.log('Bonus submitted:', manualBonusInput.value);
  });

    async function fetchUserData() {
        try {
            if (!user_id) {
                console.warn("No player ID found in URL.");
                return;
            }

            const url = `https://krinik.in/user_get/${user_id}/`;
            const url1 = `https://krinik.in/withdraw_amount_get/user_id/${user_id}/id/${id}/`;
            console.log("Fetching player data from:", url);
            console.log("Fetching withdrawal data from:", url1);

            const [response, response1] = await Promise.all([fetch(url), fetch(url1)]);

            if (!response.ok || !response1.ok) {
                throw new Error("Failed to fetch data");
            }

            const userData1 = await response.json();
            const userData2 = await response1.json();

            const userData = userData1.data;
            const userData3 = userData2.data;
            userData5 = Number(userData3.amount);

             if (userData5 === 0) {
                Approvebtn.disabled = true;
                Approvebtn.style.pointerEvents = "none";
                Rejectbtn.disabled = true;
                Rejectbtn.style.pointerEvents = "none";
            } else {
                Approvebtn.disabled = false;
                Rejectbtn.disabled = false;

                // Approvebtn.style.pointerEvents = "auto";
            }
            editPlayerData(userData, userData5);
        } catch (error) {
            console.error("Error fetching player data:", error);
        }
    }

    function editPlayerData(response, amount) {
        if (response) {
            userImageView.src = `https://krinik.in${response.image}`;
            userFullName.textContent = response.name;
            userMob.textContent = response.mobile_no;
            userEmail.textContent = response.email;
            depositAmount.textContent = response.deposit_amount;
            bonusAmount.textContent = response.bonus_amount;
            referAmount.textContent = response.referral_amount;
            winningAmount.textContent = response.winning_amount;
            totalAmount.textContent = response.wallet_amount;
            withdrawAmount.textContent = amount;

            updateWinning = response.winning_amount - amount;

            // const giftBonusButton = document.getElementById("gift-bonus-btn");
        if (amount >= 5000) {
            giftBonusButton.style.display = "block"; // Show button
        } else {
            giftBonusButton.style.display = "none"; // Hide button
        }
        } else {
            console.error("Data is not in the expected format:", response);
        }
    }
    console.log(userData5,"userdata che ")

    Approvebtn.addEventListener("click", async () => {

        if (Number(userData5) === 0) {
            Approvebtn.disabled = true;
            Approvebtn.style.pointerEvents = "none";
            return;
        }     
       if (confirm("Are you sure you want to approve it?")) {
            Approvebtn.disabled = false;
            const currentWalletAmount = parseFloat(totalAmount.textContent);
            console.log(currentWalletAmount,"curr")
            const newWalletAmount = currentWalletAmount - parseFloat(withdrawAmount.textContent);
            console.log(newWalletAmount,'new che')
            const bonusAddAmount = Number(bonusAmount.textContent)
            console.log(typeof bonusAddAmount)
            console.log(bonusAddAmount ,"bonusAddAmount")
            await patchData(updateWinning, 0, newWalletAmount,bonusAddAmount);
            fetchUserData();
        }
    });
    Rejectbtn.addEventListener("click", async () => {
        if (Number(userData5) === 0) {
            Approvebtn.disabled = true;
            Approvebtn.style.pointerEvents = "none";
            return;
        }  

        if (confirm("Are you sure you want to reject it?")) {
            Approvebtn.disabled = false;
            await sendNotification(user_id, {
                title: "Withdrawal Request Rejected",
                body: "Unfortunately, your withdrawal request has been rejected. Please contact support for further assistance or to resolve any issues."
              });
              
            alert("Rejected successfully")
            window.location.href = "./withdrawal.html"
        }
    });

    async function patchData(winningAmountValue, amountValue, walletAmountValue,bonusAddAmount) {
        try {
            const apiUrl1 = `https://krinik.in/withdraw_amount_get/user_id/${user_id}/id/${id}/`;
            const apiUrl2 = `https://krinik.in/user_get/${user_id}/`;

            // First PATCH request to update `winning_amount` and `wallet_amount`
            const response1 = await fetch(apiUrl2, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    winning_amount: winningAmountValue,
                    wallet_amount: walletAmountValue,
                    bonus_amount : bonusAddAmount,
                })
            });

            if (!response1.ok) {
                throw new Error("Failed to patch winning_amount and wallet_amount in first API");
            }
            console.log("Patch for winning_amount and wallet_amount successful:", await response1.json());

            // Second PATCH request to update `amount`
            const response2 = await fetch(apiUrl1, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountValue })
            });

            if (!response2.ok) {
                throw new Error("Failed to patch amount in second API");
            }
            if(response1.ok && response2.ok){

                await sendNotification(user_id, {
                    title: "Withdrawal Request Accepted!",
                    body: "Your withdrawal request has been successfully accepted. The amount is credited to your wallet!."
                  });
                  
            }

            console.log("Patch for amount successful:", await response2.json());

            // Re-fetch data to update `totalAmount` and other fields
            fetchUserData();

        } catch (error) {
            console.error("Error patching data:", error);
        }
    }

    fetchUserData();
    window.onload = checkAdminAccess();
});
