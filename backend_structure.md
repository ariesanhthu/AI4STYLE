# Backend Structure Analysis - AI4STYLE

This document outlines the backend structure of the AI4STYLE project, which follows the Clean Architecture principles.

## High-Level Structure

The backend source code is located in `src/backend/src` and is divided into four main layers:

1.  **Core (`src/backend/src/core`)**: Contains the enterprise business rules. It is independent of frameworks and external agencies.
2.  **Application (`src/backend/src/application`)**: Contains the application business rules. It orchestrates the flow of data to and from the entities.
3.  **Infrastructure (`src/backend/src/infrastructure`)**: Contains frameworks and drivers. It implements the interfaces defined in the Core and Application layers.
4.  **Presentation (`src/backend/src/presentation`)**: Contains the interface adapters. It handles HTTP requests and responses.

## Detailed Layer Breakdown

### 1. Core Layer (`src/backend/src/core`)

This layer is organized by domain modules (e.g., `auth`, `product`, `user`). Each module typically contains:

*   **`entities`**: Domain objects with business logic.
*   **`interfaces`**: Abstract definitions for repositories and services (ports).
*   **`enums`**: Domain-specific enumerations.
*   **`exceptions`**: Domain-specific error classes.

**Example: `src/backend/src/core/product`**
*   `entities/`: Product entities.
*   `interfaces/`: `IProductRepository`, `IProductService` (interfaces).
*   `enums/`: Product-related enums.
*   `exceptions/`: Product-related exceptions.

### 2. Application Layer (`src/backend/src/application`)

This layer is also organized by domain modules. It implements the use cases of the application.

*   **`dtos`**: Data Transfer Objects for input and output.
*   **`services`**: Application services that implement the business logic using domain entities and repository interfaces.

**Example: `src/backend/src/application/product`**
*   `dtos/`: `CreateProductDto`, `UpdateProductDto`, `ProductResponseDto`.
*   `services/`: `ProductService` (implementation of application logic).

### 3. Infrastructure Layer (`src/backend/src/infrastructure`)

This layer contains the concrete implementations and framework-specific code.

*   **`modules`**: NestJS modules that wire up the dependencies for each domain (e.g., `AuthModule`, `ProductModule`).
*   **`prisma`**: Database access logic.
    *   `prisma.service.ts`: Prisma client instance.
    *   `repositories/`: Concrete implementations of repository interfaces (e.g., `PrismaProductRepository`).
    *   `unit-of-work/`: Unit of Work implementation.
*   **`services`**: Implementations of external services (e.g., Cloudinary, Email, Payment).
*   **`scheduler`**: Cron jobs and scheduled tasks.
*   **`https`**: HTTP client configurations.

### 4. Presentation Layer (`src/backend/src/presentation`)

This layer handles the interaction with the outside world (HTTP API).

*   **`controllers`**: Handle incoming HTTP requests and return responses. Organized by domain (e.g., `auth`, `product`).
*   **`guards`**: Authentication and authorization guards (e.g., `JwtAuthGuard`, `RolesGuard`).
*   **`filters`**: Exception filters for handling errors globally or locally.
*   **`interceptors`**: Interceptors for transforming responses or handling cross-cutting concerns (e.g., logging, caching).
*   **`middlewares`**: Express/NestJS middlewares.
*   **`pipes`**: Validation and transformation pipes.

## Dependency Flow

The dependency rule is strictly followed:
**Presentation -> Infrastructure -> Application -> Core**

*   **Core** depends on nothing.
*   **Application** depends on **Core**.
*   **Infrastructure** depends on **Application** and **Core**.
*   **Presentation** depends on **Application** and **Core** (and implicitly Infrastructure via dependency injection).

## Key Files

*   `src/backend/src/app.module.ts`: The root module of the application.
*   `src/backend/src/main.ts`: The entry point of the application.
*   `src/backend/src/infrastructure/infrastructure.module.ts`: Exports infrastructure services and modules.
