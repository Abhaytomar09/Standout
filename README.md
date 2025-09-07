# Short Description

Standout is a university-branded social media platform for sharing text, images, and videos. It features secure login, unique usernames, live feed, likes, and moderation tools to ensure a safe and engaging campus community experience.

# Project Description

Standout Social Media is a modern, university-branded social networking platform designed to foster authentic connections and safe interactions among students. Built with Node.js, Express, SQLite, and a responsive HTML/CSS/JavaScript frontend, Standout enables users to register, log in, and share their thoughts through tweets that can include text, images, or videos. The platform emphasizes user identity and safety by enforcing unique usernames and display names, with the ability to change display names only once every 48 hours to prevent impersonation and confusion.

Users can view a live feed of posts, like tweets (limited to one like per user per tweet), and interact with content in real time. Standout incorporates university branding and customizable settings, making it ideal for campus communities seeking a tailored social experience. The backend features robust moderation tools, allowing administrators to block users who post nuisance or inappropriate content, helping maintain a positive environment.

The project is organized into a clear structure, separating backend logic, database management, and frontend assets for maintainability and scalability. The backend handles authentication, session management, tweet processing, and moderation, while the frontend delivers a clean, intuitive interface for posting, browsing, and interacting with tweets. Security best practices are followed, including session-based authentication and input validation, with recommendations for further enhancements like rate limiting and advanced security measures.

Standout is easy to set up and run locally, requiring only Node.js and npm for installation. The platform is extensible, with suggestions for future features such as profile pages, image/video uploads, follow/unfollow functionality, and more university-specific options. This project demonstrates full-stack development skills, secure user management, and thoughtful feature design, making it a strong addition to any portfolio or campus initiative.

# Standout Social Media

## Features
- User registration & login (unique username required)
- Post tweets (text, image, video)
- View live feed
- Like tweets (one like per user per tweet)
- Change display name (must be unique, once every 48 hours)
- University branding and settings
- Moderation: block users for nuisance content


## Project Structure
```
Standout/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tweets.js
│   ├── db.js
├── public/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       └── tweets.js
├── package.json
└── README.md
```


## How to Run Locally

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the server:
   ```powershell
   npm start
   ```
3. Open in browser:
   - Signup: http://localhost:5000/signup.html
   - Login: http://localhost:5000/login.html
   - Feed: http://localhost:5000/index.html

## Extend Features
- Profile page, likes, image/video upload, follow/unfollow
- University-specific features and branding
- Input validation, rate limiting, security best practices

## Resume Bullets
- Built a full-stack social platform (Standout) using HTML, CSS, JS, Node.js, Express, and SQLite
- Enforced unique usernames and display names for all users
- Implemented user registration, login, post creation, live feed, likes, and moderation
- Used session-based authentication and secure profile editing
