// Script to clear maintenance mode data from localStorage
// This can be run in the browser console to remove any maintenance mode settings

// Remove maintenance mode flag
localStorage.removeItem("maintenance-mode");

// Remove maintenance message
localStorage.removeItem("maintenance-message");

console.log("Maintenance mode data has been cleared from localStorage");
