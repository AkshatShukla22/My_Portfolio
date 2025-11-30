// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ContentProvider } from './context/ContentContext';
import './styles/global.css';
import './styles/variables.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ContentProvider>
          <RouterProvider router={router} />
        </ContentProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);