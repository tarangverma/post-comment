# Blog Post & Comments API

A simple post-comments API service that allows users to create, read, update, and delete blog posts and comments.

## Features

- CRUD operations for posts and comments
- Data validation and serialization
- Swagger API documentation
- PostgreSQL database integration
- Logging with Pino
- Security middleware (Helmet, CORS)
- TypeORM for database management

## Project Architecture

This project follows a clean, modular architecture based on NestJS framework principles:

### Core Components

1. **Controllers Layer (`src/*/controller.ts`)**
   - Handles HTTP requests and responses
   - Routes requests to appropriate service methods
   - Performs request validation using DTOs
   - Implements Swagger documentation

2. **Services Layer (`src/*/service.ts`)**
   - Contains business logic
   - Interacts with repositories
   - Handles data transformation
   - Implements error handling

3. **Entities Layer (`src/*/entities/*.entity.ts`)**
   - Defines database models
   - Contains TypeORM decorators for database mapping
   - Implements relationships between entities

4. **DTOs Layer (`src/*/dto/*.dto.ts`)**
   - Defines data transfer objects
   - Implements validation rules
   - Handles data serialization/deserialization
   - Documents API request/response structures

### Project Structure

```
src/
├── database/           # Database configuration
├── decorators/         # Custom decorators
├── post/              # Post module
│   ├── dto/           # Data Transfer Objects
│   ├── entities/      # Database entities
│   ├── post.controller.ts
│   ├── posts.service.ts
│   └── posts.module.ts
└── main.ts            # Application entry point
```

### Key Design Patterns

- **Repository Pattern**: Using TypeORM repositories for data access
- **Dependency Injection**: NestJS's built-in DI container
- **DTO Pattern**: For request/response data validation and transformation
- **Decorator Pattern**: For method logging and Swagger documentation

### Security Features

- Helmet middleware for HTTP headers security
- CORS configuration
- Request validation
- Data sanitization

### Database Design

- PostgreSQL as the primary database
- TypeORM for object-relational mapping
- Migrations for version control of database schema
- Relationships:
  - One-to-Many between Post and Comments
  - Future extensibility for user relationships

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v14 or later)
- Docker (optional, for containerization)

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

#### Database Configuration
```.env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=post_service_db
DB_PORT=5432
PORT=3000
```

#### Application Configuration
```.env
NODE_ENV=development
PORT=3000
```

#### CORS Configuration (comma-separated URLs)
```.env
CORS_URIS=http://localhost:3000
```


## Database Setup

### Using Docker (Recommended)

1. Start PostgreSQL using Docker:

```bash
docker run -d -v postgresqldata:/data/db -e POSTGRES_PASSWORD=postgres --name postgres -p 5432:5432 postgres
```

### Manual Setup

1. Install PostgreSQL on your system
2. Create a new database:

```sql
CREATE DATABASE post_service_db;
```

## Installation

#### Install dependencies
```bash
npm install
```

#### Generate TypeORM migrations

TypeORM is able to automatically generate migration files with schema changes you made

Let's say you have a Post entity with a title column, and you have changed the name title to name. You can run following command:

```bash
npm run db:migration:generate src/migrations/${migration_name}
```

PS: Please use CamelCase for the migration name starting with a uppercase letter

#### Run migrations

```bash
npm run db:migrations:run
```

###### Revert migration

```bash
npm run db:migrations:revert
```

#### Start the application

```bash
npm run start:dev
```


## API Documentation

The API documentation is available through Swagger UI at the root path (`/`). After starting the application, visit:

http://localhost:3000/


## Available Endpoints

### Posts

- `POST /api/:userId/posts` - Create a new post
- `GET /api/:userId/posts` - Get all posts for a user
- `GET /api/:userId/posts/:id` - Get a specific post
- `PUT /api/:userId/posts/:id` - Update a post
- `DELETE /api/:userId/posts/:id` - Delete a post

### Comments

- `POST /api/:userId/posts/:postId/comments` - Add a comment to a post
- `PUT /api/:userId/posts/:postId/comments/:commentId` - Update a comment


## Future Improvements

The following features could be implemented to enhance the application:

### User Module
- User registration and profile management
- Email verification
- Password reset functionality

### Authentication & Authorization
- JWT-based authentication
- Session management

### Additional Features
- Post categories and tags
- Image upload support
- Post reactions (likes, bookmarks)
- Search functionality
- Notification system
