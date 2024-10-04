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
        // console.log(authToken);
        try {
            const response = await fetch(`${baseUrl}/user/verify-auth`, {
                headers: {
                    'Authorization': `${authToken}`
                }
            });
            // console.log(response)
            if (response.ok) {
                return true;
            } else {
                throw new Error('Invalid auth token');
            }
        } catch (error) {
            alert('Session expired or invalid token. Redirecting to sign-in page.');
            window.location.href = '/sign-in.html';  // Redirect to the sign-in page
            return false;
        }
    } else {
        alert('No auth token found. Redirecting to sign-in page.');
        window.location.href = '/sign-in.html';  // Redirect to the sign-in page
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const isValidToken = await validateAuthToken();

    if (!isValidToken) {
        // Token is not valid, no need to proceed further
        return;
    }
    try {
        const response = await fetch(`${baseUrl}/user/user-detail`, {
            headers: {
                'Authorization': `${authToken}`
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const userData = await response.json();

        // Assuming userData contains fields `name` and `registerDate`
        const userName = userData.fullName;
        const registerDate = userData.createdAt;

        document.getElementById('user-name').textContent = userName;
        document.querySelector('.content p:nth-of-type(4)').textContent = `Register Date: ${new Date(registerDate).toLocaleDateString()}`;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

// script.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${baseUrl}/user/user-detail`, {
            headers: {
                'Authorization': `${authToken}`
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const userData = await response.json();

        // Assuming userData contains fields `name`, `country`, `email`, and `image`
        const userName = userData.fullName;
        const userCountry = userData.country;
        const userEmail = userData.email;
        const userImage = userData.profileImage; // URL to the user image

        // Update the content in HTML
        document.getElementById('author-name').textContent = userName;
        document.getElementById('author-country').textContent = userCountry;
        document.getElementById('author-header-name').textContent = userName;
        document.getElementById('author-email').href = `mailto:${userEmail}`;
        document.querySelector('.__cf_email__').textContent = userEmail;

        // Optional: Update images if the user has a custom image URL
        if (userImage) {
            document.getElementById('author-image').src = userImage;
            document.getElementById('author-header-image').src = userImage;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});


// document.getElementById('logout-link').addEventListener('click', function () {
//     // Show confirmation dialog
//     const confirmed = confirm('Are you sure you want to log out?');

//     if (confirmed) {
//         document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';// or sessionStorage.removeItem('authToken')

//         window.location.href = 'index.html';
//     }
// });