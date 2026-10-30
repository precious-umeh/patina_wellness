# Patina Wellness Solutions – Frontend

The frontend application for **Patina Wellness Solutions**, built with Next.js. It provides the public website, product browsing and shopping experience, booking and inquiry features, and an administrative dashboard for managing website content and operations.

## Tech Stack

- **Next.js 16** – React framework and application routing
- **React 19** – UI development
- **Tailwind CSS 4** – Styling
- **Axios** – HTTP requests to the backend API
- **Framer Motion** – Animations and transitions
- **Phosphor Icons** – Icon library
- **ESLint** – Code linting
- **Prettier** – Code formatting

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone <https://github.com/precious-umeh/patina_wellness.git>
   ```

2. Navigate to the frontend directory:

   ```bash
   cd patina/frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the frontend root directory and configure the required environment variables.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically reload as you make changes to the source files.

## Environment Variables

The frontend requires the following environment variables:

| Variable               | Description                                                                    |
| ---------------------- | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`  | Base URL of the backend API.                                                   |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the frontend website. Used for site metadata and canonical URLs. |

Example `.env` configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:5500
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Update these values to match your local backend configuration and production deployment.

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not store secrets, private API keys, or credentials in them.

## Available Scripts

Run these commands from the frontend directory:

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Starts the development server.         |
| `npm run build` | Creates an optimized production build. |
| `npm run start` | Starts the production server.          |
| `npm run lint`  | Runs ESLint to check for code issues.  |

## Project Structure

The application uses the Next.js App Router.

```text
frontend/
├── public/              # Static assets
├── src/
│   ├── app/
│   │   ├── (main)/      # Public website routes
│   │   ├── (admin)/     # Admin dashboard routes
│   │   ├── (auth)/      # Authentication routes
│   │   ├── components/  # Shared UI components
│   │   └── ...          # Application routes and configuration
│   ├── lib/             # Shared utilities and API configuration
│   └── ...
├── .env                 # Local environment variables
├── package.json
└── README.md
```

Route groups are used to organize related pages without adding the group names to the URL.

## Production Build

To create and test a production build locally:

```bash
npm run build
npm run start
```

The production application will run on [http://localhost:3000](http://localhost:3000) by default.

Ensure the production environment variables are configured correctly before deployment.

## Code Quality

Run the linter before committing changes:

```bash
npm run lint
```

This checks the project against its configured ESLint rules.

## Learn More

For additional information about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://motion.dev/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
