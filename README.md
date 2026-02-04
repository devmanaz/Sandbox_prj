# CodeSandbox Clone - Sandbox_prj

A powerful, browser-based coding platform built with React, Vite, and Tailwind CSS. This project provides a seamless IDE-like experience within the browser, featuring a sophisticated code editor (Monaco Engine), interactive dashboard, and secure user authentication.

## 🚀 Features

- **Interactive IDE**: Full-featured code editor using Monaco (the engine behind VS Code).
- **User Dashboard**: Manage your projects and explore coding scenarios efficiently.
- **Authentication**: Secure Login and Signup functionality (with username support).
- **Modern UI/UX**: Built with Tailwind CSS, featuring glassmorphism, smooth gradients, and Lucide icons.
- **Live Preview**: Real-time feedback as you code.
- **Responsive Design**: Fully responsive UI for various screen sizes.

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Editor Engine**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router Dom](https://reactrouter.com/)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd Sandbox_prj
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to `http://localhost:5173` in your browser.

## 🏗️ Project Structure

```text
Sandbox_prj/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Application pages (Login, SignUp, Dashboard, Editor)
│   ├── App.jsx        # Root component and routing
│   ├── main.jsx       # Entry point
│   ├── index.css      # Global styles & Tailwind imports
│   ├── config/        # Configuration files (Supabase, etc.)
│   └── context/       # React Context providers (Auth, etc.)
├── public/            # Static assets
├── index.html         # Root HTML template
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js     # Vite configuration
```

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run preview`: Previews the production build locally.
