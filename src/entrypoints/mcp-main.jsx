import React from 'react';
import ReactDOM from 'react-dom/client';
import McpRoot from '../mcp/McpRoot.jsx';
import '../styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('MCP App root element was not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <McpRoot />
  </React.StrictMode>,
);
