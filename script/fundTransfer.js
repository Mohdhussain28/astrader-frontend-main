const baseUrl = "https://astrader-backend.onrender.com";
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

        document.getElementById('transferForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const isValidToken = await validateAuthToken();
            if (isValidToken) {
                const amount = parseFloat(document.getElementById('amountInput').value.replace('₹', '').trim());
                const source = document.getElementById('sourceSelect').value;

                if (isNaN(amount) || amount <= 0) {
                    alert('Please enter a valid amount.');
                    return;
                }

                try {
                    const response = await fetch(`${baseUrl}/user/transfer-amount`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${authToken}`
                        },
                        body: JSON.stringify({ source, amount })
                    });

                    const result = await response.json();
                    if (response.ok) {
                        document.getElementById('displayAmount').value = `₹${result.walletBalance.toFixed(2)}`;
                        alert('Transfer successful!');
                    } else {
                        alert(`Error: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while transferring funds.');
                }
            }
        });

        async function loadTransferDetails() {
            const isValidToken = await validateAuthToken();
            if (isValidToken) {
                try {
                    const response = await fetch(`${baseUrl}/user/get-transferAmount`, {
                        headers: {
                            'Authorization': `${authToken}`
                        }
                    });

                    const data = await response.json();
                    const tableBody = document.querySelector('#transactionsTable tbody');
                    tableBody.innerHTML = ''; 

                    if (data.error) {
                        console.error(data.error);
                        return;
                    }

                    data.forEach(item => {
                        const row = document.createElement('tr');

                        const dateCell = document.createElement('td');
                        dateCell.textContent = new Date(item.createdAt).toLocaleString();
                        row.appendChild(dateCell);

                        const transferCell = document.createElement('td');
                        transferCell.textContent = item.source;
                        row.appendChild(transferCell);

                        const amountCell = document.createElement('td');
                        amountCell.textContent = item.amount;
                        row.appendChild(amountCell);

                        const statusCell = document.createElement('td');
                        statusCell.textContent = 'Completed';
                        row.appendChild(statusCell);

                        tableBody.appendChild(row);
                    });
                } catch (error) {
                    console.error('Error fetching transfer details:', error);
                }
            }
        }

        document.addEventListener('DOMContentLoaded', loadTransferDetails);