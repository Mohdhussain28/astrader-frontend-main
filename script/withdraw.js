const baseUrl = "https://astrader-backend-ccth.onrender.com";
let authToken;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function validateAuthToken() {
    authToken = getCookie('authToken');
    console.log(authToken);
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

async function fetchWithdrawals() {
    const isValidToken = await validateAuthToken();
    if (isValidToken) {
        try {
            const response = await fetch(`${baseUrl}/user/get-withdrawls`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${authToken}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                populateTable(data);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            alert('An error occurred while fetching withdrawals');
            console.error('Error:', error);
        }
    }
}

function populateTable(withdrawals) {
    const tableBody = document.querySelector('#transactionsTable tbody');
    tableBody.innerHTML = ''; // Clear existing table data

    withdrawals.forEach(withdrawal => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${new Date(withdrawal.createdAt).toLocaleString()}</td>
                <td>${withdrawal.amount}</td>
                <td>${withdrawal.netAmount}</td>
                <td>${withdrawal.status}</td>
            `;
        tableBody.appendChild(row);
    });
}

document.querySelector('.make-deposit').addEventListener('submit', async (event) => {
    event.preventDefault();
    const isValidToken = await validateAuthToken();
    if (isValidToken) {
        const amountInput = document.querySelector('.make-amount');
        const displayInput = document.querySelector('.readonly');
        const amount = parseFloat(amountInput.value);

        if (!amount || isNaN(amount) || amount <= 0 || amount < 500) {
            alert('Invalid amount, minimum withdrawal is 500');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/user/withdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${authToken}`
                },
                body: JSON.stringify({ amount })
            });
            const result = await response.json();
            if (response.ok) {
                alert('Withdrawal request created successfully');
                console.log(result);
                displayInput.value = `₹${amount.toFixed(2)}`; // Update the readonly input field
                amountInput.value = ''; // Clear the input box
                fetchWithdrawals(); // Refresh the table
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while creating the withdrawal request');
            console.error('Error:', error);
        }
    }
});

document.getElementById('logout-link').addEventListener('click', function () {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to log out?');

    if (confirmed) {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        window.location.href = 'index.html';
    }
});

// Call fetchWithdrawals when the page loads
document.addEventListener('DOMContentLoaded', fetchWithdrawals);