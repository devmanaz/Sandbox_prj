# CodeSandbox Clone - Sandbox_prj

A powerful, browser-based coding environment built with React and Vite. This project provides a seamless IDE-like experience within the browser, featuring a sophisticated code editor, dashboard, and user authentication.

## 🚀 Features

-   **Interactive IDE**: Full-featured code editor using Monaco (the engine behind VS Code).
-   **User Dashboard**: Manage your projects and sandboxes efficiently.
-   **Authentication**: Secure Login and Sign-up functionality.
-   **Modern UI/UX**: Built with Tailwind CSS for a premium, responsive design.
-   **Live Preview**: Real-time feedback as you code.

## 🛠 Tech Stack

-   **Frontend Framework**: React 18
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **Editor Engine**: Monaco Editor (`@monaco-editor/react`)
-   **Icons**: Lucide React
-   **Routing**: React Router DOM

## 📦 Getting Started

### Prerequisites

-   Node.js (Latest LTS recommended)
-   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd Sandbox_prj
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Navigate to `http://localhost:5173` in your browser.

## 📁 Project Structure

```text
Sandbox_prj/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Main application pages (Editor, Dashboard, Login, SignUp)
│   ├── App.jsx         # Main application component & routing
│   └── main.jsx        # Application entry point
├── public/             # Static assets
├── index.html          # HTML template
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 📜 Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the project for production.
-   `npm run lint`: Runs ESLint for code quality checks.
-   `npm run preview`: Previews the production build locally.