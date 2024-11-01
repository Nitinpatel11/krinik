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
  
    async function fetchUserData() {
        try {
            if (!user_id) {
                console.warn("No player ID found in URL.");
                return;
            }

            const url = `https://krinik.pythonanywhere.com/user_get/${user_id}/`;
            const url1 = `https://krinik.pythonanywhere.com/withdraw_amount_get/user_id/${user_id}/id/${id}/`;
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
            userData5 = userData3.amount;

            // Disable Approve button if amount is 0
            if (userData5 === 0) {
                Approvebtn.disabled = true;
                Rejectbtn.disabled = true;
                Approvebtn.classList.remove("clickbtn1");
                Rejectbtn.classList.remove("clickbtn1");
                Rejectbtn.style = "border:1px solid black;opacity:0.7";
      Approvebtn.style = "border:1px solid black;opacity:0.7";
            } else {
                Approvebtn.classList.add("clickbtn1");
                Rejectbtn.classList.add("clickbtn1");
            }

            editPlayerData(userData, userData5);
        } catch (error) {
            console.error("Error fetching player data:", error);
        }
    }
  
    function editPlayerData(response, amount) {
        if (response) {
            userImageView.src = `https://krinik.pythonanywhere.com${response.image}`;
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
            console.log(updateWinning, "Updated Winning Amount");
        } else {
            console.error("Data is not in the expected format:", response);
        }
    }

    Approvebtn.addEventListener("click", async () => {
        if (userData5 === 0) {
            Approvebtn.disabled = true;
            Rejectbtn.disabled = true
            Approvebtn.style = "pointer:none;color:black;border:1px solid black "
        } else {
            Approvebtn.disabled = false;
            Rejectbtn.disabled = false
            if (confirm("Are you sure you want to approve it?")) {
                await patchData(updateWinning, 0);
                window.location.href = "withdrawal.html"
            }
        }
    });

    async function patchData(winningAmountValue, amountValue) {
        try {
            const apiUrl1 = `https://krinik.pythonanywhere.com/withdraw_amount_get/user_id/${user_id}/id/${id}/`;
            const apiUrl2 = `https://krinik.pythonanywhere.com/user_get/${user_id}/`;

            const response1 = await fetch(apiUrl2, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ winning_amount: winningAmountValue })
            });

            if (!response1.ok) {
                throw new Error("Failed to patch winning_amount in first API");
            }

            console.log("Patch for winning_amount successful:", await response1.json());

            const response2 = await fetch(apiUrl1, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountValue })
            });

            if (!response2.ok) {
                throw new Error("Failed to patch amount in second API");
            }

            console.log("Patch for amount successful:", await response2.json());
            fetchUserData(); // Refresh data after patching
        } catch (error) {
            console.error("Error patching data:", error);
        }
    }

    fetchUserData();
});
