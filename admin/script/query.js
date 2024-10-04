// const baseUrl = "http://localhost:3000";
const baseUrl = "https://astrader-backend-ccth.onrender.com";
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
    fetch(`${baseUrl}/admin/ticket-details`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => populateTicketsTable(data.tickets))
        .catch(error => console.error('Error fetching tickets:', error));
});

function updateTicketStatus(ticketId, newStatus) {
    fetch(`${baseUrl}/admin/tickets/${ticketId}/${newStatus}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                alert(data.message);
                location.reload();
            } else {
                alert('Error updating ticket status');
            }
        })
        .catch(error => console.error('Error:', error));
}

function populateTicketsTable(tickets) {
    const tableBody = document.getElementById('ticketsTableBody');
    tableBody.innerHTML = ''; // Clear any existing data

    tickets.forEach(ticket => {
        const row = document.createElement('tr');

        const ticketNoCell = document.createElement('td');
        ticketNoCell.innerHTML = `<a href="#" class="fw-bold">#${ticket.ticketNo}</a>`;
        row.appendChild(ticketNoCell);

        const dateCell = document.createElement('td');
        dateCell.innerHTML = `<span class="fw-normal">${new Date(ticket.dateAndTime).toLocaleDateString()}</span>`;
        row.appendChild(dateCell);

        const messageCell = document.createElement('td');
        messageCell.innerHTML = `<span class="fw-normal">${ticket.message}</span>`;
        row.appendChild(messageCell);

        const downloadCell = document.createElement('td');
        downloadCell.innerHTML = `<a href="${baseUrl}/admin/ticket-download/${ticket.id}" class="btn btn-link text-dark">View Ticket</a>`;
        row.appendChild(downloadCell);

        const statusCell = document.createElement('td');
        statusCell.innerHTML = `<span class="fw-bold text-warning">${ticket.status}</span>`;
        row.appendChild(statusCell);

        const actionCell = document.createElement('td');
        actionCell.innerHTML = `
            <div class="btn-group">
                <button class="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="icon icon-sm"><span class="fas fa-ellipsis-h icon-dark"></span></span><span class="visually-hidden">Toggle Dropdown</span>
                </button>
                <div class="dropdown-menu py-0">
                    <a class="dropdown-item" href="#" data-ticket-id="${ticket.id}" data-status="solved">Solve</a>
                    <a class="dropdown-item text-danger rounded-bottom" href="#" data-ticket-id="${ticket.id}" data-status="resolved">Resolve</a>
                </div>
            </div>
        `;
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    // Add event listeners for the dropdown items
    tableBody.addEventListener('click', event => {
        if (event.target.matches('.dropdown-item')) {
            const ticketId = event.target.getAttribute('data-ticket-id');
            const newStatus = event.target.getAttribute('data-status');
            updateTicketStatus(ticketId, newStatus);
        }
    });
}

