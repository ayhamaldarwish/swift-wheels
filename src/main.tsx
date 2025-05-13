import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initEmailJS } from './services/emailService'

// Global error handler for external scripts
window.addEventListener('error', (event) => {
  // Check if the error is from contentscript.js
  if (event.filename && event.filename.includes('contentscript.js')) {
    // Prevent the error from being reported to the console
    event.preventDefault();

    // Optionally log a more friendly message
    console.warn('An error occurred in an external script (contentscript.js). This is likely from a browser extension and not from our application.');

    return true; // Prevents the error from bubbling up
  }

  return false; // Let other errors bubble up normally
});

// Initialize EmailJS
initEmailJS();

createRoot(document.getElementById("root")!).render(<App />);
