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

function showForumForm() {
    const form = document.getElementById("forumForm");
    const button = document.querySelector(".forum-cta-button");

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



// Gönderi Verilerini Al
async function fetchPosts() {
    try {
        const response = await fetch('https://api.example.com/posts'); // API URL'sini buraya ekleyin
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Gönderiler alınırken hata oluştu:', error);
    }
}

// Gönderileri Ekrana Ekle
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Mevcut gönderileri temizle

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';

        postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.userAvatar}" alt="avatar" class="post-avatar">
                <div class="post-user-info">
                    <div class="post-username">${post.username}</div>
                    <div class="post-time">${post.time}</div>
                </div>
            </div>
            <div class="post-content">
                <p class="post-text">${post.text}</p>
                ${post.image ? `<img src="${post.image}" alt="post image" class="post-image">` : ''}
            </div>
            <div class="interaction-bar">
                <button class="interaction-button" onclick="handleLike(this)">
                    <i class="far fa-heart"></i>
                    Beğen
                </button>
                <button class="interaction-button" onclick="toggleComments(this)">
                    <i class="far fa-comment"></i>
                    Yorum
                </button>
                <button class="interaction-button" onclick="handleSave(this)">
                    <i class="far fa-bookmark"></i>
                    Kaydet
                </button>
                <button class="interaction-button" onclick="handleShare(this)">
                    <i class="far fa-share-square"></i>
                    Paylaş
                </button>
            </div>
            <div class="comments-section" style="display: none;">
                ${post.comments.map(comment => `
                    <div class="comment">
                        <img src="${comment.avatar}" alt="avatar" class="post-avatar" style="width: 32px; height: 32px;">
                        <div class="comment-content">
                            <div class="comment-user">${comment.username}</div>
                            <div class="comment-text">${comment.text}</div>
                        </div>
                    </div>
                `).join('')}
                <div class="comment-form">
                    <input type="text" class="comment-input" placeholder="Yorum yazın...">
                    <button class="comment-submit" onclick="addComment(this)">Gönder</button>
                </div>
            </div>
        `;

        postsContainer.appendChild(postCard);
    });
}

// Sayfa Yüklendiğinde Gönderileri Al
document.addEventListener('DOMContentLoaded', fetchPosts);

let isLoggedIn = false; // Giriş durumunu kontrol etmek için
let userProfile = {}; // Kullanıcı bilgilerini saklamak için

function showLoginPrompt() {
    alert('You need to log in to share a post.');
}

function createPost() {
    if (!isLoggedIn) {
        showLoginPrompt();
        return;
    }

    const text = document.getElementById('newPostText').value;
    const image = document.getElementById('postImage').files[0];

    if (!text.trim()) return;

    const postHtml = `
        <div class="post-card">
            <div class="post-header">
                <img src="${userProfile.avatar}" alt="avatar" class="post-avatar">
                <div class="post-user-info">
                    <div class="post-username">${userProfile.username}</div>
                    <div class="post-time">Just now</div>
                </div>
            </div>
            <div class="post-content">
                <p class="post-text">${text}</p>
                ${image ? `<img src="${URL.createObjectURL(image)}" alt="post image" class="post-image">` : ''}
            </div>
            <div class="interaction-bar">
                <button class="interaction-button" onclick="handleLike(this)">
                    <i class="far fa-heart"></i>
                    Like
                </button>
                <button class="interaction-button" onclick="toggleComments(this)">
                    <i class="far fa-comment"></i>
                    Comment
                </button>
                <button class="interaction-button" onclick="handleSave(this)">
                    <i class="far fa-bookmark"></i>
                    Save
                </button>
                <button class="interaction-button" onclick="handleShare(this)">
                    <i class="far fa-share-square"></i>
                    Share
                </button>
            </div>
            <div class="comments-section" style="display: none;">
                <div class="comment-form">
                    <input type="text" class="comment-input" placeholder="Write a comment...">
                    <button class="comment-submit" onclick="addComment(this)">Send</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('posts-container').insertAdjacentHTML('afterbegin', postHtml);
    document.getElementById('newPostText').value = '';
    document.getElementById('postImage').value = '';
}

function handleLike(button) {
    if (!isLoggedIn) {
        showLoginPrompt();
        return;
    }
    button.classList.toggle('active');
    const icon = button.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
}

function toggleComments(button) {
    const post = button.closest('.post-card');
    const commentsSection = post.querySelector('.comments-section');
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
}

function handleSave(button) {
    if (!isLoggedIn) {
        showLoginPrompt();
        return;
    }
    button.classList.toggle('active');
    const icon = button.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
}

function handleShare(button) {
    if (!isLoggedLoggedIn) {
        showLoginPrompt();
        return;
    }
    alert('Share feature coming soon!');
}

function addComment(button) {
    if (!isLoggedIn) {
        showLoginPrompt();
        return;
    }

    const commentForm = button.closest('.comment-form');
    const input = commentForm.querySelector('.comment-input');
    const text = input.value.trim();

    if (!text) return;

    const commentHtml = `
        <div class="comment">
            <img src="${userProfile.avatar}" alt="avatar" class="post-avatar" style="width: 32px; height: 32px;">
            <div class="comment-content">
                <div class="comment-user">${userProfile.username}</div>
                <div class="comment-text">${text}</div>
            </div>
        </div>
    `;

    const commentsSection = button.closest('.comments-section');
    commentsSection.insertAdjacentHTML('afterbegin', commentHtml);
    input.value = '';
}

// Example login function to simulate user login and fetch user profile
function handleLogin(event) {
    event.preventDefault();
    // Simulate fetching user profile from backend
    userProfile = {
        username: 'John Doe',
        avatar: '/api/placeholder/40/40'
    };
    isLoggedIn = true;
    alert('Logged in successfully!');
}

// Share Button Click Event
document.getElementById('PostButton').addEventListener('click', function() {
    var postFormContainer = document.getElementById('postFormContainer');
    if (postFormContainer.style.display === 'none') {
        postFormContainer.style.display = 'block';
    } else {
        postFormContainer.style.display = 'none';
    }
});