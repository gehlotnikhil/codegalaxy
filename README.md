# CodeGalaxy

## Introduction
CodeGalaxy is a coding platform designed to provide an environment where anyone can brush up on their DSA (Data Structures and Algorithms) and logic-building skills. It also offers a time-capped environment where users must solve problems within a given time, and contest rankings are determined accordingly.

## Features
- **Real-time Contests**: Participate in coding compete with dynamic rankings.
- **Leaderboard & Rating System**: Track your progress with Real Time Leaderboard.
- **Time-Capped Challenges**: Solve Contest problems within a given time limit.
- **Daily New Problem Feature**: Solve new Coding Question Daily.
- **One-to-One Compete Feature**: Challenge another user in a one-to-one coding battle.
- **User Authentication**: Secure Authentication by Google and GitHub.
- **Backend API**: Efficient handling of contest and problem data and user profiles.

## Live Site: https://codegalaxy1.vercel.app/
- Demo Credential
 - - Email: gehlot38@gmail.com
 - - Password: 111111

## Tech Stack
- React (TypeScript)
- Express.JS (TypeScript)
- Node.JS (TypeScript)
- Redux Toolkit
- MongoDB
- Bootstrap
- Prisma ORM

## Setup & Installation
### Prerequisites
Ensure you have the following installed on your system:
- Node.js
- MongoDB

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/gehlotnikhil/codegalaxy.git
   cd codegalaxy
   ```
2. **Install Frontend and Backend dependencies:**
   ```sh
   npm run install-all
   ```
3. **Run Both Frontend and Backend:**
   ```sh
   npm run both
   ```

5. **Add Envirnment variable in server/.env:**
   ```sh
   ServerUrl = "http://localhost:8000" //Server URL
   PORT=8000 
EMAIL = "Enter Your Email to enable OTP Feature in Project"
CLIENT_ID = "Enter CLIENT_ID from Gmail API OAuth"
CLIENT_SECRET = "Enter CLIENT_SECRET from Gmail API OAuth"
REFRESH_TOKEN =" Enter REFRESH_TOKEN from Gmail API OAuth"
DATABASE_URL = "Enter your MongoDB or Other Database URL"

   ```
6. Open `http://localhost:5173` in your browser.
 


