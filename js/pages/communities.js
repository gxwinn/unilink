// Communities Pages

function renderCommunities() {
    if (!isUserAuthenticated()) {
        router.navigate('/login');
        return;
    }
    const communitiesHTML = communities.map(community => createCommunityCard(community)).join('');
    
    const content = `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-title">Communities</h1>
            </div>
            <div id="communities-container">
                ${communitiesHTML}
            </div>
        </div>
    `;
    
    renderPage(content);
}

function renderCommunityDetails(communityId) {
    if (!isUserAuthenticated()) {
        router.navigate('/login');
        return;
    }
    const community = getCommunityById(communityId);
    
    if (!community) {
        renderPage('<div class="page-container"><div class="empty-state"><p>Community not found</p></div></div>');
        return;
    }
    
    const communityPostsList = communityPosts[communityId] || [];
    const postsHTML = communityPostsList.length > 0 
        ? communityPostsList.map(post => createPostCard(post)).join('')
        : '<div class="empty-state"><p>No posts in this community yet</p></div>';
    
    const createPostForm = `
        <div class="create-post-form">
            <textarea id="new-community-post-content" placeholder="Share something with ${escapeHtml(community.name)}..."></textarea>
            <div id="community-image-preview-container"></div>
            <div class="create-post-actions">
                <label for="community-post-image-input" class="file-input-label">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Add Image
                </label>
                <input type="file" id="community-post-image-input" class="file-input" accept="image/*">
                <button class="btn-primary" id="submit-community-post-btn">Post</button>
            </div>
        </div>
    `;
    
    const content = `
        <div class="page-container">
            <div style="margin-bottom: 20px;">
                <a href="/communities" class="btn-secondary" data-link style="text-decoration: none; display: inline-block;">
                    ← Back to Communities
                </a>
            </div>
            <div class="community-card" style="margin-bottom: 20px;">
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
            ${createPostForm}
            <div id="community-posts-container">
                ${postsHTML}
            </div>
        </div>
    `;
    
    renderPage(content);
    
    // Initialize community post creation
    initializeCommunityPost(communityId);
}

function initializeCommunityPost(communityId) {
    const submitPostBtn = document.getElementById('submit-community-post-btn');
    const postContentInput = document.getElementById('new-community-post-content');
    const imageInput = document.getElementById('community-post-image-input');
    const imagePreviewContainer = document.getElementById('community-image-preview-container');
    
    let selectedImage = null;
    
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    selectedImage = event.target.result;
                    imagePreviewContainer.innerHTML = `
                        <div class="image-preview">
                            <img src="${selectedImage}" alt="Preview">
                            <button class="image-preview-remove" id="remove-community-image-btn">×</button>
                        </div>
                    `;
                    
                    const removeBtn = document.getElementById('remove-community-image-btn');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', () => {
                            selectedImage = null;
                            imagePreviewContainer.innerHTML = '';
                            imageInput.value = '';
                        });
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (submitPostBtn) {
        submitPostBtn.addEventListener('click', () => {
            const content = postContentInput ? postContentInput.value.trim() : '';
            if (!content) {
                alert('Please enter post content');
                return;
            }
            
            const newPost = {
                userId: currentUser.id,
                userName: currentUser.name,
                username: currentUser.username,
                avatar: currentUser.avatar,
                status: currentUser.status,
                content: content,
                image: selectedImage
            };
            
            const addedPost = addPost(newPost);
            addedPost.id = 'comm_post' + Date.now();
            
            // Add to community posts
            if (!communityPosts[communityId]) {
                communityPosts[communityId] = [];
            }
            communityPosts[communityId].unshift(addedPost);
            
            // Add to DOM
            const postsContainer = document.getElementById('community-posts-container');
            if (postsContainer) {
                if (postsContainer.querySelector('.empty-state')) {
                    postsContainer.innerHTML = '';
                }
                postsContainer.insertAdjacentHTML('afterbegin', createPostCard(addedPost));
            }
            
            // Reset form
            if (postContentInput) postContentInput.value = '';
            if (imagePreviewContainer) imagePreviewContainer.innerHTML = '';
            if (imageInput) imageInput.value = '';
            selectedImage = null;
            
            showNotification('Post created!');
        });
    }
}


