# MERN expense-tracker

An Expense Tracker is a digital tool designed to help individuals and businesses monitor, categorize, and analyze their spending. It provides insights into financial habits, assists in budgeting, and ensures better money management.

A full-stack expense management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features JWT authentication, data visualization, and PDF export capabilities.

## 🚀 Features
- **User Authentication**: Secure signup/login with JWT
- **Expense Management**: Add, edit, delete, and categorize expenses
- **Data Visualization**: Interactive charts (Chart.js) for spending analysis
- **PDF Export**: Generate financial reports
- **Responsive UI**: Built with React and Tailwind CSS

## 🛠 Tech Stack
| Frontend               | Backend            | Database          |
|------------------------|--------------------|-------------------|
| React.js               | Node.js            | MongoDB           |
| Redux/TanStack Query   | Express.js         | Mongoose (ODM)    |
| Chart.js               | JWT Authentication | Aggregation Pipeline |
| Tailwind CSS           |                    |                   |

## 📦 Installation

### Prerequisites
- Node.js (v22.15)
- MongoDB Atlas account or local MongoDB instance

### Backend Setup
1. Clone the repository:
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker/server
   
2. Install dependencies:
   npm install
   
3. Create .env file:
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/expense-tracker?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   
5. Start the server:
    npm run dev

## 🌐 API Endpoints
| Method | Endpoint            | Description                 |
|--------|---------------------|-----------------------------|
| POST   | /api/auth/signup  | User registration           |
| POST   | /api/auth/login  | User login                  |
| POST   | /api/expenses    | Add new expense             |
| GET    | /api/expenses    | Get all expenses (filterable) |
| DELETE | /api/expenses/:id | Delete expense              |
