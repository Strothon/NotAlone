async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
/*
        // Changed from data.token to data.access_token
        if (response.ok && data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Rest of your UI update code remains the same
            const loginForm = document.getElementById('loginForm');
            if (loginForm) loginForm.style.display = 'none';

            const userPanel = document.getElementById('userPanelContent');
            if (userPanel) {
                userPanel.style.display = 'block';
                const welcomeUsername = document.getElementById('welcomeUsername');
                if (welcomeUsername) {
                    welcomeUsername.textContent = `Welcome, ${data.user.firstName}`;
                }
            }

            const userIcon = document.getElementById('userIcon');
            if (userIcon) {
                userIcon.innerHTML = '<i class="fa-solid fa-user logged-in-icon"></i>';
            }
        } else {
*/
        if (response.ok && data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on admin status
            if (data.user.isAdmin) {
                window.location.href = '/adminpanel';
            } else {
                window.location.href = '/userpanel';
            }
        } else {
            // Use error message from API response
            alert(`Login failed: ${data.message || 'Invalid credentials'}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

async function handleSignUp(event) {
    event.preventDefault();
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('signUpEmail').value,
        password: document.getElementById('signUpPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        phone: document.getElementById('phone').value,
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value
    };

    if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        // Handle 201 Created status
        if (response.status === 201) {
            alert('Registration successful! Please login.');
            showLogin();
        } else {
            // Use error message from API response
            alert(`Registration failed: ${data.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
}

async function handleLogout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            // Clear client-side storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Force full page reload to reset application state
            window.location.href = '/';  // Redirect to home page
        } else {
            const errorData = await response.json();
            alert(`Logout failed: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout');
    }
}

// Add this function to check authentication status on page load
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && user) {
        // Update UI elements
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.style.display = 'none';

        const userPanel = document.getElementById('userPanelContent');
        if (userPanel) userPanel.style.display = 'block';

        const welcomeUsername = document.getElementById('welcomeUsername');
        if (welcomeUsername) {
            welcomeUsername.textContent = `Welcome, ${user.firstName}`;
        }

        const userIcon = document.getElementById('userIcon');
        if (userIcon) {
            userIcon.innerHTML = '<i class="fa-solid fa-user logged-in-icon"></i>';
        }
        
        // Only redirect if trying to access protected routes
        if (window.location.pathname === '/adminpanel' && !user.isAdmin) {
            window.location.href = '/';
        }
    } else {
        // Redirect to home if not logged in and trying to access panels
        if (window.location.pathname.includes('adminpanel') || 
            window.location.pathname.includes('userpanel')) {
            window.location.href = '/';
        }
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', checkAuthStatus);
// END of my code

// Menü Aç/Kapat İşlevi
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');  // Sol kenar sütununun genişlemesi
}

// Makale kartlarını filtrele
function filterArticles() {
    var input, filter, cards, titles, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    cards = document.getElementsByClassName('article-card');
    
    // Makale kartları üzerinde gezinme
    for (i = 0; i < cards.length; i++) {
        titles = cards[i].getElementsByClassName('title')[0];
        if (titles) {
            txtValue = titles.textContent || titles.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                cards[i].style.display = "";
            } else {
                cards[i].style.display = "none";
            }
        }
    }
}

// Makale kartlarını sıralama
function sortArticles() {
    var cards, i, switching, shouldSwitch, dir, switchcount = 0;
    var sortOption = document.getElementById('sortSelect').value;
    cards = Array.from(document.getElementsByClassName('article-card'));
    switching = true;
    dir = "desc"; // Varsayılan sıralama en yeniye doğru

    // Eğer 'En Eski' seçildiyse, sıralama yönünü değiştir
    if (sortOption === 'oldest') {
        dir = "asc";
    }

    // Makale kartlarını tarihe göre sıralamak
    while (switching) {
        switching = false;
        for (i = 0; i < (cards.length - 1); i++) {
            shouldSwitch = false;
            
            // Tarihleri al
            var date1 = new Date(cards[i].getAttribute('data-date'));
            var date2 = new Date(cards[i + 1].getAttribute('data-date'));

            // Tarihlere göre sıralama yap
            if (dir === "desc" && date1 < date2) {
                shouldSwitch = true;
                break;
            } else if (dir === "asc" && date1 > date2) {
                shouldSwitch = true;
                break;
            }
        }

        if (shouldSwitch) {
            cards[i].parentNode.insertBefore(cards[i + 1], cards[i]);
            switching = true;
            switchcount++;
        }
    }
}

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function() {
    // Login formu submit event listener
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout butonu event listener
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    document.querySelectorAll('.fa-user, [data-profile]').forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.preventDefault();
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            
            if (user && user.isAdmin) {
                window.location.href = '/adminpanel';
            } else if (user) {
                window.location.href = '/userpanel';
            } else {
                openRightMenu(); // Show login panel if not logged in
            }
        });
    });

});

// Panel geçişleri için fonksiyonlar
function showLogin(event) {
    if (event) event.preventDefault();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('userPanelContent').style.display = 'none';
}

function showForgotPassword(event) {
    if (event) event.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('userPanelContent').style.display = 'none';
}

function showSignUp(event) {
    if (event) event.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('signUpForm').style.display = 'block';
    document.getElementById('userPanelContent').style.display = 'none';
}

// Form işleme fonksiyonları
function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value;
    // Burada şifre sıfırlama e-postası gönderme işlemi yapılacak
    alert(`Password reset link has been sent to ${email}`);
    showLogin();
}

// Sağ menüyü aç/kapat
function toggleRightMenu() {
    const sidenavRight = document.getElementById('loginPanel');
    if (sidenavRight) {
        sidenavRight.classList.toggle('active');
    }
}

function closeRightMenu() {
    const sidenavRight = document.getElementById('loginPanel');
    if (sidenavRight) {
        sidenavRight.classList.remove('active');
    }
}

function openRightMenu() {
    const sidenavRight = document.getElementById('loginPanel');
    if (sidenavRight) {
        sidenavRight.classList.add('active');
    }
}

// User icon click event listener
document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
        userIcon.addEventListener('click', function(event) {
            event.preventDefault();
            toggleRightMenu();
        });
    }
});
// Şifre göster/gizle işlevi
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('loginPassword');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});
// Şifreyi göster/gizle fonksiyonu
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('loginPassword');
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // İkonu değiştirme
    const icon = this;
    if (type === 'password') {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
});