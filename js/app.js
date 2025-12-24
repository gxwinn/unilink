// Main Application

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Render layout
    renderLayout();
    
    // Register routes
    registerRoutes();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Handle initial route
    router.handleRoute();
}

function renderLayout() {
    const app = document.getElementById('app');
    if (!app) return;
    
    const currentPath = window.location.pathname;
    app.innerHTML = `
        ${createHeader()}
        <div class="app-container">
            ${createSidebar(currentPath)}
            <main class="main-content" id="main-content">
                <!-- Content will be loaded here -->
            </main>
        </div>
        ${createBottomNav(currentPath)}
    `;
}

function registerRoutes() {
    // Home
    router.register('/', () => renderHome());
    router.register('/home', () => renderHome());
    
    // Post Details
    router.register('/post/:id', (params) => renderPostDetails(params.id));
    
    // Explore
    router.register('/explore', () => renderExplore());
    router.register('/explore/universities', () => renderExploreUniversities());
    router.register('/explore/countries', () => renderExploreCountries());
    router.register('/explore/tags', () => renderExploreTags());
    
    // Communities
    router.register('/communities', () => renderCommunities());
    router.register('/communities/:id', (params) => renderCommunityDetails(params.id));
    
    // Events
    router.register('/events', () => renderEvents());
    router.register('/events/:id', (params) => renderEventDetails(params.id));
    
    // Profile
    router.register('/profile', () => renderProfile());
    router.register('/profile/edit', () => renderProfileEdit());
    
    // Auth
    router.register('/login', () => renderAuth('login'));
    router.register('/register', () => renderAuth('register'));
    
    // Messages
    router.register('/messages', () => renderMessages());
    router.register('/messages/:id', (params) => renderChat(params.id));
}

function initializeEventListeners() {
    // Global event delegation for post actions
    document.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]');
        if (!action) return;
        
        const actionType = action.getAttribute('data-action');
        
        switch (actionType) {
            case 'like':
                handleLikePost(action.getAttribute('data-post-id'));
                break;
            case 'comment':
                handleCommentClick(action.getAttribute('data-post-id'));
                break;
            case 'share':
                handleSharePost(action.getAttribute('data-post-id'));
                break;
            case 'join-community':
                handleJoinCommunity(action.getAttribute('data-community-id'));
                break;
            case 'register-event':
                handleRegisterEvent(action.getAttribute('data-event-id'));
                break;
            case 'logout':
                // Clear current user and navigate to auth page
                if (typeof logoutCurrentUser === 'function') logoutCurrentUser();
                // Re-render layout so header/sidebar reflect logged-out state
                try { renderLayout(); } catch (e) {}
                showNotification('Logged out');
                router.navigate('/login');
                break;
        }
    });
    
    // Post card click (navigate to post details)
    document.addEventListener('click', (e) => {
        const postCard = e.target.closest('.post-card');
        if (postCard && !e.target.closest('.post-actions')) {
            const postId = postCard.getAttribute('data-post-id');
            if (postId) {
                router.navigate(`/post/${postId}`);
            }
        }
    });
    
    // Community card click
    document.addEventListener('click', (e) => {
        const communityCard = e.target.closest('.community-card');
        if (communityCard && !e.target.closest('button')) {
            const communityId = communityCard.getAttribute('data-community-id');
            if (communityId) {
                router.navigate(`/communities/${communityId}`);
            }
        }
    });
    
    // Event card click
    document.addEventListener('click', (e) => {
        const eventCard = e.target.closest('.event-card');
        if (eventCard && !e.target.closest('button')) {
            const eventId = eventCard.getAttribute('data-event-id');
            if (eventId) {
                router.navigate(`/events/${eventId}`);
            }
        }
    });
    
    // Message item click
    document.addEventListener('click', (e) => {
        const messageItem = e.target.closest('.message-item');
        if (messageItem) {
            const conversationId = messageItem.getAttribute('data-conversation-id');
            if (conversationId) {
                router.navigate(`/messages/${conversationId}`);
            }
        }
    });
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    router.navigate(`/explore?q=${encodeURIComponent(query)}`);
                }
            }
        });
    }
}

function handleLikePost(postId) {
    const post = togglePostLike(postId);
    if (post) {
        // Update UI
        const postCard = document.querySelector(`[data-post-id="${postId}"]`);
        if (postCard) {
            const likeBtn = postCard.querySelector('[data-action="like"]');
            const likeCount = likeBtn.querySelector('.like-count');
            
            if (post.liked) {
                likeBtn.classList.add('liked');
                likeBtn.querySelector('svg').setAttribute('fill', 'currentColor');
                showNotification('Post liked!');
            } else {
                likeBtn.classList.remove('liked');
                likeBtn.querySelector('svg').setAttribute('fill', 'none');
            }
            
            if (likeCount) {
                likeCount.textContent = post.likes;
            }
        }
    }
}

function handleCommentClick(postId) {
    router.navigate(`/post/${postId}`);
}

function handleSharePost(postId) {
    showNotification('Post shared!');
}

function handleJoinCommunity(communityId) {
    const community = toggleCommunityJoin(communityId);
    if (community) {
        // Update UI
        const communityCard = document.querySelector(`[data-community-id="${communityId}"]`);
        if (communityCard) {
            const btn = communityCard.querySelector('button');
            const membersText = communityCard.querySelector('.community-members');
            
            btn.textContent = community.joined ? 'Leave' : 'Join';
            btn.className = `btn-${community.joined ? 'secondary' : 'primary'}`;
            
            if (membersText) {
                membersText.textContent = `${community.members.toLocaleString()} members`;
            }
            
            showNotification(community.joined ? 'Joined community!' : 'Left community');
        }
    }
}

function handleRegisterEvent(eventId) {
    const event = toggleEventRegistration(eventId);
    if (event) {
        // Update UI
        const eventCard = document.querySelector(`[data-event-id="${eventId}"]`);
        if (eventCard) {
            const btn = eventCard.querySelector('button');
            btn.textContent = event.registered ? 'Registered' : 'Register';
            btn.className = `btn-${event.registered ? 'secondary' : 'primary'}`;
            
            showNotification(event.registered ? 'Event registered!' : 'Registration cancelled');
        }
    }
}

function renderPage(content) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = content;
        // Re-render layout to update active state
        const currentPath = window.location.pathname;
        const app = document.getElementById('app');
        if (app) {
            const sidebar = app.querySelector('.sidebar');
            const bottomNav = app.querySelector('.bottom-nav');
            if (sidebar) {
                sidebar.outerHTML = createSidebar(currentPath);
            }
            if (bottomNav) {
                bottomNav.outerHTML = createBottomNav(currentPath);
            }
        }
    }
}

// Import page rendering functions
// These are defined in separate files in the pages/ directory

