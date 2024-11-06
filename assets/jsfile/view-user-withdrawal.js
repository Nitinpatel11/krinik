document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const user_id = urlParams.get("user_id");

    let updateWinning = 0;

    const Approvebtn = document.getElementById("Approvebtn");
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
            const userData5 = userData3.amount;

            // Disable Approve button if amount is 0
            if (userData5 === 0) {
                Approvebtn.disabled = true;
            } else {
                Approvebtn.disabled = false;
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
        } else {
            console.error("Data is not in the expected format:", response);
        }
    }

    Approvebtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to approve it?")) {
            const currentWalletAmount = parseFloat(totalAmount.textContent);
            const newWalletAmount = currentWalletAmount - parseFloat(withdrawAmount.textContent);

            await patchData(updateWinning, 0, newWalletAmount);
        }
    });

    async function patchData(winningAmountValue, amountValue, walletAmountValue) {
        try {
            const apiUrl1 = `https://krinik.in/withdraw_amount_get/user_id/${user_id}/id/${id}/`;
            const apiUrl2 = `https://krinik.in/user_get/${user_id}/`;

            // First PATCH request to update `winning_amount` and `wallet_amount`
            const response1 = await fetch(apiUrl2, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    winning_amount: winningAmountValue,
                    wallet_amount: walletAmountValue
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
            console.log("Patch for amount successful:", await response2.json());

            // Re-fetch data to update `totalAmount` and other fields
            await fetchUserData();
        } catch (error) {
            console.error("Error patching data:", error);
        }
    }

    fetchUserData();
});
