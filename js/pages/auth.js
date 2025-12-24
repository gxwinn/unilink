// Authentication & Registration
let pendingVerificationEmail = null;

function renderAuth(activeTab = 'login') {
    if (isUserAuthenticated()) {
        router.navigate('/home');
        return;
    }
    const fallbackAvatar = currentUser?.avatar || AVATARS.default;
    const isLogin = activeTab === 'login';
    const content = `
        <div class="page-container auth-page">
            <div class="auth-card">
                <div class="demo-credentials" style="padding:8px 16px; font-size:13px; color:var(--text-secondary);">
                    Demo credentials: <strong>tsi@auca.kg</strong> / <strong>123</strong>
                </div>
                <div class="auth-tabs">
                    <button class="auth-tab ${isLogin ? 'active' : ''}" data-tab="login">Sign In</button>
                    <button class="auth-tab ${!isLogin ? 'active' : ''}" data-tab="register">Create Account</button>
                </div>
                <form id="login-form" class="auth-form ${isLogin ? 'active' : ''}">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="login-email" placeholder="you@university.edu">
                        <div class="auth-error" id="login-email-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-input" id="login-password" placeholder="Enter your password">
                        <div class="auth-error" id="login-password-error"></div>
                    </div>
                    <div class="auth-error" id="login-general-error"></div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 12px;">Sign In</button>
                </form>

                <form id="register-form" class="auth-form ${!isLogin ? 'active' : ''}">
                    <div class="form-group">
                        <label class="form-label">Account Type</label>
                        <div class="auth-tabs" style="margin-bottom: 0;">
                            <label class="auth-tab active" id="student-tab">
                                <input type="radio" name="account-type" value="Student" checked style="display:none;">
                                Student
                            </label>
                            <label class="auth-tab" id="applicant-tab">
                                <input type="radio" name="account-type" value="Applicant" style="display:none;">
                                Applicant
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-input" id="register-name" placeholder="Jane Smith">
                        <div class="auth-error" id="register-name-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" class="form-input" id="register-username" placeholder="@janesmith">
                        <div class="auth-error" id="register-username-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="register-email" placeholder="you@university.edu">
                        <div class="auth-error" id="register-email-error"></div>
                        <small style="color: var(--text-secondary); font-size: 12px;" id="email-hint">
                            Use your university email for student accounts
                        </small>
                    </div>
                    <div class="form-group">
                        <label class="form-label">University</label>
                        <select class="form-input" id="register-university"></select>
                        <div class="university-add">
                            <input type="text" class="form-input" id="custom-university-input" placeholder="Add custom university">
                            <button type="button" class="btn-secondary" id="add-university-btn" style="padding: 0 16px;">Add</button>
                        </div>
                        <div class="auth-error" id="register-university-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Profile Photo</label>
                        <div class="avatar-upload">
                            <img src="${fallbackAvatar}" class="avatar-preview" id="register-avatar-preview" alt="Avatar preview">
                            <input type="file" id="register-avatar" accept="image/*">
                        </div>
                        <div class="auth-error" id="register-avatar-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bio</label>
                        <textarea class="form-input form-textarea" id="register-bio" placeholder="Tell everyone about yourself"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-input" id="register-password" placeholder="At least 8 characters">
                        <div class="auth-error" id="register-password-error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Confirm Password</label>
                        <input type="password" class="form-input" id="register-password-confirm" placeholder="Repeat your password">
                        <div class="auth-error" id="register-password-confirm-error"></div>
                    </div>
                    <div class="auth-error" id="register-general-error"></div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Create Account</button>
                </form>
            </div>
        </div>

        <div class="verification-modal" id="verification-modal">
            <div class="verification-content">
                <h2>Email verification</h2>
                <p>We sent a 6-digit code to <strong id="verification-email"></strong></p>
                <p class="verification-debug">Demo code: <span id="verification-code-debug"></span></p>
                <input type="text" class="form-input" maxlength="6" id="verification-code-input" placeholder="______">
                <div class="auth-error" id="verification-error"></div>
                <div class="verification-actions">
                    <button class="btn-secondary" id="verification-cancel-btn" style="flex:1;">Cancel</button>
                    <button class="btn-primary" id="verification-submit-btn" style="flex:1;">Verify</button>
                </div>
            </div>
        </div>
    `;

    renderPage(content);
    initializeAuthForms(activeTab);
}

function initializeAuthForms(activeTab) {
    document.querySelectorAll('.auth-tab[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            if (tab && tab !== activeTab) {
                renderAuth(tab);
            }
        });
    });

    initAccountTypeTabs();
    initLoginForm();
    initRegisterForm();
    initVerificationModal();
}

function initAccountTypeTabs() {
    const studentTab = document.getElementById('student-tab');
    const applicantTab = document.getElementById('applicant-tab');
    const emailHint = document.getElementById('email-hint');

    [studentTab, applicantTab].forEach(tab => {
        if (!tab) return;
        tab.addEventListener('click', () => {
            [studentTab, applicantTab].forEach(t => t?.classList.remove('active'));
            tab.classList.add('active');
            const input = tab.querySelector('input[name="account-type"]');
            if (input) input.checked = true;
            if (emailHint) {
                emailHint.textContent = input?.value === 'Student'
                    ? 'Use your university email for student accounts'
                    : 'Any email works for applicant accounts';
            }
        });
    });
}

