# Todo App Monorepo

A layered monorepo architecture for a full-stack Todo application built with Vue 3, Express, TypeScript, and MongoDB.

## 📁 Project Structure

```
todo-monorerepo/
├── packages/
│   ├── domain/          # Core business entities and interfaces
│   ├── data-access/     # Database layer (MongoDB repositories)
│   ├── api/             # REST API layer (Express)
│   └── web/             # Frontend application (Vue 3)
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🏗️ Architecture Layers

### 1. **Domain Layer** (`@todo/domain`)
- Contains core business entities (Todo interface)
- Defines repository interfaces
- No dependencies on other layers
- Pure TypeScript types and interfaces

### 2. **Data Access Layer** (`@todo/data-access`)
- Implements repository interfaces from domain layer
- Handles MongoDB connection and operations
- Converts between database documents and domain entities
- Depends on: `@todo/domain`

### 3. **API Layer** (`@todo/api`)
- Express REST API server
- Exposes HTTP endpoints for todo operations
- Uses repositories from data-access layer
- Depends on: `@todo/domain`, `@todo/data-access`

### 4. **Web Layer** (`@todo/web`)
- Vue 3 frontend application
- Consumes REST API endpoints
- Provides user interface for todo management
- No dependencies on backend packages

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MongoDB running locally on port 27017

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:

For API (create `packages/api/.env`):
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todoapp
```

For Web (create `packages/web/.env`):
```bash
VITE_API_URL=http://localhost:3000
```

### Running the Application

#### Option 1: Run everything together
```bash
pnpm dev
```

#### Option 2: Run individually

**Start the API server:**
```bash
pnpm dev:api
```

**Start the web application:**
```bash
pnpm dev:web
```

### Building for Production

```bash
pnpm build
```

## 📡 API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /health` - Health check

## 🗄️ Database

The application uses MongoDB to store todos. Make sure MongoDB is running before starting the API server.

### Starting MongoDB (if not running)

**Windows:**
```bash
mongod
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
```

## 🛠️ Development

### Package Scripts

Each package has its own scripts:

- `pnpm dev` - Start development mode with hot reload
- `pnpm build` - Build for production
- `pnpm clean` - Clean all node_modules and dist folders

### Adding Dependencies

To add a dependency to a specific package:

```bash
pnpm add <package> --filter @todo/domain
pnpm add <package> --filter @todo/data-access
pnpm add <package> --filter @todo/api
pnpm add <package> --filter @todo/web
```

## 📦 Technologies

- **Frontend:** Vue 3, TypeScript, Vite, Axios
- **Backend:** Express, TypeScript, Node.js
- **Database:** MongoDB
- **Build Tool:** pnpm workspaces

## 🌟 Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as completed
- ✅ Add descriptions to todos
- ✅ Real-time updates
- ✅ Clean layered architecture
- ✅ Type-safe with TypeScript
- ✅ Monorepo structure with workspace dependencies

## 📝 License

MIT
