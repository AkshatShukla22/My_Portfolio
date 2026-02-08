// frontend/src/App.jsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Loader from './components/common/Loader/Loader';
import ScrollProgress from './components/common/ScrollProgress/ScrollProgress';
// import './App.css';

function App() {
  const { theme, loading } = useTheme();

  useEffect(() => {
    if (theme) {
      // Apply theme variables to CSS
      const root = document.documentElement;
      Object.entries(theme).forEach(([key, value]) => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
          const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          root.style.setProperty(`--${cssVar}`, value);
        }
      });
    }
  }, [theme]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="app">
      <ScrollProgress />
      <Outlet />
    </div>
  );
}

export default App;
// make it respnsive