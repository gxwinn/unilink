// Profile Pages

function renderProfile() {
    if (!isUserAuthenticated()) {
        router.navigate('/login');
        return;
    }
    const userPosts = posts.filter(p => p.userId === currentUser.id);
    const savedPostsList = posts.filter(p => currentUser.savedPosts.includes(p.id));
    
    const userPostsHTML = userPosts.length > 0
        ? userPosts.map(post => createPostCard(post)).join('')
        : '<div class="empty-state"><p>No posts yet</p></div>';
    
    const savedPostsHTML = savedPostsList.length > 0
        ? savedPostsList.map(post => createPostCard(post)).join('')
        : '<div class="empty-state"><p>No saved posts</p></div>';
    
    const statusClass = currentUser.status.toLowerCase();
    const verifiedBadge = currentUser.verified ? '<span style="color: var(--success-green); margin-left: 8px;">✓ Verified</span>' : '';
    
    const content = `
        <div class="page-container">
            <div class="profile-header">
                <div class="profile-top">
                    <img src="${currentUser.avatar}" alt="${currentUser.name}" class="profile-avatar" onerror="this.src='https://via.placeholder.com/120'">
                    <div class="profile-info">
                        <div class="profile-name">
                            ${escapeHtml(currentUser.name)}
                            ${verifiedBadge}
                        </div>
                        <div class="profile-username">${escapeHtml(currentUser.username)}</div>
                        <span class="profile-status-badge ${statusClass}">${currentUser.status}</span>
                        <div class="profile-bio">${escapeHtml(currentUser.bio)}</div>
                    </div>
                </div>
                <div class="profile-details">
                    <div class="profile-detail-item">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        ${escapeHtml(currentUser.email)}
                    </div>
                    ${currentUser.university ? `
                        <div class="profile-detail-item">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            ${escapeHtml(currentUser.university)}
                        </div>
                    ` : ''}
                </div>
                <div class="profile-actions">
                    <a href="/profile/edit" class="btn-primary" data-link style="text-decoration: none; display: inline-block;">Edit Profile</a>
                    <button class="btn-secondary" id="switch-account-type-btn">Switch to ${currentUser.status === 'Student' ? 'Applicant' : 'Student'}</button>
                </div>
            </div>
            <div style="margin-top: 30px;">
                <div style="display: flex; gap: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color);">
                    <button class="profile-tab-btn active" data-tab="posts" style="background: none; border: none; color: var(--text-primary); padding: 12px 0; border-bottom: 2px solid var(--accent-red); cursor: pointer; font-size: 16px; font-weight: 500;">My Posts</button>
                    <button class="profile-tab-btn" data-tab="saved" style="background: none; border: none; color: var(--text-secondary); padding: 12px 0; border-bottom: 2px solid transparent; cursor: pointer; font-size: 16px; font-weight: 500;">Saved</button>
                </div>
                <div id="profile-posts-container">
                    ${userPostsHTML}
                </div>
                <div id="profile-saved-container" style="display: none;">
                    ${savedPostsHTML}
                </div>
            </div>
        </div>
    `;
    
    renderPage(content);
    
    // Initialize tabs
    initializeProfileTabs();
    
    // Initialize switch account type
    const switchBtn = document.getElementById('switch-account-type-btn');
    if (switchBtn) {
        switchBtn.addEventListener('click', () => {
            const newStatus = currentUser.status === 'Student' ? 'Applicant' : 'Student';
            updateCurrentUserProfile({ status: newStatus });
            showNotification(`Switched to ${newStatus}`);
            renderProfile();
        });
    }
}

function initializeProfileTabs() {
    const tabButtons = document.querySelectorAll('.profile-tab-btn');
    const postsContainer = document.getElementById('profile-posts-container');
    const savedContainer = document.getElementById('profile-saved-container');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            
            // Update active state
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.style.color = 'var(--text-secondary)';
                b.style.borderBottomColor = 'transparent';
            });
            btn.classList.add('active');
            btn.style.color = 'var(--text-primary)';
            btn.style.borderBottomColor = 'var(--accent-red)';
            
            // Show/hide containers
            if (tab === 'posts') {
                if (postsContainer) postsContainer.style.display = 'block';
                if (savedContainer) savedContainer.style.display = 'none';
            } else {
                if (postsContainer) postsContainer.style.display = 'none';
                if (savedContainer) savedContainer.style.display = 'block';
            }
        });
    });
}

