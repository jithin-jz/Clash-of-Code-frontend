# Code of Clans - Frontend

The frontend application for **Code of Clans**, built with React and TailwindCSS. It provides a rich, interactive user interface for gaming profiles.

## 🛠️ Tech Stack

-   **React 19**: Modern UI library for building interactive interfaces.
-   **Vite**: Fast build tool and development server.
-   **TailwindCSS v4**: Utility-first CSS framework for styling.
-   **Zustand**: Lightweight state management for handling auth and user data.
-   **Framer Motion**: For smooth animations.
-   **Lucide React**: Icon library.
-   **Axios**: HTTP client for API requests.

## 📂 Project Structure

-   `src/components/`: Reusable UI components.
-   `src/pages/`: Page components for routing.
-   `src/services/api.js`: Centralized API configuration and endpoints.
-   `src/stores/`: Zustand stores (e.g., `useAuthStore.js`).
-   `public/assets/`: Static image assets.

## 🚀 Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build`
Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`
Runs ESLint to analyze code for potential errors.

### `npm run preview`
Locally preview the production build.

## ⚙️ Configuration

The frontend communicates with the backend via API calls. Ensure the backend is running and CORS is configured correctly to accept requests from the frontend URL.
