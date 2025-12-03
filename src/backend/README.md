# AI4STYLE Backend

## Introduction

Welcome to the **AI4STYLE Backend**, the robust server-side application powering the AI4STYLE e-commerce platform. This system is designed to handle complex e-commerce operations, including product management with dynamic variants, secure order processing, payment integration, and user authentication.

## Features

*   **Authentication & Authorization**: Secure JWT-based authentication, OTP verification, and Role-Based Access Control (RBAC) for Admin, Staff, and Customers.
*   **Product Management**: flexible product system supporting multiple options (colors, materials) and variants (sizes, SKUs) with inventory tracking.
*   **Order Processing**: Reliable order creation and management using the **Unit of Work** pattern to ensure data consistency across transactions.
*   **Payment Integration**: Seamless integration with payment gateways like **Momo** and support for Cash on Delivery (COD).
*   **Media Management**: Integrated with **Cloudinary** for efficient image uploading and management.
*   **Clean Architecture**: Built with a strict separation of concerns to ensure maintainability, testability, and scalability.

## Architecture

This project follows **Clean Architecture** (also known as Onion Architecture) principles, dividing the application into concentric layers:

### 1. Core Layer (`src/core`)
*   **Purpose**: Contains the enterprise business rules and entities.
*   **Components**: Entities, Domain Interfaces, Domain Exceptions, Enums.
*   **Dependencies**: Independent of all other layers and frameworks.

### 2. Application Layer (`src/application`)
*   **Purpose**: Orchestrates the flow of data to and from the entities, and directs those entities to use their enterprise wide business rules to achieve the goals of the use case.
*   **Components**: Services, DTOs (Data Transfer Objects), Use Cases.
*   **Dependencies**: Depends only on the Core layer.

### 3. Infrastructure Layer (`src/infrastructure`)
*   **Purpose**: Provides implementations for interfaces defined in the outer layers. Handles external concerns like database access, file storage, and third-party services.
*   **Components**: Repositories (Prisma), External Services (Cloudinary, Payment Providers), NestJS Modules.
*   **Dependencies**: Depends on Application and Core layers.

### 4. Presentation Layer (`src/presentation`)
*   **Purpose**: Handles HTTP requests and responses. Adapts data for the Application layer.
*   **Components**: Controllers.
*   **Dependencies**: Depends on the Application layer.

### Key Patterns
*   **Unit of Work**: Implemented with Prisma transactions to guarantee atomicity for complex operations like Order Creation and Payment Processing.
*   **Dependency Injection**: Uses `useFactory` to inject dependencies, keeping the Application layer pure and framework-agnostic.

## Technology Stack

*   **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient and scalable server-side applications.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript.
*   **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on [Supabase](https://supabase.com/)).
*   **ORM**: [Prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM.
*   **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema declaration and validation library.
*   **Authentication**: [Passport](http://www.passportjs.org/) with JWT strategies.
*   **File Storage**: [Cloudinary](https://cloudinary.com/).

## Getting Started

### Prerequisites
*   Node.js (v18 or later)
*   npm or yarn
*   PostgreSQL database

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd src/backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and configure the following:
    ```env
    #Host
    HOST=localhost
    PORT=3001
    NODE_ENV=development

    #API Key
    API_KEY="your-api-key"

    # Database
    DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
    DIRECT_URL=""

    # Authentication
    JWT_SECRET="your-secret-key"
    JWT_EXPIRATION=3600
    
    # Admin Setup
    ADMIN_EMAIL="admin@example.com"
    ADMIN_PASSWORD="securepassword"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME="your-cloud-name"
    CLOUDINARY_API_KEY="your-api-key"
    CLOUDINARY_API_SECRET="your-api-secret"
    CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
    
    # Payment (Momo)
    MOMO_PARTNER_CODE="..."
    MOMO_ACCESS_KEY="..."
    MOMO_SECRET_KEY="..."
    MOMO_ACCESS_KEY=F8BBA842ECF85
    MOMO_PARTNER_NAME=AI4STYLE
    MOMO_STORE_ID=MomoAI4STYLEStore
    MOMO_URL=https://payment.momo.vn/v2/gateway/api
    MOMO_URL_TEST=https://test-payment.momo.vn/v2/gateway/api
    MOMO_IPN_URL=https://8326346bc07b.ngrok-free.app/shop/v1/admin/payments/momo/ipn
    ```

4.  Run database migrations:
    ```bash
    npx prisma migrate dev
    ```

5.  Start the development server:
    ```bash
    npm run start:dev
    ```

The server will start on `http://localhost:3001` (or your configured port).

## API Documentation

The API is documented using Swagger. Once the server is running, you can access the interactive documentation at:

**[http://localhost:3001/swagger](http://localhost:3001/swagger)**

## Folder Structure
```
├── application
│   ├── product
│   │   ├── dtos
│   │   └── services
│   └── ...
├── app.module.ts
├── core
│   ├── product
│   │   ├── entities
│   │   ├── enums
│   │   ├── exceptions
│   │   └── interfaces
│   └── ...
│
├── infrastructure
│   ├── infrastructure.module.ts
│   ├── modules
│   ├── prisma
│   ├── scheduler
│   └── services
│       ├── auth-strategies
│       ├── cache
│       ├── cloudinary
│       ├── initialization.service.ts
│       ├── logger
│       ├── payment-providers
│       └── token
├── main.ts
├── presentation
│   ├── controllers
│   ├── filters
│   ├── guards
│   ├── interceptors
│   ├── middlewares
│   └── pipes
└── shared
    ├── dtos // common dtos
    ├── enums // common enums
    ├── helpers // common helpers, utils
    └── interfaces // common interfaces
```