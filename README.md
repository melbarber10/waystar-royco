# Waystar Royco - Leave Management System

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4%2B-green)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A comprehensive web-based leave management system built with **Node.js**, **Express**, and **MongoDB**. This application provides role-based access control for employees, department heads, and the COO (Chief Operating Officer) to manage leave requests efficiently.

---

## 📑 Table of Contents

- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [User Roles & Permissions](#-user-roles--permissions)
- [Authentication](#-authentication)
- [Database Models](#-database-models)
- [UI/UX Features](#-uiux-features)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [License](#-license)
- [Author](#-author)

---

## 🚀 Features

### Multi-Role System
- **Employee**: Apply for leave, track leave status, view profile
- **Department Head (DH)**: Approve/deny leave requests, manage department employees
- **COO**: Oversee all departments, view analytics, manage department heads

### Core Functionality
- User authentication and authorization
- Leave application and approval workflow
- Profile management with image upload
- Real-time leave status tracking
- Department-based access control
- Responsive web interface

---

## 🛠️ Technology Stack

- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
- **Authentication**: [Passport.js](http://www.passportjs.org/) (local strategy)
- **Template Engine**: [EJS](https://ejs.co/)
- **File Upload**: [Multer](https://github.com/expressjs/multer)
- **Password Hashing**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Validation**: [express-validator](https://express-validator.github.io/)
- **Session Management**: [express-session](https://github.com/expressjs/session)
- **Date Handling**: [Moment.js](https://momentjs.com/)

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/melbarber10/waystar-royco.git
   cd waystar-royco
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/waystar_royco_db
   SESSION_SECRET=your_session_secret_here
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally, or
   - Update `MONGODB_URI` in `.env` to your MongoDB Atlas cluster

5. **Start the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and go to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
waystar-royco/
├── app.js                 # Main application entry point
├── config/
│   ├── database.js        # MongoDB connection configuration
│   └── passport.js        # Passport authentication setup
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── cooController.js   # COO-specific operations
│   ├── dhController.js    # Department Head operations
│   └── employeeController.js # Employee operations
├── middlewares/
│   └── authMiddleware.js  # Authentication middleware
├── models/
│   ├── cooModel.js        # COO data model
│   ├── dhModel.js         # Department Head data model
│   ├── employeeModel.js   # Employee data model
│   └── leaveModel.js      # Leave request model
├── routes/
│   ├── authRoute.js       # Authentication routes
│   ├── cooRoute.js        # COO routes
│   ├── dhRoute.js         # Department Head routes
│   ├── employeeRoute.js   # Employee routes
│   └── index.js           # Main routes
├── views/
│   ├── auth/              # Authentication views
│   ├── coo/               # COO dashboard views
│   ├── dh/                # Department Head views
│   ├── employee/          # Employee views
│   └── shared/            # Shared components
└── public/
    ├── images/            # Static images
    └── stylesheets/       # CSS styles
```

---

## 👥 User Roles & Permissions

### Employee
- Apply for leave requests
- Track leave application status
- View and edit personal profile
- View leave history

### Department Head (DH)
- Approve/deny leave requests from department employees
- View department employee list
- Manage employee profiles
- View leave history and analytics

### COO (Chief Operating Officer)
- Oversee all departments
- Manage department heads
- View comprehensive analytics
- Access all employee data
- Approve/deny leave requests (if needed)

---

## 🔐 Authentication

Uses Passport.js (local strategy). Users are authenticated by role and have access to role-specific features.

---

## 📊 Database Models

### Employee Model
- Basic information (name, email, phone)
- Department assignment
- Profile image
- Password (hashed with bcrypt)

### Leave Model
- Leave details (reason, dates, type)
- Approval workflow
- Status tracking
- Approval/rejection metadata

### Department Head & COO Models
- Role-specific permissions
- Department management capabilities

---

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern and clean interface
- Role-based navigation
- Flash messages for user feedback
- Image upload functionality
- Form validation

---

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/logout` - User logout

### Employee Routes
- `GET /employee/dashboard` - Employee dashboard
- `POST /employee/apply-leave` - Apply for leave
- `GET /employee/track-leave` - Track leave status

### Department Head Routes
- `GET /dh/dashboard` - DH dashboard
- `POST /dh/approve-leave/:id` - Approve leave
- `POST /dh/deny-leave/:id` - Deny leave

### COO Routes
- `GET /coo/dashboard` - COO dashboard
- `GET /coo/employees` - View all employees
- `GET /coo/departments` - Manage departments

---

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use a strong `SESSION_SECRET`
- Configure production MongoDB URI
- Set appropriate `PORT`

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Mohammed Elbarber** 