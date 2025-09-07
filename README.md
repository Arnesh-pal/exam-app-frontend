Modern Exam App - Frontend
This is the frontend for the Modern Exam App, a full-stack quiz application built with React. It provides a clean, modern, and responsive user interface for users to register, log in, set up and take exams, and review their performance history.

Live Site: https://exam-app-frontend-chi.vercel.app

Backend API Repository: exam-app-backend

Features
Modern UI: Built with the Material-UI (MUI) component library for a professional and consistent look and feel.

Responsive Design: The interface is fully responsive and works beautifully on desktop, tablet, and mobile devices.

Protected Routes: User-facing pages like the exam and history are protected, ensuring only authenticated users can access them.

Global State Management: Uses React's Context API to manage user authentication state across the entire application.

Dynamic Exam Setup: Users can customize their exam by choosing a topic, difficulty level, and number of questions.

Interactive Exam Experience: Supports both single and multiple-choice questions, with a live countdown timer and smooth navigation.

Detailed History & Analytics: A dedicated history page shows past attempts and provides a topic-wise breakdown of correct and incorrect answers.

Tech Stack
Library: React.js

UI: Material-UI (MUI)

Routing: React Router

State Management: React Context

API Communication: Axios

Hosting: Vercel

Local Setup
To run this project locally, follow these steps:

Clone the repository:

git clone [https://github.com/YourUsername/exam-app-frontend.git](https://github.com/YourUsername/exam-app-frontend.git)
cd exam-app-frontend

Install dependencies:

npm install

Configure Environment Variables:

This project requires a connection to the backend API. Create a .env.local file in the root directory.

Add the following variable, pointing to your local backend server:

REACT_APP_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

(Note: For production, this variable should be set in your hosting provider's environment variables to point to the live backend URL.)

Run the application:

npm start

The application will be available at http://localhost:3000.