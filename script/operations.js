const baseUrl = "https://astrader-backend.onrender.com";

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
            window.location.href = '/sign-in.html';  // Replace with your sign-in page URL
            return false;
        }
    } else {
        alert('No auth token found. Redirecting to sign-in page.');
        window.location.href = '/sign-in.html';  // Replace with your sign-in page URL
        return false;
    }
}

// Function to fetch and display transactions
async function fetchTransactions(userId, filters = {}) {
    try {
        const url = new URL(`${baseUrl}/user/transactions`);
        Object.keys(filters).forEach(key => {
            if (filters[key] !== null) {
                url.searchParams.append(key, filters[key]);
            }
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`
            }
        });
        const { transactions } = await response.json();
        displayTransactions(transactions);
        console.log('Fetched Transactions:', transactions); // Console log the fetched transactions
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

// Function to fetch and display filtered transactions
async function fetchFilteredTransactions(userId) {
    try {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const operation = document.getElementById('operation').value;

        const filters = {
            dateFrom,
            dateTo,
            operation: operation !== 'o1' ? operation : null,
        };

        await fetchTransactions(userId, filters);
    } catch (error) {
        console.error('Error fetching filtered transactions:', error);
    }
}

// Function to display transactions in the table
function displayTransactions(transactions) {
    const tableBody = document.getElementById('transactionsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = tableBody.insertRow();
        const dateCell = row.insertCell(0);
        const operationCell = row.insertCell(1);
        const amountCell = row.insertCell(2);
        const statusCell = row.insertCell(3);

        dateCell.innerHTML = `<i class="far fa-calendar"></i> ${new Date(transaction.createdAt).toLocaleString()}`;
        operationCell.textContent = mapOperationToDisplayName(transaction.operation);
        amountCell.textContent = transaction.amount;
        statusCell.textContent = transaction.status;
    });

    console.log('Displayed Transactions:', transactions); // Console log the displayed transactions
}

// Function to map operation codes to display names
function mapOperationToDisplayName(operation) {
    switch (operation) {
        case 'withdrawal':
            return 'Withdraw funds';
        case 'deposit':
            return 'Deposit funds';
        case 'transferFund':
            return 'Fund Transfer';
        default:
            return 'Unknown';
    }
}

// Event listener to call useAuthToken function and fetch transactions on page load
document.addEventListener('DOMContentLoaded', async () => {
    const isValidToken = await validateAuthToken();
    if (isValidToken) {
        const userId = document.getElementById('userId').value;
        await fetchTransactions(userId);
    }
});

// Event listener to fetch filtered transactions on form submit
document.getElementById('filterForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const isValidToken = await validateAuthToken();
    if (isValidToken) {
        const userId = document.getElementById('userId').value;
        await fetchFilteredTransactions(userId);
    }
});

// Logout functionality
document.getElementById('logout-link').addEventListener('click', function () {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to log out?');

    if (confirmed) {
        // Clear the authToken
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'; // or sessionStorage.removeItem('authToken')

        // Redirect to the index page
        window.location.href = 'index.html';
    }
});
