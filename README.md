# AI4STYLE

## Introduction
AI4STYLE is a comprehensive e-commerce platform developed for the Introduction to Software Engineering course. It aims to revolutionize the online fashion shopping experience by integrating advanced AI technologies. The platform features a standard e-commerce workflow enhanced with a smart Chatbot for personalized style advice and a Virtual Try-On (Viton) system, allowing users to visualize how clothes look on them before purchasing.

## Team Members
| No. | Full Name | Student ID | 
| :-: | :--- | :--- |
| 1 | Lê Nguyễn Nhật Trường | 23127136 | 
| 2 | Nguyễn Anh Khoa | 23127209 | 
| 3 | Nguyễn Anh Thư | 23127266 | 
| 4 | Đặng Lữ Kiều My | 23127230 | 
| 5 | Tạ Xuân Trường | 23127506 | 


## Core Features
- **AI Chatbot**: Provides personalized fashion advice and product recommendations.
- **Virtual Try-On (Viton)**: Allows users to virtually try on clothes using uploaded photos.
- **Product Management**: Browse, search, and filter a wide range of fashion items.
- **Shopping Cart & Checkout**: Seamless ordering process with guest and user support.
- **User Accounts**: Profile management and order history tracking.
- **Admin Dashboard**: Comprehensive management for Products, Users, Roles, Orders, and Images.

## Technology Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Shadcn UI.
- **Backend**: NestJS, TypeScript, Prisma ORM.
- **Database**: PostgreSQL.
- **Storage**: Cloudinary.
- **AI Integration**: Huggingface, Groq.

## Installation

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (optional, for containerized run)
- PostgreSQL (for manual run)

### Setup Environment Variables
Before running the application, make sure to set up the environment variables.
1.  **Backend**: Copy `src/backend/.env.example` to `src/backend/.env` and update the values.
2.  **Frontend**: Copy `src/frontend/.env.example` to `src/frontend/.env` and update the values.

### Option 1: Using Docker (Recommended)
This is the easiest way to get the full stack running.

1.  Navigate to the project root.
2.  Run the following command:
    ```bash
    docker-compose up -d --build
    ```
    This will build and start both the Backend (port 3001) and Frontend (port 3000) services, along with the database.

### Option 2: Manual Installation

#### Backend
1.  Navigate to the backend directory:
    ```bash
    cd src/backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run start:dev
    ```
    The server will start at `http://localhost:3001`. Swagger documentation matches `http://localhost:3001/swagger`.

#### Frontend
1.  Navigate to the frontend directory:
    ```bash
    cd src/frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.