function renderProfileEdit() {
    if (!isUserAuthenticated()) {
        router.navigate('/login');
        return;
    }
    const universityOptions = getUniversityOptions()
        .map(uni => `<option value="${uni.name}" ${currentUser.university === uni.name ? 'selected' : ''}>${uni.name} (${uni.country})</option>`)
        .join('');

    const content = `
        <div class="page-container">
            <div style="margin-bottom: 20px;">
                <a href="/profile" class="btn-secondary" data-link style="text-decoration: none; display: inline-block;">
                    ← Back to Profile
                </a>
            </div>
            <div class="form-container">
                <h1 style="font-size: 24px; margin-bottom: 24px;">Edit Profile</h1>
                <form id="edit-profile-form">
                    <div class="form-group">
                        <label class="form-label">Profile Photo</label>
                        <div class="avatar-upload">
                            <img src="${currentUser.avatar || AVATARS.default}" class="avatar-preview" id="edit-avatar-preview" alt="Avatar preview" onerror="this.src='assets/avatars/avatar-default.svg'">
                            <input type="file" id="edit-avatar-input" accept="image/*">
                        </div>
                        <div class="form-error" id="avatar-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="edit-name" value="${escapeHtml(currentUser.name)}" required>
                        <div class="form-error" id="name-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" class="form-input" id="edit-username" value="${escapeHtml(currentUser.username)}" required>
                        <div class="form-error" id="username-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="edit-email" value="${escapeHtml(currentUser.email)}" required>
                        <div class="form-error" id="email-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">University</label>
                        <select class="form-input" id="edit-university">
                            <option value="">Select university</option>
                            ${universityOptions}
                        </select>
                        <div class="university-add">
                            <input type="text" class="form-input" id="edit-custom-university" placeholder="Add custom university">
                            <button type="button" class="btn-secondary" id="edit-add-university-btn">Add</button>
                        </div>
                        <div class="form-error" id="university-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bio</label>
                        <textarea class="form-input form-textarea" id="edit-bio" required>${escapeHtml(currentUser.bio || '')}</textarea>
                        <div class="form-error" id="bio-error"></div>
                    </div>
                    <div class="form-actions">
                        <a href="/profile" class="btn-secondary" data-link style="text-decoration: none; display: inline-block;">Cancel</a>
                        <button type="submit" class="btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    renderPage(content);
    initializeProfileEditForm();
}

function initializeProfileEditForm() {
    const form = document.getElementById('edit-profile-form');
    if (!form) return;

    let avatarData = currentUser.avatar || AVATARS.default;
    const avatarInput = document.getElementById('edit-avatar-input');
    const avatarPreview = document.getElementById('edit-avatar-preview');

    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                avatarData = event.target.result;
                if (avatarPreview) {
                    avatarPreview.src = avatarData;
                }
            };
            reader.readAsDataURL(file);
        });
    }

    const addUniBtn = document.getElementById('edit-add-university-btn');
    if (addUniBtn) {
        addUniBtn.addEventListener('click', () => {
            const customInput = document.getElementById('edit-custom-university');
            if (!customInput) return;
            const value = customInput.value.trim();
            if (!value) return;
            const newUni = addUniversityOption(value);
            populateEditUniversitySelect(newUni?.name);
            customInput.value = '';
            showNotification('University added');
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearProfileErrors(form);

        const name = document.getElementById('edit-name').value.trim();
        const usernameRaw = document.getElementById('edit-username').value.trim();
        const username = usernameRaw.startsWith('@') ? usernameRaw : `@${usernameRaw.replace(/^@+/, '')}`;
        const email = document.getElementById('edit-email').value.trim();
        const university = document.getElementById('edit-university').value;
        const bio = document.getElementById('edit-bio').value.trim();

        if (!name) {
            setProfileError('name-error', 'Name is required');
            return;
        }

        if (!username || username.length < 3) {
            setProfileError('username-error', 'Username must include @ and be at least 3 characters');
            return;
        }

        if (!email || !isValidEmail(email)) {
            setProfileError('email-error', 'Enter a valid email address');
            return;
        }

        updateCurrentUserProfile({
            name,
            username,
            email,
            university,
            bio,
            avatar: avatarData
        });

        showNotification('Profile updated');
        router.navigate('/profile');
    });
}

function populateEditUniversitySelect(selectedValue) {
    const select = document.getElementById('edit-university');
    if (!select) return;
    const options = getUniversityOptions()
        .map(uni => `<option value="${uni.name}" ${uni.name === selectedValue ? 'selected' : ''}>${uni.name} (${uni.country})</option>`)
        .join('');
    select.innerHTML = `<option value="">Select university</option>${options}`;
}

function setProfileError(id, message) {
    const target = document.getElementById(id);
    if (target) target.textContent = message;
}

function clearProfileErrors(scope) {
    scope.querySelectorAll('.form-error').forEach(err => err.textContent = '');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
