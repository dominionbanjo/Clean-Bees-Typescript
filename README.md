# Clean Bees - Professional Cleaning Services

[Live Demo](https://clean-bees.netlify.app/)

## Overview

Clean Bees offers a variety of cleaning services for both homes and offices. Customers can easily book professional cleaners, manage their cleaning schedules, and enjoy a spotless environment with ease.

## Features

1. Book cleaning services for homes and offices.
2. Choose from different cleaning packages.
3. Secure user authentication (Sign up, Login, Logout).
<!-- 4. Track and manage cleaning appointments.
4. Admin dashboard for managing bookings and users.
5. Notifications and reminders for upcoming cleanings. -->

## Tech Stack

### Frontend

- React
- React Router
- Styled Components
- Framer Motion
- React Query
- React Transition Group
- Axios
- Zod (Form Validation)
- Recharts (Data Visualization)
- FontAwesome Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Tokens (JWT)
- bcryptjs
- Helmet
- Express Rate Limit
- Express Validator
- Express Mongo Sanitize

### Other Dependencies

- Cloudinary (Image Hosting)
- Multer (File Uploads)
- SendGrid (Email Service)
- Day.js (Date Formatting)
- Nanoid (Unique ID Generation)
- Cookie Parser

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine.

### 2. Install Dependencies

npm install

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the necessary environment variables:

MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_jwt_secret  
CLOUDINARY_CLOUD_NAME=your_cloudinary_name  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  
SENDGRID_API_KEY=your_sendgrid_api_key

### 4. Start the Development Server

#### Backend

npm run dev

#### Frontend

cd client  
npm run dev

## Project Scripts

| Command                      | Description                                   |
| ---------------------------- | --------------------------------------------- |
| npm run setup-production-app | Installs dependencies and builds the frontend |
| npm run start                | Starts the backend server                     |
| npm run dev                  | Runs the backend in development mode          |
| npm run build                | Builds the project for production             |
| npm run preview              | Serves the production build locally           |

## License

This project is licensed under the **ISC License**.
