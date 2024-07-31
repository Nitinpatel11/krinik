const COOKIE_NAME = 'userEmail';

        function eraseCookie(name) {
            document.cookie = `${name}=; Max-Age=-99999999; path=/`;
        }

        function showLogoutModal(event) {
            // Prevent the default action (e.g., form submission)
            event.preventDefault();

            // Create the modal container
            const modal = document.createElement('div');
            modal.id = 'logoutModal';
            modal.classList.add('modal');

            // Create the modal content container
            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');

            // Create the modal header
            const header = document.createElement('h2');
            header.textContent = 'Are you sure you want to logout?';

            // Create the modal buttons
            const modalButtons = document.createElement('div');
            modalButtons.classList.add('modal-buttons');

            const confirmButton = document.createElement('button');
            confirmButton.id = 'confirmLogout';
            confirmButton.textContent = 'Yes, Logout';
            confirmButton.onclick = () => {
                // Erase the cookie
                eraseCookie(COOKIE_NAME);

                // Redirect to the index page
                window.location.href = './index.html';
            };

            const cancelButton = document.createElement('button');
            cancelButton.id = 'cancelLogout';
            cancelButton.textContent = 'Cancel';
            cancelButton.onclick = () => modal.style.display = 'none';

            // Append elements
            modalButtons.appendChild(confirmButton);
            modalButtons.appendChild(cancelButton);
            modalContent.appendChild(header);
            modalContent.appendChild(modalButtons);
            modal.appendChild(modalContent);

            // Append modal to the body
            document.body.appendChild(modal);

            // Show the modal
            modal.style.display = 'block';
        }

        // Example usage
        document.getElementById('logoutButton').addEventListener('click', showLogoutModal);

        // Function to hide the modal when clicking outside of it
        window.onclick = function(event) {
            const modal = document.getElementById('logoutModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
