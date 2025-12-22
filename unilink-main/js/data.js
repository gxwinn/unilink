// Storage Helpers -----------------------------------------------------------
const STORAGE_KEYS = {
    CURRENT_USER: 'unilink_current_user',
    REGISTERED_USERS: 'unilink_registered_users',
    PENDING_VERIFICATIONS: 'unilink_pending_verifications',
    CUSTOM_UNIVERSITIES: 'unilink_custom_universities'
};

const STORAGE_SUPPORTED = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function loadFromStorage(key, fallback) {
    if (!STORAGE_SUPPORTED) return fallback;
    try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.warn('Storage read error', error);
        return fallback;
    }
}

function saveToStorage(key, value) {
    if (!STORAGE_SUPPORTED) return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('Storage write error', error);
    }
}

function removeFromStorage(key) {
    if (!STORAGE_SUPPORTED) return;
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.warn('Storage remove error', error);
    }
}

// Avatar Catalog ------------------------------------------------------------
const AVATARS = {
    john: 'assets/avatars/avatar-john.svg',
    alex: 'assets/avatars/avatar-alex.svg',
    maria: 'assets/avatars/avatar-maria.svg',
    james: 'assets/avatars/avatar-james.svg',
    sarah: 'assets/avatars/avatar-sarah.svg',
    david: 'assets/avatars/avatar-david.svg',
    default: 'assets/avatars/avatar-default.svg'
};

// Universities --------------------------------------------------------------
const baseUniversities = [
    { id: 'uni1', name: 'MIT', country: 'USA', students: 12500 },
    { id: 'uni2', name: 'Harvard University', country: 'USA', students: 23000 },
    { id: 'uni3', name: 'Stanford University', country: 'USA', students: 17000 },
    { id: 'uni4', name: 'Oxford University', country: 'UK', students: 24000 },
    { id: 'uni5', name: 'Cambridge University', country: 'UK', students: 23000 },
    { id: 'uni6', name: 'University of Toronto', country: 'Canada', students: 90000 },
    { id: 'uni7', name: 'ETH Zurich', country: 'Switzerland', students: 21000 },
    { id: 'uni8', name: 'University of Sydney', country: 'Australia', students: 60000 }
];

let customUniversities = loadFromStorage(STORAGE_KEYS.CUSTOM_UNIVERSITIES, []);
let universities = [...baseUniversities, ...customUniversities];

function refreshUniversities() {
    universities = [...baseUniversities, ...customUniversities];
}

