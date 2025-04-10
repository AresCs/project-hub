import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarMenu.css';

const SidebarMenu = () => {
  const [open, setOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ⬇ Load light mode preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('light-mode');
    if (savedTheme === 'true') {
      setLightMode(true);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  // ⬆ Save and apply light mode changes
  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('light-mode', String(lightMode));
  }, [lightMode]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleHome = () => {
    navigate('/');
    setOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
    setOpen(false);
  };

  return (
    <>
      <button className="hamburger" onClick={() => setOpen(true)}>☰</button>

      <div className={`sidebar ${open ? 'open' : ''}`} ref={menuRef}>
        <button onClick={handleHome}>🏠 Home</button>
        <button onClick={handleBack}>🔙 Back</button>
        <button onClick={() => setLightMode(!lightMode)}>
          {lightMode ? '🌙 Dark Mode' : '🌞 Light Mode'}
        </button>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
};

export default SidebarMenu;
