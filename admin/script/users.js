// const baseUrl = "http://localhost:3000"

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

async function fetchUsers() {
  try {
    const response = await fetch(`${baseUrl}/admin/user-detail`); // Replace with your API endpoint
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.users; // Adjust according to your API response structure
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const isValidToken = await validateAuthToken();

  if (!isValidToken) {
    return;
  }
  const users = await fetchUsers();
  const tbody = document.querySelector('.user-table tbody');
const userCountDiv = document.getElementById('user-count');
  tbody.innerHTML = ''; 

  users.forEach(user => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
            <td>
              <div class="form-check dashboard-check">
                <input class="form-check-input" type="checkbox" value id="userCheck${user.id}">
                <label class="form-check-label" for="userCheck${user.id}"></label>
              </div>
            </td>
            <td>
              <a href="user-profile.html?id=${user.id}" class="d-flex align-items-center">
                <img src="${user.profileImage || '../assets/img/team/profile-picture-1.jpg'}" class="avatar rounded-circle me-3" alt="Avatar">
                <div class="d-block">
                  <span class="fw-bold">${user.fullName}</span>
                  <div class="small text-gray">
                    <span class="__cf_email__">${user.email}</span>
                  </div>
                </div>
              </a>
            </td>
            <td><span class="fw-normal">${new Date(user.createdAt).toLocaleDateString()}</span></td>
            <td>
              <span class="fw-normal d-flex align-items-center">
                <svg class="icon icon-xxs text-success me-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg> ${user.mobile}
              </span>
            </td>
            <td><span class="fw-normal text-success">${user.asTraderId}</span></td>
            <td>
              <div class="btn-group">
                <button class="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0 p-0" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg> <span class="visually-hidden">Toggle Dropdown</span>
                </button>
                <div class="dropdown-menu dashboard-dropdown dropdown-menu-start mt-2 py-1">
                  <a class="dropdown-item d-flex align-items-center" href="#"><svg class="dropdown-icon text-gray-400 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"></path>
                  </svg> Reset Pass </a>
                  <a class="dropdown-item d-flex align-items-center" href="#"><svg class="dropdown-icon text-gray-400 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                  </svg> View Details </a>
                  <a class="dropdown-item d-flex align-items-center" href="#"><svg class="dropdown-icon text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z"></path>
                  </svg> Suspend</a>
                </div>
              </div>
              <svg class="icon icon-xs text-danger ms-1" title="Delete" data-bs-toggle="tooltip" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            </td>
        `;

    tbody.appendChild(tr);
  });
  userCountDiv.textContent = `Total Users: ${users.length}`;
});
