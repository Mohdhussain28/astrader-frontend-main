const baseUrl = "https://astrader-backend-ccth.onrender.com";
let authToken;
let selectedPackage = {};

// Utility function to convert string to number
function convertStringToNumber(value) {
    return parseFloat(value.replace(/[^0-9.-]+/g, ""));
}

// Function to get the value of a specific cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Validate auth token
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

// Fetch packages from the backend and display them
async function fetchPackages() {
    const packagesTableBody = document.getElementById('packages-table-body');
    try {
        const response = await fetch(`${baseUrl}/user/get-package`, {
            headers: {
                'Authorization': `${authToken}`
            }
        });
        const packages = await response.json();

        packagesTableBody.innerHTML = '';
        packages.forEach(pkg => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pkg.packageName}</td>
                <td data-amount="${pkg.amount}">Rs ${pkg.amount}</td>
                <td data-daily-income="${pkg.dailyIncome}">${pkg.dailyIncome}</td>
                <td data-duration="${pkg.duration}">${pkg.duration} Days</td>
                <td data-total-revenue="${pkg.totalRevenue}">${pkg.totalRevenue}</td>
                <td><button class="buy-package" data-package="${pkg.packageName}">Buy Package</button></td>
            `;
            packagesTableBody.appendChild(row);
        });

        document.querySelectorAll('.buy-package').forEach(button => {
            button.addEventListener('click', (event) => {
                const row = event.target.closest('tr');
                selectedPackage = {
                    packageName: button.getAttribute('data-package'),
                    amount: convertStringToNumber(row.querySelector('[data-amount]').getAttribute('data-amount')),
                    dailyIncome: convertStringToNumber(row.querySelector('[data-daily-income]').getAttribute('data-daily-income')),
                    duration: convertStringToNumber(row.querySelector('[data-duration]').getAttribute('data-duration')),
                    totalRevenue: convertStringToNumber(row.querySelector('[data-total-revenue]').getAttribute('data-total-revenue'))
                };
                document.getElementById('modal-title').textContent = `Buy ${selectedPackage.packageName}`;
                document.getElementById('modal').style.display = 'block';
            });
        });

    } catch (error) {
        console.error('Error fetching packages:', error);
    }
}

// Handle package purchase
async function buyPackage() {
    const formData = new FormData();
    formData.append('packageName', selectedPackage.packageName);
    formData.append('amount', selectedPackage.amount);
    formData.append('dailyIncome', selectedPackage.dailyIncome);
    formData.append('duration', selectedPackage.duration);
    formData.append('totalRevenue', selectedPackage.totalRevenue);

    const receiptFile = document.getElementById('receipt').files[0];
    if (receiptFile) {
        formData.append('file', receiptFile);
    } else {
        alert('Please upload a receipt image.');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/user/buy-package`, {
            method: 'POST',
            headers: {
                'Authorization': `${authToken}`
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert('Package purchase request created successfully');
            document.getElementById('modal').style.display = 'none';
            // Optionally, refresh packages or purchase status here
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    }
}

// Fetch purchase status
async function fetchPurchaseStatus() {
    try {
        const response = await fetch(`${baseUrl}/user/get-purchase-status`, {
            headers: {
                'Authorization': `${authToken}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            const statusList = document.getElementById('purchase-status-list');
            statusList.innerHTML = '';
            data.purchases.forEach(purchase => {
                const purchaseDate = new Date(purchase.createdAt).toLocaleDateString();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${purchase.packageName}</td>
                    <td>Rs ${purchase.amount}</td>
                    <td>${purchase.dailyIncome}</td>
                    <td>${purchase.totalRevenue}</td>
                    <td>${purchase.duration} Days</td>
                    <td>${purchaseDate}</td>
                    <td>${purchase.status}</td>
                    <td><button class="Receipt">Receipt</button></td>
                `;
                statusList.appendChild(row);
            });
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize dashboard
async function initializeDashboard() {
    const apiUrl = `${baseUrl}/user/get-dashboard`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `${authToken}`
            }
        });
        if (response.ok || response.status == 404) {
            const data = await response.json();

            // Initialize default values if data is undefined or null
            const defaultData = {
                totalDownline: 0,
                directMembers: 0,
                walletBalance: 0,
                totalIncome: 0,
                roi: 0,
                levelIncome: 0,
                awardReward: 0,
                roiWallet: 0
            };
            const finalData = data ? { ...defaultData, ...data } : defaultData;

            document.querySelectorAll('.dashboard-item').forEach(item => {
                const title = item.querySelector('.title').textContent.trim();
                switch (title) {
                    case 'Total Downline':
                        item.querySelector('.amount').textContent = finalData.totalDownline;
                        break;
                    case 'Direct Members':
                        item.querySelector('.amount').textContent = finalData.directMembers;
                        break;
                    case 'Wallet Balance':
                        item.querySelector('.amount').textContent = 'Rs ' + finalData.walletBalance.toFixed(2);
                        break;
                    case 'Total Income':
                        item.querySelector('.amount').textContent = 'Rs ' + finalData.totalIncome.toFixed(2);
                        break;
                    case 'ROI':
                        item.querySelector('.amount').textContent = 'Rs ' + finalData.roi.toFixed(2);
                        break;
                    case 'Level Income':
                        item.querySelector('.amount').textContent = 'Rs ' + finalData.levelIncome.toFixed(2);
                        break;
                    case 'Award Reward':
                        item.querySelector('.amount').textContent = 'Rs ' + finalData.awardReward.toFixed(2);
                        break;
                    case 'ROI on ROI':
                        item.querySelector('.amount').textContent = 'Rs ' + finalData.roiWallet.toFixed(2);
                        break;
                    default:
                        break;
                }
            });
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        document.querySelectorAll('.dashboard-item .amount').forEach(amount => {
            amount.textContent = '0';
        });
    }
}

async function loadGreeting() {
    try {
        const response = await fetch(`${baseUrl}/user/view-greeting`, {
            headers: {
                'Authorization': `${authToken}`
            }
        }); // Adjust the URL if necessary

        if (response.ok) {
            const data = await response.json();
            if (data.message) {
                document.getElementById('greeting-message').innerText = data.message;
            }
        } else if (response.status === 404) {
            console.log('No greeting found, showing default message');
        } else {
            console.error('Error fetching greeting:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}


// Load the greeting when the page loads
window.onload = async () => {
    const isValidToken = await validateAuthToken();
    if (isValidToken) {
        fetchPurchaseStatus();
        initializeDashboard();
        fetchPackages();
        loadGreeting();
    }
};

document.getElementById('start-button').addEventListener('click', buyPackage);

document.querySelectorAll('.close').forEach(element => {
    element.addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });
});

document.getElementById('logout-link').addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to log out?');
    if (confirmed) {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        window.location.href = 'index.html';
    }
});
