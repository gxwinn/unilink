// Messages Pages

function renderMessages() {
    if (!isUserAuthenticated()) {
        router.navigate('/login');
        return;
    }
    const conversationsHTML = conversations.map(conv => createMessageItem(conv)).join('');
    
    const content = `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-title">Messages</h1>
            </div>
            <div id="conversations-list">
                ${conversationsHTML || '<div class="empty-state"><p>No messages yet</p></div>'}
            </div>
        </div>
    `;
    
    renderPage(content);
}

function renderChat(conversationId) {
    if (!isUserAuthenticated()) {
        router.navigate('/login');
        return;
    }
    const conversation = getConversationById(conversationId);
    
    if (!conversation) {
        renderPage('<div class="page-container"><div class="empty-state"><p>Conversation not found</p></div></div>');
        return;
    }
    
    const messages = chatMessages[conversationId] || [];
    const messagesHTML = messages.map(msg => createChatMessage(msg)).join('');
    
    const content = `
        <div class="page-container">
            <div style="margin-bottom: 20px;">
                <a href="/messages" class="btn-secondary" data-link style="text-decoration: none; display: inline-block;">
                    ← Back to Messages
                </a>
            </div>
            <div style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${conversation.avatar}" alt="${conversation.userName}" style="width: 48px; height: 48px; border-radius: 50%;" onerror="this.src='https://via.placeholder.com/48'">
                    <div>
                        <div style="font-weight: 600; font-size: 18px;">${escapeHtml(conversation.userName)}</div>
                        <div style="color: var(--text-secondary); font-size: 14px;">Active now</div>
                    </div>
                </div>
            </div>
            <div class="chat-container">
                <div class="chat-messages" id="chat-messages">
                    ${messagesHTML || '<div class="empty-state"><p>No messages yet. Start the conversation!</p></div>'}
                </div>
                <div class="chat-input-container">
                    <input type="text" class="chat-input" id="chat-input" placeholder="Type a message...">
                    <button class="btn-primary" id="send-message-btn">Send</button>
                </div>
            </div>
        </div>
    `;
    
    renderPage(content);
    
    // Initialize chat
    initializeChat(conversationId);
}

function initializeChat(conversationId) {
    const sendBtn = document.getElementById('send-message-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessagesContainer = document.getElementById('chat-messages');
    
    if (sendBtn && chatInput) {
        const sendMessage = () => {
            const content = chatInput.value.trim();
            if (!content) return;
            
            const newMessage = {
                id: 'msg' + Date.now(),
                userId: currentUser.id,
                userName: currentUser.name,
                avatar: currentUser.avatar,
                content: content,
                time: 'now',
                sent: true
            };
            
            addChatMessage(conversationId, newMessage);
            
            // Add to DOM
            if (chatMessagesContainer) {
                if (chatMessagesContainer.querySelector('.empty-state')) {
                    chatMessagesContainer.innerHTML = '';
                }
                chatMessagesContainer.insertAdjacentHTML('beforeend', createChatMessage(newMessage));
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            }
            
            // Update conversation last message
            const conversation = getConversationById(conversationId);
            if (conversation) {
                conversation.lastMessage = content;
                conversation.time = 'now';
            }
            
            // Reset input
            chatInput.value = '';
        };
        
        sendBtn.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Auto-scroll to bottom
        if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    }
}


