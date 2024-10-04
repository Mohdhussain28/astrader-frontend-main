const baseUrl = "https://astrader-backend-ccth.onrender.com";

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

document.getElementById('signUpForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const sponsorId = document.getElementById('sponsorId').value;
    const fullName = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const secondaryEmail = document.getElementById('gmail').value;
    const password = document.getElementById('password').value;

    fetch(`${baseUrl}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sponsorId, fullName, email, password, secondaryEmail })
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                window.location.href = 'sign-in.html';
                alert("Sign-up successful");
            }).catch(err => {
                // Handle cases where the response is not valid JSON
                alert("Received an unexpected response from the server.");
                console.error("JSON parsing error:", err);
            });
        } else {
            response.text().then(text => {
                // Handle non-JSON error messages
                alert("Server error: " + text);
            }).catch(err => {
                alert("Error reading server response.");
                console.error("Error reading response:", err);
            });
        }
    }).catch(error => {
        alert("Network error.");
        console.error("Fetch error:", error);
    });
});
