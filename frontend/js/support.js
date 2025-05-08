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
// Test kullanıcıları
const users = {
    regular: {
        email: "test@example.com",
        password: "password123",
        username: "TestUser",
        type: "user"
    },
    admin: {
        email: "admin@notalone.com",
        password: "admin123",
        username: "Admin",
        type: "admin"
    },
    anotherUser: {
        email: "another@example.com",
        password: "password456",
        username: "AnotherUser",
        type: "user"
    }
};

// Login işlemi
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const errorDiv = document.createElement('div');
    
    // Hata mesajı div'ini oluştur
    errorDiv.style.color = '#e7bcbc';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '5px';
    errorDiv.id = 'loginError';
    
    // Varolan hata mesajını kaldır
    const existingError = document.getElementById('loginError');
    if (existingError) {
        existingError.remove();
    }

    // Admin kontrolü
    if (email.value === users.admin.email && password.value === users.admin.password) {
        window.open('../adminPanel/adminPanel.html', '_blank');
        closeRightMenu();
        return;
    }

    // Normal kullanıcı kontrolü
    if (email.value === users.regular.email && password.value === users.regular.password) {
        // Login formunu gizle
        document.getElementById('loginForm').style.display = 'none';
        
        // Kullanıcı panelini göster
        const userPanel = document.getElementById('userPanelContent');
        userPanel.style.display = 'block';
        
        // Kullanıcı adını güncelle
        document.getElementById('welcomeUsername').textContent = `Welcome, ${users.regular.username}`;
        
        // User ikonunu güncelle
        const userIcon = document.getElementById('userIcon');
        userIcon.innerHTML = '<i class="fa-solid fa-user logged-in-icon"></i>';
    } else {
        // Hata mesajı göster
        errorDiv.textContent = 'Invalid email or password';
        email.parentNode.insertBefore(errorDiv, email.nextSibling);
    }
}
// Logout işlemi
function handleLogout() {
    console.log('Logout attempt'); // Debug için
    
    // Kullanıcı panelini gizle
    document.getElementById('userPanelContent').style.display = 'none';
    
    // Login formunu göster
    document.querySelector('.auth-section').style.display = 'block';
    
    // User ikonunu sıfırla
    document.getElementById('userIcon').innerHTML = '<i class="fa-regular fa-user"></i>';
    
    // Form alanlarını temizle
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    // Paneli kapat
    closeRightMenu();
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

    // User panelindeki navigasyon linklerine event listener ekle
    document.querySelectorAll('.user-nav .nav-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const section = this.querySelector('span').textContent.trim().toLowerCase().replace(' ', '-');
            window.location.href = `userpanel.html#${section}`;
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

function handleSignUp(event) {
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

    // Şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    // Burada kayıt işlemi yapılacak
    console.log('Sign up data:', formData);
    alert('Registration successful! Please login.');
    showLogin();
}



function setupUserPanelNavigation() {
    document.querySelectorAll('.user-nav .nav-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Paneli kapat
            closeRightMenu();
            
            // Link hedefini al
            const section = this.querySelector('span').textContent.trim().toLowerCase().replace(' ', '-');
            
            // Sayfayı yönlendir ve sayfa geçişini geciktir
            setTimeout(() => {
                window.location.href = `userpanel.html#${section}`;
            }, 300);
        });
    });
}

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

    // User panel navigasyonunu kur
    setupUserPanelNavigation();
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

    // User panelindeki navigasyon linklerine event listener ekle
    document.querySelectorAll('.user-nav .nav-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const section = this.querySelector('span').textContent.trim().toLowerCase().replace(' ', '-');
            window.location.href = `userpanel.html#${section}`;
        });
    });
});

// Akordiyon işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif içeriği bul
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');
            
            // Tüm açık içerikleri kapat
            const allContents = document.querySelectorAll('.accordion-content');
            allContents.forEach(item => {
                item.classList.remove('active');
                item.style.maxHeight = null;
            });
            
            // Seçili içeriği aç/kapat
            if (!isActive) {
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});

// Sayfa yüklendiğinde ilk şehri açık göster (opsiyonel)
window.addEventListener('load', function() {
    const firstAccordion = document.querySelector('.accordion-button');
    if (firstAccordion) {
        firstAccordion.click();
    }
});

document.querySelectorAll('.accordion-title').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        const parent = item.parentElement;
        parent.classList.toggle('open');
        const icon = item.querySelector('i');
        icon.classList.toggle('fa-plus-circle');
        icon.classList.toggle('fa-minus-circle');
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var coll = document.getElementsByClassName("collapsible");
    
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            // Toggle active class
            this.classList.toggle("active");
            
            // Get the content element
            var content = this.nextElementSibling;
            
            // If the content is already open, close it
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                // Calculate the total height of the content including any nested elements
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
});