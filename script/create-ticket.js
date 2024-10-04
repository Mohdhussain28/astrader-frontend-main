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
            window.location.href = '/sign-in.html';
            return false;
        }
    } else {
        alert('No auth token found. Redirecting to sign-in page.');
        window.location.href = '/sign-in.html';
        return false;
    }
}
document.getElementById('createTicketForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const isValidToken = await validateAuthToken();

    if (!isValidToken) {
        return;
    }
    const form = event.target;
    const formData = new FormData(form);

    formData.append('status', 'new');
    formData.append('ticketNo', Math.floor(Math.random() * 100000));


    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    try {
        const response = await axios.post(`${baseUrl}/user/create-ticket`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `${authToken}`
            }
        });
        if (response.status == 201) {
            alert('Ticket created successfully');
            console.log(response.data);
        } else {
            alert(`Error: ${error}`);
        }

    } catch (error) {
        console.error('Error creating ticket:', error.response ? error.response.data : error.message);
        alert('Failed to create ticket');
    }
});


document.getElementById('logout-link').addEventListener('click', function () {
    const confirmed = confirm('Are you sure you want to log out?');

    if (confirmed) {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

        window.location.href = 'index.html';
    }
});