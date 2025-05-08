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
    }
};

// Sağ menüyü aç/kapat
// Sağ ve sol menü için toggle fonksiyonları
function toggleRightMenu() {
    const sidenavRight = document.getElementById('loginPanel');
    if (sidenavRight) {
        sidenavRight.classList.toggle('active');
    }
}

function toggleLeftMenu() {
    const sidenav = document.getElementById('sidenav');
    if (sidenav) {
        sidenav.classList.toggle('active');
    }
}

// Sağ menü için açık kapama fonksiyonları
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


document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize Masonry
        const grid = document.querySelector('.grid');
        const masonry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-item',
            percentPosition: true
        });

        // Load dynamic stories
        const response = await fetch('/api/approved-stories');
        const stories = await response.json();
        const dynamicContainer = document.getElementById('dynamic-stories-container');

        stories.forEach(story => {
            const initials = story.author_info.split(' ')
                .map(name => name[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

            const storyElement = document.createElement('div');
            storyElement.className = 'grid-item dynamic-story';
            storyElement.innerHTML = `
                <p class="quote">"${story.content}"</p>
                <hr>
                <div class="author">
                    <div class="author-icon">${initials}</div>
                    <div class="author-info">${story.author_info}</div>
                </div>
            `;

            dynamicContainer.appendChild(storyElement);
        });

        // Refresh Masonry after all images load
        imagesLoaded(grid).on('progress', () => {
            masonry.layout();
        });

    } catch (error) {
        console.error('Error loading stories:', error);
    }
});





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

function filterPosts(keyword) {
    // Remove the # from the keyword if present
    keyword = keyword.replace('#', '').toLowerCase();
    
    const posts = document.querySelectorAll('.post-card');
    let foundPosts = false;
    
    posts.forEach(post => {
        // Get both the post content and post text
        const postContent = post.querySelector('.post-content p').textContent.toLowerCase();
        const shouldShow = postContent.includes(keyword);
        
        if (shouldShow) {
            post.style.display = 'block';
            foundPosts = true;
        } else {
            post.style.display = 'none';
        }
    });
    
    // If no posts were found, show a message
    const noPostsMessage = document.querySelector('.no-posts-message') || createNoPostsMessage();
    if (!foundPosts) {
        noPostsMessage.style.display = 'block';
    } else {
        noPostsMessage.style.display = 'none';
    }
}

// Helper function to create "no posts" message
function createNoPostsMessage() {
    const message = document.createElement('div');
    message.className = 'no-posts-message';
    message.style.cssText = `
        text-align: center;
        padding: 20px;
        font-size: 1.6rem;
        color: #666;
        background-color: #fff;
        border-radius: 10px;
        margin: 20px 0;
        display: none;
    `;
    message.textContent = 'Bu etikete ait gönderi bulunamadı.';
    
    const postsSection = document.querySelector('.posts-section');
    postsSection.appendChild(message);
    return message;
}


// Beğeni işlemi
function handleLike(button) {
    if (!isLoggedIn) {
        alert('Beğenmek için giriş yapmalısınız!');
        return;
    }

    button.classList.toggle('active');
    const likeCount = button.querySelector('.like-count');
    const currentLikes = parseInt(likeCount.textContent);
    
    if (button.classList.contains('active')) {
        likeCount.textContent = currentLikes + 1;
        button.querySelector('i').classList.replace('fa-regular', 'fa-solid');
        button.querySelector('i').style.color = '#e7bcbc';
    } else {
        likeCount.textContent = currentLikes - 1;
        button.querySelector('i').classList.replace('fa-solid', 'fa-regular');
        button.querySelector('i').style.color = '';
    }
}

// Kaydetme işlemi
function handleSave(button) {
    if (!isLoggedIn) {
        alert('Kaydetmek için giriş yapmalısınız!');
        return;
    }
    button.classList.toggle('active');
    if (button.classList.contains('active')) {
        button.querySelector('i').classList.replace('fa-regular', 'fa-solid');
        button.querySelector('i').style.color = '#e7bcbc';
    } else {
        button.querySelector('i').classList.replace('fa-solid', 'fa-regular');
        button.querySelector('i').style.color = '';
    }
}

