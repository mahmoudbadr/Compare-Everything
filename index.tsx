import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Initializing Versus Engine...");

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Versus Engine mounted successfully.");
  } else {
    throw new Error("Failed to find root element");
  }
} catch (error) {
  console.error("Mount Error:", error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `<div style="color:red; padding: 20px;">Failed to start app: ${error instanceof Error ? error.message : String(error)}</div>`;
  }
}