function addUniversityOption(name, country = 'Global') {
    if (!name) return null;
    const trimmed = name.trim();
    if (!trimmed) return null;
    const exists = universities.find(u => u.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return exists;
    const newUni = {
        id: 'uni' + Date.now(),
        name: trimmed,
        country,
        students: 0
    };
    customUniversities.push(newUni);
    saveToStorage(STORAGE_KEYS.CUSTOM_UNIVERSITIES, customUniversities);
    refreshUniversities();
    return newUni;
}

function getUniversityOptions() {
    return universities;
}

// Users ---------------------------------------------------------------------
const defaultUserProfile = {
    id: 'user1',
    name: 'TSI Student',
    username: '@tsi',
    email: 'tsi@auca.kg',
    password: '123',
    status: 'Student',
    accountType: 'Student',
    university: 'AUCA',
    verified: true,
    emailVerified: true,
    avatar: AVATARS.john,
    bio: 'Welcome to UniLink demo account.',
    savedPosts: []
};

function normalizeUser(user) {
    return {
        verified: false,
        emailVerified: false,
        savedPosts: [],
        avatar: AVATARS.default,
        bio: '',
        accountType: user.status || 'Applicant',
        username: user.username?.startsWith('@') ? user.username : `@${(user.username || 'user').replace('@', '')}`,
        ...user
    };
}

let registeredUsers = loadFromStorage(STORAGE_KEYS.REGISTERED_USERS, [defaultUserProfile]).map(normalizeUser);

let pendingVerifications = loadFromStorage(STORAGE_KEYS.PENDING_VERIFICATIONS, {});

function saveRegisteredUsers() {
    saveToStorage(STORAGE_KEYS.REGISTERED_USERS, registeredUsers);
}

function savePendingVerifications() {
    saveToStorage(STORAGE_KEYS.PENDING_VERIFICATIONS, pendingVerifications);
}

function loadCurrentUser() {
    const stored = loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    return stored ? normalizeUser(stored) : null;
}

let currentUser = loadCurrentUser();

function persistCurrentUser() {
    if (!currentUser) {
        removeFromStorage(STORAGE_KEYS.CURRENT_USER);
        return;
    }
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
}

function setCurrentUser(user) {
    currentUser = user ? normalizeUser(user) : null;
    persistCurrentUser();
}

function logoutCurrentUser() {
    setCurrentUser(null);
}

function isEmailTaken(email) {
    return registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function registerUser(data) {
    if (isEmailTaken(data.email)) {
        return { success: false, message: 'Email already registered' };
    }

    const newUser = normalizeUser({
        id: 'user' + Date.now(),
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        status: data.accountType,
        accountType: data.accountType,
        university: data.university,
        bio: data.bio,
        avatar: data.avatar || AVATARS.default,
        emailVerified: false,
        verified: data.accountType === 'Student'
    });

    registeredUsers.push(newUser);
    saveRegisteredUsers();

    const verificationCode = generateVerificationCode();
    pendingVerifications[newUser.email.toLowerCase()] = verificationCode;
    savePendingVerifications();

    return { success: true, user: newUser, verificationCode };
}

function confirmEmail(email, code) {
    const normalizedEmail = email.toLowerCase();
    if (!pendingVerifications[normalizedEmail]) {
        return { success: false, message: 'Verification not found' };
    }
    if (pendingVerifications[normalizedEmail] !== code) {
        return { success: false, message: 'Incorrect code' };
    }

    delete pendingVerifications[normalizedEmail];
    savePendingVerifications();

    const user = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (user) {
        user.emailVerified = true;
        saveRegisteredUsers();
        setCurrentUser(user);
        return { success: true, user };
    }
    return { success: false, message: 'User not found' };
}

function authenticateUser(email, password) {
    const normalizedEmail = email.toLowerCase();
    const user = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
        return { success: false, message: 'Account not found' };
    }
    if (!user.emailVerified) {
        return { success: false, message: 'Please verify your email' };
    }
    if (user.password !== password) {
        return { success: false, message: 'Incorrect password' };
    }
    setCurrentUser(user);
    return { success: true, user };
}

function updateCurrentUserProfile(updates) {
    currentUser = normalizeUser({ ...currentUser, ...updates });
    persistCurrentUser();
    const index = registeredUsers.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        registeredUsers[index] = currentUser;
        saveRegisteredUsers();
    }
    return currentUser;
}

function isUserAuthenticated() {
    return !!(currentUser && currentUser.emailVerified);
}

// Mock Content --------------------------------------------------------------
const posts = [
    {
        id: 'post1',
        userId: 'user2',
        userName: 'Alex Johnson',
        username: '@alexj_abroad',
        avatar: AVATARS.alex,
        status: 'Student',
        time: '2h',
        content: 'Just finished my first week at MIT! The campus is incredible and everyone is so welcoming. Can\'t wait to share more about my journey 🎓',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
        likes: 125,
        comments: 18,
        shares: 5,
        liked: false,
        hashtags: ['#MIT', '#StudentLife']
    },
    {
        id: 'post2',
        userId: 'user3',
        userName: 'Maria Garcia',
        username: '@maria_studies',
        avatar: AVATARS.maria,
        status: 'Applicant',
        time: '5h',
        content: 'Tips for international students applying to US universities:\n1. Start your application early\n2. Get your documents translated and verified\n3. Practice for TOEFL/IELTS\n4. Research scholarship opportunities\n5. Connect with current students\n\nWhat would you add to this list?',
        image: null,
        likes: 342,
        comments: 56,
        shares: 89,
        liked: false,
        hashtags: ['#Applications', '#Scholarships']
    },
    {
        id: 'post3',
        userId: 'user4',
        userName: 'James Kim',
        username: '@jkim_uk',
        avatar: AVATARS.james,
        status: 'Student',
        time: '8h',
        content: 'Life in London as an international student has been amazing! Here\'s a glimpse of my campus life',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
        likes: 89,
        comments: 12,
        shares: 23,
        liked: true,
        hashtags: ['#London', '#CampusLife']
    },
    {
        id: 'post4',
        userId: 'user5',
        userName: 'Sarah Chen',
        username: '@sarah_chen',
        avatar: AVATARS.sarah,
        status: 'Student',
        time: '12h',
        content: 'Just got my visa approved! 🎉 The process was smoother than expected. Happy to answer any questions about the visa application process.',
        image: null,
        likes: 256,
        comments: 45,
        shares: 67,
        liked: false,
        hashtags: ['#Visa', '#Approved']
    },
    {
        id: 'post5',
        userId: 'user6',
        userName: 'David Lee',
        username: '@david_lee',
        avatar: AVATARS.david,
        status: 'Applicant',
        time: '1d',
        content: 'Looking for housing near Stanford. Any recommendations? Budget is around $1500/month.',
        image: null,
        likes: 78,
        comments: 34,
        shares: 12,
        liked: false,
        hashtags: ['#Housing', '#Stanford']
    }
];

