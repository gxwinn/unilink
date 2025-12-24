# UniLink - Social Platform for International Students

UniLink is a multi-page MVP social platform designed for international students and applicants. Built with pure HTML, CSS, and vanilla JavaScript (no frameworks or libraries).

## Features

- **Home Feed**: View and create posts, like posts, view comments
- **Post Details**: Full post view with comments and ability to add new comments
- **Explore**: Browse universities, countries, and topics
- **Communities**: Join communities and create posts within them
- **Events**: View and register for online/offline events
- **Profile**: View and edit your profile, switch between Student/Applicant status
- **Messages**: Chat with other users
- **Authentication**: Login and registration with form validation

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom styling with CSS variables, flexbox, and grid
- **Vanilla JavaScript**: No frameworks or libraries
- **LocalStorage**: For saving user preferences

## File Structure

```
unilink-connection-mvp/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Main styles and layout
│   └── components.css     # Component styles
├── js/
│   ├── app.js             # Main application logic
│   ├── router.js          # SPA routing
│   ├── data.js            # Mock data and data management
│   ├── components.js      # Reusable UI components
│   └── pages/
│       ├── home.js        # Home page
│       ├── post.js        # Post details page
│       ├── explore.js     # Explore pages
│       ├── communities.js # Communities pages
│       ├── events.js      # Events pages
│       ├── profile.js     # Profile pages
│       ├── auth.js        # Login/Register pages
│       └── messages.js    # Messages pages
└── README.md
```

## Design

- **Theme**: Dark theme with background `#0D0D0D`
- **Accent Color**: Red `#E00030`
- **Typography**: System fonts for optimal performance
- **Responsive**: Mobile-first design with breakpoints for tablet and desktop

## Responsive Breakpoints

- **Mobile**: < 768px - Bottom navigation, single column layout
- **Tablet**: 768px - 1023px - Two column layout in Explore
- **Desktop**: ≥ 1024px - Sidebar navigation, three column layout

## Getting Started

1. Extract all files to a directory
2. Open `index.html` in a modern web browser
3. No build process or server required - works directly in the browser

## Pages and Routes

- `/` or `/home` - Home feed
- `/post/:id` - Post details
- `/explore` - Explore main page
- `/explore/universities` - Browse universities
- `/explore/countries` - Browse countries
- `/explore/tags` - Browse topics/tags
- `/communities` - Communities list
- `/communities/:id` - Community details
- `/events` - Events list
- `/events/:id` - Event details
- `/profile` - User profile
- `/profile/edit` - Edit profile
- `/login` - Login page
- `/register` - Registration page
- `/messages` - Messages list
- `/messages/:id` - Chat conversation

## Features Implementation

### Posts
- Create new posts with text and images
- Like/unlike posts
- View post details
- Add comments to posts

### Communities
- Browse communities
- Join/leave communities
- Create posts within communities

### Events
- View all events
- Filter by registered events
- Register/unregister for events
- View event details

### Profile
- View profile information
- Edit profile (saved to localStorage)
- Switch between Student/Applicant status
- View own posts and saved posts

### Messages
- View conversation list
- Open individual chats
- Send messages in real-time (client-side)

### Authentication
- Registration with account type selection (Student/Applicant)
- Form validation
- Email validation (university email for Students)
- Password requirements

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes

- All data is stored in memory (mock data) - refreshing the page will reset to initial state (except user profile saved in localStorage)
- Images use placeholder URLs - replace with actual image URLs or local images
- No backend server required - fully client-side application
- Navigation uses SPA (Single Page Application) approach with History API

## Future Enhancements

- Real backend API integration
- Image upload functionality
- Real-time messaging
- Push notifications
- Search functionality
- Advanced filtering

## License

This is an MVP project for demonstration purposes.