// Paylaşma işlemi
function handleShare(button) {
    const postUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'NOTALONE Forum Post',
            text: 'Check out this post on NOTALONE Forum',
            url: postUrl
        });
    } else {
        alert('Post URL copied to clipboard!');
        navigator.clipboard.writeText(postUrl);
    }
}

// Yorum ekleme işlemi
function handleComment(event, form) {
    event.preventDefault();
    
    if (!isLoggedIn) {
        alert('Yorum yapmak için giriş yapmalısınız!');
        return;
    }

    const input = form.querySelector('.comment-input');
    const commentText = input.value.trim();
    
    if (!commentText) return;

    const comment = document.createElement('div');
    comment.className = 'comment';
    comment.innerHTML = `
        <img src="img/avatar.jpg" alt="User Avatar" class="comment-avatar">
        <div class="comment-content">
            <h4 class="comment-username">${currentUser.username}</h4>
            <p>${commentText}</p>
        </div>
    `;
    
    form.parentElement.insertBefore(comment, form);
    input.value = '';
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Login form event listener
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button event listener
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Like buttons
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', () => handleLike(button));
    });

    // Save buttons
    document.querySelectorAll('.save-button').forEach(button => {
        button.addEventListener('click', () => handleSave(button));
    });

    // Share buttons
    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', () => handleShare(button));
    });

    // Comment forms
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', (e) => handleComment(e, form));
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.grid-item');
    
    // Add hover effect with smooth animation
    cards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Masonry layout'u başlat
var grid = document.querySelector('.grid');
var masonry = new Masonry(grid, {
    itemSelector: '.grid-item',
    columnWidth: '.grid-item',
    gutter: 20,
    fitWidth: true
});

// Sayfa yüklendiğinde ve her resim yüklendiğinde layout'u yeniden hesapla
window.addEventListener('load', function() {
    masonry.layout();
});

// Pencere boyutu değiştiğinde layout'u yeniden hesapla
window.addEventListener('resize', function() {
    masonry.layout();
});

function showStoryForm() {
    const form = document.getElementById("storyForm");
    const button = document.querySelector(".cta-button");

    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
        setTimeout(() => {
            form.style.opacity = "1";
            form.style.transform = "translateY(0)";
        }, 10);
        button.style.marginBottom = "30px";
    } else {
        form.style.opacity = "0";
        form.style.transform = "translateY(-20px)";
        setTimeout(() => {
            form.style.display = "none";
        }, 500);
    }
}

function updateProfileIcon() {
    const input = document.getElementById("nickname");
    const icon = document.getElementById("profileIcon");
    const words = input.value.trim().split(" ");
    const initials = words.map(word => word[0]?.toUpperCase()).slice(0, 2).join("");
    icon.textContent = initials || "?";
}

if (typeof Masonry !== 'undefined') {
    new Masonry('.grid', {
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        percentPosition: true,
        transitionDuration: 0 // For smoother loading
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/stories/combined');
        const data = await response.json();
        
        // Render static stories
        const staticContainer = document.getElementById('static-stories');
        data.static_stories.forEach(story => {
            staticContainer.innerHTML += `
                <div class="story-card static-story">
                    <p>${story.content}</p>
                    <div class="author">- ${story.author_info}</div>
                </div>
            `;
        });

        // Render dynamic stories
        const dynamicContainer = document.getElementById('dynamic-stories');
        data.dynamic_stories.forEach(story => {
            dynamicContainer.innerHTML += `
                <div class="story-card dynamic-story">
                    <p>${story.content}</p>
                    <div class="author">- ${story.author_info}</div>
                </div>
            `;
        });
        
    } catch (error) {
        console.error('Error loading stories:', error);
    }
});