const comments = {
    post1: [
        {
            id: 'comment1',
            userId: 'user3',
            userName: 'Maria Garcia',
            avatar: AVATARS.maria,
            time: '1h',
            content: 'Congratulations! MIT is amazing!'
        },
        {
            id: 'comment2',
            userId: 'user4',
            userName: 'James Kim',
            avatar: AVATARS.james,
            time: '30m',
            content: 'Welcome to the community! 🎓'
        }
    ],
    post2: [
        {
            id: 'comment3',
            userId: 'user2',
            userName: 'Alex Johnson',
            avatar: AVATARS.alex,
            time: '3h',
            content: 'Great tips! I would also add: network with alumni from your country.'
        }
    ],
    post3: [],
    post4: [],
    post5: []
};

const communities = [
    {
        id: 'comm1',
        name: 'MIT Students',
        description: 'Connect with fellow MIT students, share experiences, and get support.',
        avatar: AVATARS.john,
        members: 1250,
        joined: true
    },
    {
        id: 'comm2',
        name: 'International Students USA',
        description: 'A community for all international students studying in the United States.',
        avatar: AVATARS.alex,
        members: 5600,
        joined: false
    },
    {
        id: 'comm3',
        name: 'UK Study Abroad',
        description: 'Share your UK study experience and connect with students across the UK.',
        avatar: AVATARS.james,
        members: 3200,
        joined: true
    },
    {
        id: 'comm4',
        name: 'Scholarship Seekers',
        description: 'Find and share scholarship opportunities for international students.',
        avatar: AVATARS.maria,
        members: 8900,
        joined: false
    },
    {
        id: 'comm5',
        name: 'Visa Help',
        description: 'Get help with visa applications and share your visa journey.',
        avatar: AVATARS.sarah,
        members: 4500,
        joined: true
    }
];

const communityPosts = {
    comm1: [
        { ...posts[0], id: 'comm_post1' },
        { ...posts[3], id: 'comm_post2' }
    ],
    comm2: [
        { ...posts[1], id: 'comm_post3' },
        { ...posts[4], id: 'comm_post4' }
    ],
    comm3: [
        { ...posts[2], id: 'comm_post5' }
    ],
    comm4: [],
    comm5: []
};

const events = [
    {
        id: 'event1',
        title: 'International Student Orientation',
        date: '2024-02-15',
        time: '10:00 AM',
        format: 'online',
        description: 'Join us for a comprehensive orientation session for new international students. Learn about campus resources, visa requirements, and meet other students.',
        registered: false,
        link: 'https://zoom.us/meeting/123'
    },
    {
        id: 'event2',
        title: 'Scholarship Workshop',
        date: '2024-02-20',
        time: '2:00 PM',
        format: 'online',
        description: 'Learn how to find and apply for scholarships as an international student. Expert panel with successful scholarship recipients.',
        registered: true,
        link: 'https://zoom.us/meeting/456'
    },
    {
        id: 'event3',
        title: 'Campus Tour - Harvard',
        date: '2024-02-25',
        time: '11:00 AM',
        format: 'offline',
        description: 'Join us for a guided tour of Harvard campus. Meet current students and learn about student life.',
        registered: false,
        location: 'Harvard University, Cambridge, MA'
    },
    {
        id: 'event4',
        title: 'Visa Application Q&A',
        date: '2024-03-01',
        time: '3:00 PM',
        format: 'online',
        description: 'Get your visa questions answered by immigration experts and students who have gone through the process.',
        registered: false,
        link: 'https://zoom.us/meeting/789'
    },
    {
        id: 'event5',
        title: 'Networking Mixer',
        date: '2024-03-05',
        time: '6:00 PM',
        format: 'offline',
        description: 'Connect with fellow international students and alumni. Food and drinks provided.',
        registered: true,
        location: 'Student Center, Room 201'
    }
];

const countries = [
    { id: 'country1', name: 'United States', students: 125000, universities: 150 },
    { id: 'country2', name: 'United Kingdom', students: 45000, universities: 80 },
    { id: 'country3', name: 'Canada', students: 35000, universities: 60 },
    { id: 'country4', name: 'Australia', students: 28000, universities: 45 },
    { id: 'country5', name: 'Germany', students: 22000, universities: 55 },
    { id: 'country6', name: 'France', students: 18000, universities: 40 },
    { id: 'country7', name: 'Switzerland', students: 12000, universities: 25 },
    { id: 'country8', name: 'Netherlands', students: 15000, universities: 30 }
];