function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAuthErrors(form);

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!email || !isValidEmail(email)) {
            setAuthError('login-email-error', 'Enter a valid email');
            return;
        }

        if (!password) {
            setAuthError('login-password-error', 'Enter your password');
            return;
        }

        const result = authenticateUser(email, password);
        if (!result.success) {
            setAuthError('login-general-error', result.message);
            return;
        }

        showNotification('Welcome back!');
        // Re-render layout so header shows logout button after login
        try { renderLayout(); } catch (e) { /* ignore if not available */ }
        router.navigate('/');
    });
}

function initRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    populateUniversitySelect();

    let avatarData = currentUser?.avatar || AVATARS.default;
    const avatarInput = document.getElementById('register-avatar');
    const avatarPreview = document.getElementById('register-avatar-preview');

    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                avatarData = ev.target.result;
                if (avatarPreview) {
                    avatarPreview.src = avatarData;
                }
            };
            reader.readAsDataURL(file);
        });
    }

    const addUniBtn = document.getElementById('add-university-btn');
    if (addUniBtn) {
        addUniBtn.addEventListener('click', () => {
            const customInput = document.getElementById('custom-university-input');
            if (!customInput) return;
            const value = customInput.value.trim();
            if (!value) return;
            const newUni = addUniversityOption(value);
            populateUniversitySelect(newUni?.name);
            customInput.value = '';
            showNotification('University added');
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAuthErrors(form);

        const accountType = form.querySelector('input[name="account-type"]:checked')?.value || 'Applicant';
        const name = document.getElementById('register-name').value.trim();
        const usernameInput = document.getElementById('register-username');
        const usernameRaw = (usernameInput ? usernameInput.value : '').trim();
        const username = usernameRaw
            ? (usernameRaw.startsWith('@') ? usernameRaw : `@${usernameRaw.replace(/^@+/, '')}`)
            : '';
        const email = document.getElementById('register-email').value.trim();
        const university = document.getElementById('register-university').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-password-confirm').value;
        const bio = document.getElementById('register-bio').value.trim();

        if (!name) {
            setAuthError('register-name-error', 'Name is required');
            return;
        }

        if (!username || username.length < 3) {
            setAuthError('register-username-error', 'Username must include @ and be at least 3 characters');
            return;
        }

        if (!email || !isValidEmail(email)) {
            setAuthError('register-email-error', 'Provide a valid email address');
            return;
        }

        if (accountType === 'Student' && !email.includes('.edu') && !email.includes('university')) {
            setAuthError('register-email-error', 'Student accounts require university emails');
            return;
        }

        if (!university) {
            setAuthError('register-university-error', 'Select your university');
            return;
        }

        if (!password || password.length < 8) {
            setAuthError('register-password-error', 'Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setAuthError('register-password-confirm-error', 'Passwords do not match');
            return;
        }

        const result = registerUser({
            accountType,
            name,
            username,
            email,
            university,
            password,
            bio,
            avatar: avatarData
        });

        if (!result.success) {
            setAuthError('register-general-error', result.message);
            return;
        }

        openVerificationModal(result.user, result.verificationCode);
        form.reset();
        if (avatarPreview) avatarPreview.src = currentUser?.avatar || AVATARS.default;
        avatarData = currentUser?.avatar || AVATARS.default;
    });
}

function populateUniversitySelect(selectedValue) {
    const select = document.getElementById('register-university');
    if (!select) return;
    const options = getUniversityOptions()
        .map(uni => `<option value="${uni.name}" ${uni.name === selectedValue ? 'selected' : ''}>${uni.name} (${uni.country})</option>`)
        .join('');
    select.innerHTML = `<option value="">Select your university</option>${options}`;
}

function initVerificationModal() {
    const modal = document.getElementById('verification-modal');
    if (!modal) return;

    document.getElementById('verification-cancel-btn')?.addEventListener('click', closeVerificationModal);
    document.getElementById('verification-submit-btn')?.addEventListener('click', handleVerificationSubmit);
}

function openVerificationModal(user, code) {
    pendingVerificationEmail = user.email;
    const modal = document.getElementById('verification-modal');
    if (!modal) return;
    document.getElementById('verification-email').textContent = user.email;
    document.getElementById('verification-code-debug').textContent = code;
    document.getElementById('verification-code-input').value = '';
    setAuthError('verification-error', '');
    modal.classList.add('show');
}

function closeVerificationModal() {
    const modal = document.getElementById('verification-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function handleVerificationSubmit() {
    const input = document.getElementById('verification-code-input');
    if (!input) return;
    const code = input.value.trim();
    if (code.length !== 6) {
        setAuthError('verification-error', 'Enter the 6-digit code');
        return;
    }
    if (!pendingVerificationEmail) {
        setAuthError('verification-error', 'Nothing to verify');
        return;
    }

    const result = confirmEmail(pendingVerificationEmail, code);
    if (!result.success) {
        setAuthError('verification-error', result.message);
        return;
    }

    closeVerificationModal();
    showNotification('Email verified! Welcome to UniLink');
    router.navigate('/');
}

function setAuthError(id, message) {
    const target = document.getElementById(id);
    if (!target) return;
    target.textContent = message || '';
}

function clearAuthErrors(scopeElement) {
    const errors = scopeElement.querySelectorAll('.auth-error');
    errors.forEach(err => err.textContent = '');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
