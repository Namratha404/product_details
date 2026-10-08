import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

const IS_MCP = window !== window.parent;

function AppMcpWrapper() {
  const [mcpData, setMcpData] = useState(null);
  const { app, isConnected, error } = useApp({
    appInfo: { name: 'Product Details', version: '1.0.0' },
    capabilities: { availableDisplayModes: ['inline', 'fullscreen'] },
    onAppCreated: (a) => {
      a.ontoolresult = (result) => {
        const sc = result?.structuredContent ?? result?.content ?? null;
        const structured = sc?.structuredContent ? sc.structuredContent : sc;
        // handle both artifact view and direct structuredContent
        const viewId = structured?.viewId ?? structured?.view;
        if (structured && (viewId === 'product-details' || structured.view === 'artifact')) {
          // normalized product shape
          const data = structured.data ?? structured;
          const p = data.product || data;
          setMcpData({
            productName: p.name,
            category: p.status ?? 'Product',
            specs: data.specs ?? [],
            highlights: data.highlights ?? [],
            features: data.features ?? [],
          });
        }
      };
    },
  });

  if (error) return <div>MC P connection failed: {error.message}</div>;
  if (!app || !isConnected) return <div>Connecting…</div>;

  return <App mcpApp={app} mcpData={mcpData} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {IS_MCP ? <AppMcpWrapper /> : <App mcpApp={null} mcpData={null} />}
  </React.StrictMode>,
);
