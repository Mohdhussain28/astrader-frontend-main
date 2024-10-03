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
            window.location.href = '/sign-in.html';
            return false;
        }
    } else {
        alert('No auth token found. Redirecting to sign-in page.');
        window.location.href = '/sign-in.html';
        return false;
    }
}

// Event listener for profile form submission
document.getElementById('profileForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const isValidToken = await validateAuthToken();

    if (!isValidToken) {
        // Token is not valid, no need to proceed further
        return;
    }
    const formData = new FormData();
    formData.append('fullName', document.getElementById('full_name').value);
    formData.append('secondaryEmail', document.getElementById('account_email').value);
    formData.append('mobile', document.getElementById('account_mobile').value);
    formData.append('address', document.getElementById('account_address').value);
    formData.append('city', document.getElementById('account_city').value);
    formData.append('state', document.getElementById('account_state').value);
    formData.append('country', document.getElementById('country_name').value);

    const fileInput = document.getElementById('update_profile');
    if (fileInput.files.length > 0) {
        formData.append('profile_image', fileInput.files[0]);
    }

    try {
        const response = await axios.post(`${baseUrl}/user/update-profile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `${authToken}`
            }
        });
        if (response.status == 200) {
            alert('User profile updated successfully');
        } else {
            alert(`Error: ${response.data.error}`);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating the profile');
    }
});

// Display the selected profile image immediately
document.getElementById('update_profile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profileImage').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Logout functionality
document.getElementById('logout-link').addEventListener('click', function () {
    const confirmed = confirm('Are you sure you want to log out?');

    if (confirmed) {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        window.location.href = 'index.html';
    }
});

// Event listener for account details form submission
document.getElementById('account-details-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const isValidToken = await validateAuthToken();

    if (!isValidToken) {
        // Token is not valid, no need to proceed further
        return;
    }

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${baseUrl}/user/account-details`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`
            }
        });

        if (response.ok) {
            alert('Account details updated successfully');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error updating account details:', error);
        alert('An error occurred while updating account details');
    }
});

// Load account details on page load
window.onload = async () => {
    const isValidToken = await validateAuthToken();

    if (!isValidToken) {
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/user/account-details`, {
            headers: {
                'Authorization': `${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    document.getElementById(key).value = data[key];
                }
            }
        }
    } catch (error) {
        console.error('Error fetching account details:', error);
    }
};
