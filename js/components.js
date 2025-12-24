// Reusable Components

function createHeader() {
    return `
        <header class="header">
            <div class="header-left">
                <a href="/" class="logo" data-link>UniLink</a>
                <div class="search-bar">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input type="text" placeholder="Search UniLink" id="search-input">
                </div>
            </div>
            <div class="header-right">
                <div class="notification" id="notification">
                    <svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    <span id="notification-text"></span>
                </div>
                ${typeof isUserAuthenticated === 'function' && isUserAuthenticated() ? `
                <div class="header-user">
                    <button class="btn-ghost" id="logout-btn" data-action="logout">Logout</button>
                </div>
                ` : ''}
            </div>
        </header>
    `;
}

function createSidebar(activeRoute = '') {
    const routes = [
        { path: '/', name: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/explore', name: 'Explore', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { path: '/communities', name: 'Communities', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { path: '/events', name: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
    ];
    
    const messagesRoute = { path: '/messages', name: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' };
    const profileRoute = { path: '/profile', name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' };
    
    let sidebarHTML = '<nav class="sidebar">';
    
    routes.forEach(route => {
        const isActive = activeRoute === route.path || (route.path === '/' && activeRoute === '/home');
        sidebarHTML += `
            <a href="${route.path}" class="sidebar-item ${isActive ? 'active' : ''}" data-link>
                <svg class="sidebar-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${route.icon}"></path>
                </svg>
                ${route.name}
            </a>
        `;
    });
    
    sidebarHTML += '<div class="sidebar-divider"></div>';
    sidebarHTML += `
        <a href="${messagesRoute.path}" class="sidebar-item ${activeRoute === messagesRoute.path ? 'active' : ''}" data-link>
            <svg class="sidebar-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${messagesRoute.icon}"></path>
            </svg>
            ${messagesRoute.name}
        </a>
        <a href="${profileRoute.path}" class="sidebar-item ${activeRoute === profileRoute.path ? 'active' : ''}" data-link>
            <svg class="sidebar-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${profileRoute.icon}"></path>
            </svg>
            ${profileRoute.name}
        </a>
    `;
    
    sidebarHTML += '</nav>';
    return sidebarHTML;
}

function createBottomNav(activeRoute = '') {
    const routes = [
        { path: '/', name: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/explore', name: 'Explore', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { path: '/communities', name: 'Communities', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { path: '/events', name: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { path: '/profile', name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
    ];
    
    let bottomNavHTML = '<nav class="bottom-nav">';
    
    routes.forEach(route => {
        const isActive = activeRoute === route.path || (route.path === '/' && activeRoute === '/home');
        bottomNavHTML += `
            <a href="${route.path}" class="bottom-nav-item ${isActive ? 'active' : ''}" data-link>
                <svg class="bottom-nav-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${route.icon}"></path>
                </svg>
                <span>${route.name}</span>
            </a>
        `;
    });
    
    bottomNavHTML += '</nav>';
    return bottomNavHTML;
}

function createPostCard(post, showFullContent = false) {
    const content = showFullContent ? post.content : (post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content);
    const statusClass = post.status.toLowerCase();
    
    return `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <img src="${post.avatar}" alt="${post.userName}" class="post-avatar" onerror="this.src='https://via.placeholder.com/48'">
                <div class="post-user-info">
                    <div>
                        <span class="post-user-name">${post.userName}</span>
                        <span class="post-status ${statusClass}">${post.status}</span>
                    </div>
                    <div class="post-username">${post.username}</div>
                    <div class="post-time">${post.time}</div>
                </div>
            </div>
            <div class="post-content">${escapeHtml(content)}</div>
            ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image" onerror="this.style.display='none'">` : ''}
            <div class="post-actions">
                <button class="post-action ${post.liked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
                    <svg class="post-action-icon" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span class="like-count">${post.likes}</span>
                </button>
                <button class="post-action" data-action="comment" data-post-id="${post.id}">
                    <svg class="post-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span>${post.comments}</span>
                </button>
                <button class="post-action" data-action="share" data-post-id="${post.id}">
                    <svg class="post-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    <span>${post.shares || 0}</span>
                </button>
            </div>
        </div>
    `;
}

function createCommunityCard(community) {
    return `
        <div class="community-card" data-community-id="${community.id}">
            <div class="community-header">
                <img src="${community.avatar}" alt="${community.name}" class="community-avatar" onerror="this.src='https://via.placeholder.com/64'">
                <div class="community-info">
                    <div class="community-name">${escapeHtml(community.name)}</div>
                    <div class="community-members">${community.members.toLocaleString()} members</div>
                </div>
            </div>
            <div class="community-description">${escapeHtml(community.description)}</div>
            <button class="btn-${community.joined ? 'secondary' : 'primary'}" data-action="join-community" data-community-id="${community.id}">
                ${community.joined ? 'Leave' : 'Join'}
            </button>
        </div>
    `;
}

function createEventCard(event) {
    const formatClass = event.format === 'online' ? 'online' : '';
    return `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-header">
                <div>
                    <div class="event-title">${escapeHtml(event.title)}</div>
                    <div class="event-date">${formatDate(event.date)}</div>
                    <div class="event-time">${event.time}</div>
                </div>
                <span class="event-format ${formatClass}">${event.format}</span>
            </div>
            <div class="event-description">${escapeHtml(event.description)}</div>
            ${event.location ? `<div class="event-description" style="margin-top: 8px;"><strong>Location:</strong> ${escapeHtml(event.location)}</div>` : ''}
            <button class="btn-${event.registered ? 'secondary' : 'primary'}" data-action="register-event" data-event-id="${event.id}">
                ${event.registered ? 'Registered' : 'Register'}
            </button>
        </div>
    `;
}

function createComment(comment) {
    return `
        <div class="comment">
            <div class="comment-header">
                <img src="${comment.avatar}" alt="${comment.userName}" class="comment-avatar" onerror="this.src='https://via.placeholder.com/32'">
                <span class="comment-user-name">${escapeHtml(comment.userName)}</span>
                <span class="comment-time">${comment.time}</span>
            </div>
            <div class="comment-content">${escapeHtml(comment.content)}</div>
        </div>
    `;
}

function createMessageItem(conversation) {
    return `
        <div class="message-item" data-conversation-id="${conversation.id}">
            <img src="${conversation.avatar}" alt="${conversation.userName}" class="message-avatar" onerror="this.src='https://via.placeholder.com/48'">
            <div class="message-content">
                <div class="message-name">${escapeHtml(conversation.userName)}</div>
                <div class="message-preview">${escapeHtml(conversation.lastMessage)}</div>
            </div>
            <div class="message-meta">
                <div class="message-time">${conversation.time}</div>
                ${conversation.unread > 0 ? `<div class="message-unread">${conversation.unread}</div>` : ''}
            </div>
        </div>
    `;
}

function createChatMessage(message) {
    const sentClass = message.sent ? 'sent' : '';
    return `
        <div class="chat-message ${sentClass}">
            <img src="${message.avatar}" alt="${message.userName}" class="chat-message-avatar" onerror="this.src='https://via.placeholder.com/36'">
            <div class="chat-message-content">
                <div class="chat-message-text">${escapeHtml(message.content)}</div>
                <div class="chat-message-time">${message.time}</div>
            </div>
        </div>
    `;
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}


