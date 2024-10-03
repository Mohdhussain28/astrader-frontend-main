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
    fetch(`${baseUrl}/admin/check-purchase`)
        .then(response => response.json())
        .then(data => {
            const purchases = data.purchases; // Assuming the data returned is an array of purchases
            const tableBody = document.querySelector('#purchaseTable tbody');
            purchases.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="../invoice.html" class="fw-bold">${item.email}</a></td>
                    <td><span class="fw-normal">${item.packageName}</span></td>
                    <td><a href="${item.paymentImageUrl}" target="_blank" class="fw-normal">View Photo</a></td>
                    <td><span class="fw-normal">${new Date(item.createdAt).toLocaleDateString()}</span></td>
                    <td><span class="fw-bold">${item.amount}</span></td>
                    <td><span class="fw-bold text-${item.status === 'Paid' ? 'success' : 'danger'}">${item.status}</span></td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="icon icon-sm"><span class="fas fa-ellipsis-h icon-dark"></span></span>
                                <span class="visually-hidden">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu py-0">
                                <a class="dropdown-item accept-btn" href="#" data-id="${item.id}" data-status="active"><span class="fas fa-edit me-2"></span>Accept</a>
                                <a class="dropdown-item text-danger rounded-bottom remove-btn" href="#" data-id="${item.id}" data-status="Removed"><span class="fas fa-trash-alt me-2"></span>Remove</a>
                            </div>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.accept-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    event.preventDefault();
                    const purchaseId = event.target.getAttribute('data-id');
                    const status = event.target.getAttribute('data-status');
                    updatePurchaseStatus(purchaseId, status);
                });
            });

            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    event.preventDefault();
                    const purchaseId = event.target.getAttribute('data-id');
                    const status = event.target.getAttribute('data-status');
                    updatePurchaseStatus(purchaseId, status);
                });
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});

async function updatePurchaseStatus(purchaseId, status) {
    try {
        const response = await fetch(`${baseUrl}/admin/approve-purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ purchaseId, status })
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            location.reload(); // Reload the page to see the changes
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error updating purchase status:', error);
        alert('An error occurred while updating the status.');
    }
}
