// Home Page

function renderHome() {
    if (!isUserAuthenticated()) {
        router.navigate('/login');
        return;
    }
    const createPostForm = `
        <div class="create-post-form">
            <textarea id="new-post-content" placeholder="What's on your mind?"></textarea>
            <div id="image-preview-container"></div>
            <div class="create-post-actions">
                <label for="post-image-input" class="file-input-label">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Add Image
                </label>
                <input type="file" id="post-image-input" class="file-input" accept="image/*">
                <button class="btn-primary" id="submit-post-btn">Post</button>
            </div>
        </div>
    `;
    
    const postsHTML = posts.map(post => createPostCard(post)).join('');
    
    const content = `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-title">Home</h1>
                <button class="btn-primary" id="create-post-btn" style="display: none;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create Post
                </button>
            </div>
            <div id="create-post-container" style="display: none;">
                ${createPostForm}
            </div>
            <div id="posts-container">
                ${postsHTML}
            </div>
        </div>
    `;
    
    renderPage(content);
    
    // Initialize create post functionality
    initializeCreatePost();
}

function initializeCreatePost() {
    if (!currentUser) return;
    const createPostBtn = document.getElementById('create-post-btn');
    const createPostContainer = document.getElementById('create-post-container');
    const submitPostBtn = document.getElementById('submit-post-btn');
    const postContentInput = document.getElementById('new-post-content');
    const imageInput = document.getElementById('post-image-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    
    let selectedImage = null;
    
    if (createPostBtn && createPostContainer) {
        createPostBtn.addEventListener('click', () => {
            createPostContainer.style.display = createPostContainer.style.display === 'none' ? 'block' : 'none';
        });
    }
    
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
                            <button class="image-preview-remove" id="remove-image-btn">×</button>
                        </div>
                    `;
                    
                    const removeBtn = document.getElementById('remove-image-btn');
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
            
            // Add to DOM
            const postsContainer = document.getElementById('posts-container');
            if (postsContainer) {
                postsContainer.insertAdjacentHTML('afterbegin', createPostCard(addedPost));
            }
            
            // Reset form
            if (postContentInput) postContentInput.value = '';
            if (imagePreviewContainer) imagePreviewContainer.innerHTML = '';
            if (imageInput) imageInput.value = '';
            selectedImage = null;
            if (createPostContainer) createPostContainer.style.display = 'none';
            
            showNotification('Post created!');
        });
    }
}