const tags = [
    { id: 'tag1', name: 'visa', posts: 1250 },
    { id: 'tag2', name: 'scholarship', posts: 890 },
    { id: 'tag3', name: 'housing', posts: 650 },
    { id: 'tag4', name: 'application', posts: 1200 },
    { id: 'tag5', name: 'campus-life', posts: 450 },
    { id: 'tag6', name: 'TOEFL', posts: 320 },
    { id: 'tag7', name: 'IELTS', posts: 280 },
    { id: 'tag8', name: 'work-permit', posts: 560 }
];

const conversations = [
    {
        id: 'conv1',
        userId: 'user2',
        userName: 'Alex Johnson',
        avatar: AVATARS.alex,
        lastMessage: 'Hey! Welcome to MIT!',
        time: '2h',
        unread: 2
    },
    {
        id: 'conv2',
        userId: 'user3',
        userName: 'Maria Garcia',
        avatar: AVATARS.maria,
        lastMessage: 'Thanks for the tips!',
        time: '5h',
        unread: 0
    },
    {
        id: 'conv3',
        userId: 'user4',
        userName: 'James Kim',
        avatar: AVATARS.james,
        lastMessage: 'See you at the event!',
        time: '1d',
        unread: 1
    }
];

const chatMessages = {
    conv1: [
        {
            id: 'msg1',
            userId: 'user2',
            userName: 'Alex Johnson',
            avatar: AVATARS.alex,
            content: 'Hey! Welcome to MIT!',
            time: '2h',
            sent: false
        },
        {
            id: 'msg2',
            userId: 'user1',
            userName: 'John Doe',
            avatar: AVATARS.john,
            content: 'Thank you! Excited to be here!',
            time: '2h',
            sent: true
        },
        {
            id: 'msg3',
            userId: 'user2',
            userName: 'Alex Johnson',
            avatar: AVATARS.alex,
            content: 'If you need any help, just let me know!',
            time: '1h',
            sent: false
        }
    ],
    conv2: [
        {
            id: 'msg4',
            userId: 'user3',
            userName: 'Maria Garcia',
            avatar: AVATARS.maria,
            content: 'Thanks for the tips!',
            time: '5h',
            sent: false
        },
        {
            id: 'msg5',
            userId: 'user1',
            userName: 'John Doe',
            avatar: AVATARS.john,
            content: 'You\'re welcome! Good luck with your applications!',
            time: '5h',
            sent: true
        }
    ],
    conv3: [
        {
            id: 'msg6',
            userId: 'user4',
            userName: 'James Kim',
            avatar: AVATARS.james,
            content: 'See you at the event!',
            time: '1d',
            sent: false
        }
    ]
};

// Helper utilities ----------------------------------------------------------
function parseHashtags(text = '') {
    return (text.match(/#[\p{L}0-9_-]+/giu) || []).map(tag => tag.toLowerCase());
}

function getPostById(id) {
    return posts.find(p => p.id === id);
}

function getCommunityById(id) {
    return communities.find(c => c.id === id);
}

function getEventById(id) {
    return events.find(e => e.id === id);
}

function getConversationById(id) {
    return conversations.find(c => c.id === id);
}

function getCommentsByPostId(postId) {
    return comments[postId] || [];
}

function addComment(postId, comment) {
    if (!comments[postId]) {
        comments[postId] = [];
    }
    comments[postId].push(comment);
}

function togglePostLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return null;
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    return post;
}

function toggleCommunityJoin(communityId) {
    const community = communities.find(c => c.id === communityId);
    if (!community) return null;
    community.joined = !community.joined;
    community.members += community.joined ? 1 : -1;
    return community;
}

function toggleEventRegistration(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return null;
    event.registered = !event.registered;
    return event;
}

function addPost(post) {
    const hashtags = parseHashtags(`${post.content || ''} ${post.hashtags || ''}`);
    const newPost = {
        ...post,
        id: 'post' + Date.now(),
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        time: 'now',
        hashtags
    };
    posts.unshift(newPost);
    return newPost;
}

function addChatMessage(conversationId, message) {
    if (!chatMessages[conversationId]) {
        chatMessages[conversationId] = [];
    }
    chatMessages[conversationId].push(message);
    return message;
}

