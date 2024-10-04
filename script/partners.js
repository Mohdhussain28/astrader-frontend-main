const baseUrl = "https://astrader-backend-ccth.onrender.com";
let authToken;
let sponsorId;

// Function to get the value of a specific cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to validate auth token
async function validateAuthToken() {
    authToken = getCookie('authToken');
    if (authToken) {
        try {
            const response = await fetch(`${baseUrl}/user/verify-auth`, {
                headers: {
                    'Authorization': `${authToken}`
                }
            });

            if (response.ok) {
                return true;
            } else {
                throw new Error('Invalid auth token');
            }
        } catch (error) {
            alert('Session expired or invalid token. Redirecting to sign-in page.');
            window.location.href = '/sign-in.html';  // Uncomment to redirect
            return false;
        }
    } else {
        alert('No auth token found. Redirecting to sign-in page.');
        window.location.href = '/sign-in.html';  // Uncomment to redirect
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const isValidToken = await validateAuthToken();

    if (!isValidToken) {
        // Token is not valid, no need to proceed further
        return;
    }

    const button = document.getElementById('copy');
    const copyLinksInput = document.getElementById('copyLinks');

    if (!button || !copyLinksInput) {
        console.error('Required elements are missing in the DOM.');
        return;
    }

    // Function to copy the referral link to clipboard
    const copyToClipboard = () => {
        copyLinksInput.select();
        document.execCommand('copy');
        alert('Link copied to clipboard!');
    };

    // Function to fetch a new referral link from the API and update the input
    const generateNewLink = async () => {
        try {
            const response = await fetch(`${baseUrl}/user/generatereferrallink`, {
                headers: {
                    'Authorization': `${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const newLink = await response.text();
            copyLinksInput.value = newLink;
            // copyToClipboard();

            // Extract the sponsor code from the new link
            sponsorId = newLink.split('ref=')[1];

            // Fetch the partner list using the new sponsorId
            fetchPartnerList();
        } catch (error) {
            console.error('Error generating new referral link:', error);
        }
    };

    // Function to fetch the partner list
    const fetchPartnerList = async () => {
        try {
            const response = await fetch(`${baseUrl}/user/partner-list?sponsorId=${sponsorId}`, {
                headers: {
                    'Authorization': `${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch referred users');
            }

            const referredUsers = await response.json();

            // Populate the HTML table with the referred users data
            populateReferredUsersTable(referredUsers);
        } catch (error) {
            console.error('Error fetching referred users:', error);
        }
    };

    // Event listener for the button
    // button.addEventListener('click', copyToClipboard());

    // Generate a new referral link on page load
    await generateNewLink();
});

function populateReferredUsersTable(referredUsers) {
    const tableBody = document.querySelector(".transaction-table tbody");

    tableBody.innerHTML = ''; // Clear any existing rows

    referredUsers.forEach(user => {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.innerHTML = `<i class="far fa-calendar"></i> ${new Date(user.createdAt).toLocaleString()}`;
        row.appendChild(dateCell);

        const levelCell = document.createElement("td");
        levelCell.textContent = user.level || 'N/A'; // Adjust as per your data structure
        row.appendChild(levelCell);

        const usernameCell = document.createElement("td");
        usernameCell.textContent = user.fullName || 'N/A'; // Adjust as per your data structure
        row.appendChild(usernameCell);

        const emailCell = document.createElement("td");
        emailCell.innerHTML = `<a href="mailto:${user.email}">${user.email}</a>`;
        row.appendChild(emailCell);

        const investedCell = document.createElement("td");
        investedCell.textContent = user.invested || 'N/A'; // Adjust as per your data structure
        row.appendChild(investedCell);

        tableBody.appendChild(row);
    });
}


document.getElementById('logout-link').addEventListener('click', function () {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to log out?');

    if (confirmed) {
        // Clear the authToken
        localStorage.removeItem('authToken');  // or sessionStorage.removeItem('authToken')

        // Redirect to the index page
        window.location.href = 'index.html';
    }
});