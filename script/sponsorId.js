let authToken;
const baseUrl = "https://astrader-backend-ccth.onrender.com";
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
const generateNewLink = async () => {
    authToken = await getCookie('authToken')
    // console.log("object", authToken)
    try {
        const response = await fetch(`${baseUrl}/user/generatereferrallink`, {
            headers: {
                'Authorization': `${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const newLink = await response.text();
        // copyLinksInput.value = newLink;

        // Extract the sponsor code from the new link
        const sponsorId = newLink.split('ref=')[1];
        // console.log("object", sponsorId)
        // Update the sponsorId span
        document.getElementById('sponsorIdText').textContent = sponsorId;

        // Fetch the partner list using the new sponsorId
        fetchPartnerList();
    } catch (error) {
        console.error('Error generating new referral link:', error);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    generateNewLink();
});