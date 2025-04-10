export const applyInitialTheme = () => {
    const savedTheme = localStorage.getItem('light-mode');
    if (savedTheme === 'true') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  };
  