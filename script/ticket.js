// const baseUrl = "http://127.0.0.1:5001/as-trader-dcb91/us-central1/v1";
const baseUrl = "https://astrader-backend-ccth.onrender.com";
let authToken;
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
    async function fetchTickets() {
        try {
            const response = await fetch(`${baseUrl}/user/get-tickets`, {
                headers: {
                    'Authorization': `${authToken}`
                }
            });  // Adjust the API endpoint as needed
            const data = await response.json();

            if (response.ok || response.status == 404) {
                const tickets = data.tickets;
                const tbody = document.querySelector('.transaction-table tbody');
                tbody.innerHTML = '';

                tickets.forEach(ticket => {
                    const row = document.createElement('tr');
                    const date = new Date(ticket.dateAndTime);
                    const formattedDate = date.toLocaleString();

                    row.innerHTML = `
                        <td>
                            <i class="far fa-calendar"></i> ${new Date(formattedDate).toLocaleString()}
                        </td>
                        <td>${ticket.topic}</td>
                        <td>${ticket.status}</td>
                        <td>${ticket.ticketNo}</td>
                    `;

                    tbody.appendChild(row);
                });
            } else {
                throw new Error(data.message || 'Failed to fetch tickets');
            }


        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    }

    fetchTickets();
});


document.getElementById('logout-link').addEventListener('click', function () {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to log out?');

    if (confirmed) {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        window.location.href = 'index.html';
    }
});