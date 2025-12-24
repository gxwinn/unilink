// Post Details Page

function renderPostDetails(postId) {
    if (!isUserAuthenticated()) {
        router.navigate('/login');
        return;
    }
    const post = getPostById(postId);
    
    if (!post) {
        renderPage('<div class="page-container"><div class="empty-state"><p>Post not found</p></div></div>');
        return;
    }
    
    const postComments = getCommentsByPostId(postId);
    const commentsHTML = postComments.map(comment => createComment(comment)).join('');
    
    const content = `
        <div class="page-container">
            <div style="margin-bottom: 20px;">
                <a href="/" class="btn-secondary" data-link style="text-decoration: none; display: inline-block;">
                    ← Back to Home
                </a>
            </div>
            ${createPostCard(post, true)}
            <div style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; margin-top: 20px;">
                <div style="padding: 20px; border-bottom: 1px solid var(--border-color);">
                    <h2 style="font-size: 20px; margin-bottom: 16px;">Comments (${postComments.length})</h2>
                    <div id="comments-list">
                        ${commentsHTML || '<div class="empty-state"><p>No comments yet</p></div>'}
                    </div>
                </div>
                <div class="comment-form">
                    <textarea id="new-comment-input" class="comment-input" placeholder="Add a comment..."></textarea>
                    <button class="btn-primary" id="submit-comment-btn">Post Comment</button>
                </div>
            </div>
        </div>
    `;
    
    renderPage(content);
    
    // Initialize comment functionality
    initializeComments(postId);
}

function initializeComments(postId) {
    const submitCommentBtn = document.getElementById('submit-comment-btn');
    const commentInput = document.getElementById('new-comment-input');
    
    if (submitCommentBtn && commentInput) {
        submitCommentBtn.addEventListener('click', () => {
            const content = commentInput.value.trim();
            if (!content) {
                alert('Please enter a comment');
                return;
            }
            
            const newComment = {
                id: 'comment' + Date.now(),
                userId: currentUser.id,
                userName: currentUser.name,
                avatar: currentUser.avatar,
                time: 'now',
                content: content
            };
            
            addComment(postId, newComment);
            
            // Update post comment count
            const post = getPostById(postId);
            if (post) {
                post.comments += 1;
            }
            
            // Add to DOM
            const commentsList = document.getElementById('comments-list');
            if (commentsList) {
                if (commentsList.querySelector('.empty-state')) {
                    commentsList.innerHTML = '';
                }
                commentsList.insertAdjacentHTML('beforeend', createComment(newComment));
            }
            
            // Reset input
            commentInput.value = '';
            
            showNotification('Comment added!');
        });
        
        // Allow Enter to submit (Shift+Enter for new line)
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitCommentBtn.click();
            }
        });
    }
}


