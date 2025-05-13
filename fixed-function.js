/**
 * Loads a JavaScript file by creating a script element and appending it to the document head.
 * This function is designed to work within a Chrome extension context.
 * 
 * @param {string} fileName - The name of the JavaScript file without the .js extension
 * @returns {HTMLScriptElement} The created script element
 */
function loadScript(fileName) {
    // Append .js extension to the filename
    const scriptPath = fileName + ".js";
    
    // Create a new script element
    const scriptElement = document.createElement("script");
    
    // Set script attributes
    scriptElement.type = "text/javascript";
    scriptElement.src = chrome.runtime.getURL(scriptPath);
    scriptElement.async = true;
    
    // Append the script to the document head
    document.head.appendChild(scriptElement);
    
    // Return the script element
    return scriptElement;
}
