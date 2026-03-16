# Example Names

A Hono-based API for managing names with TypeScript and PostgreSQL.

## Prerequisites

- Node.js (v18+)
- PostgreSQL running locally
- npm

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file to create your local `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL connection string:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/example_db
```

> The above example assumes `example_db` is an existing db, so make sure to have it created.

## Running the Application

### 1. Push Database Schema

Before running the app for the first time, push the database schema:

```bash
npm run db-push
```

### 2. Start the Development Server

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Running in Docker

This project includes a `Dockerfile`, so you can build and run the app in a container.

### Build the image

```bash
docker build -t example-names .
```

### Run the container

```bash
docker run --rm -p 3000:3000 --name example-app --env-file .env example-names
```

> ⚠️ Make sure your `.env` file is configured before running the container (especially `DATABASE_URL`).

## Testing

Run the test suite:

```bash
npm test
```

To run tests in watch mode:

```bash
npm test -- --watch
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run db-push` - Push database schema changes
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the built application
- `npm test` - Run tests with Vitest
- `npm run prettier:check` - Check code formatting
