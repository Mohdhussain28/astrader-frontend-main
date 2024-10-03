// const baseUrl = "http://localhost:3000";

const baseUrl = "https://astrader-backend.onrender.com"

let authToken;
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
async function validateAuthToken() {
    authToken = getCookie('authToken');
    if (authToken) {
        try {
            const response = await fetch(`${baseUrl}/admin/admin-verifier`, {
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
document.addEventListener('DOMContentLoaded', async () => {
    const isValidToken = await validateAuthToken();

    if (!isValidToken) {
        return;
    }
    fetch(`${baseUrl}/admin/check-withdrawl`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => populateWithdrawalsTable(data.withdrawals))
        .catch(error => console.error('Error fetching withdrawals:', error));
});

function populateWithdrawalsTable(withdrawals) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';

    withdrawals.forEach(withdrawal => {
        const row = document.createElement('tr');

        const userIdCell = document.createElement('td');
        userIdCell.textContent = withdrawal.email;
        row.appendChild(userIdCell);

        const userNameCell = document.createElement('td');
        userNameCell.innerHTML = `<span class="fw-normal">${withdrawal.amount}</span>`;
        row.appendChild(userNameCell);

        const dateCell = document.createElement('td');
        dateCell.innerHTML = `<span class="fw-normal">${new Date(withdrawal.createdAt).toLocaleDateString()}</span>`;
        row.appendChild(dateCell);

        const amountCell = document.createElement('td');
        amountCell.innerHTML = `<span class="fw-bold">${withdrawal.netAmount.toFixed(2)}</span>`;
        row.appendChild(amountCell);

        const statusCell = document.createElement('td');
        statusCell.innerHTML = `<span class="fw-bold ${withdrawal.status === 'Paid' ? 'text-success' : 'text-warning'}">${withdrawal.status}</span>`;
        row.appendChild(statusCell);

        const actionCell = document.createElement('td');
        actionCell.innerHTML = `
            <div class="btn-group">
                <button class="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="icon icon-sm"><span class="fas fa-ellipsis-h icon-dark"></span></span>
                    <span class="visually-hidden">Toggle Dropdown</span>
                </button>
                <div class="dropdown-menu py-0">
                    <a class="dropdown-item" href="#" data-id="${withdrawal.id}" data-status="Accepted">
                        <span class="fas fa-edit me-2"></span>Accept
                    </a>
                    <a class="dropdown-item text-danger rounded-bottom" href="#" data-id="${withdrawal.id}" data-status="Removed">
                        <span class="fas fa-trash-alt me-2"></span>Remove
                    </a>
                </div>
            </div>
        `;
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

// Event delegation for handling dropdown item clicks
document.querySelector('tbody').addEventListener('click', event => {
    const target = event.target.closest('.dropdown-item');
    if (target) {
        const withdrawalId = target.getAttribute('data-id');
        const newStatus = target.getAttribute('data-status');
        updateWithdrawalStatus(withdrawalId, newStatus);
    }
});

function updateWithdrawalStatus(withdrawalId, newStatus) {
    fetch(`${baseUrl}/admin/withdrawals/${withdrawalId}/${newStatus}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        }
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 200) {
            alert(body.message);
            location.reload();
        } else {
            throw new Error(body.message || 'Error updating withdrawal status');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Failed to update status: ${error.message}`);
    });
}

