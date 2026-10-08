import { useEffect, useState } from 'react';
import { useApp, useHostStyles } from '@modelcontextprotocol/ext-apps/react';
import { productData } from '../productData.js';

function McpRoot() {
  const [message, setMessage] = useState('Connecting to MCP host...');
  const [toolData, setToolData] = useState(null);

  function parseToolResult(result) {
    // Prefer structuredContent when available
    const structured = result?.structuredContent ?? null;
    if (structured) {
      // Handle MCP artifact view responses by mapping them to the product shape
      if (structured.view === 'artifact' && structured.data?.product) {
        const p = structured.data.product;
        return {
          productName: p.name,
          category: p.status ?? 'Product',
          specs: structured.data.specs ?? [],
          highlights: structured.data.highlights ?? [],
          features: structured.data.features ?? [],
        };
      }
      return structured;
    }

    // Fallback: try to parse JSON from content/text fields
    try {
      const content = result?.content ?? result?.contents ?? null;
      if (Array.isArray(content) && content.length > 0) {
        for (const item of content) {
          const text = item?.text ?? item?.body ?? null;
          if (typeof text === 'string') {
            const trimmed = text.trim();
            if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
              return JSON.parse(trimmed);
            }
            // try to parse even if not wrapped
            try {
              return JSON.parse(text);
            } catch {}
          }
        }
      }

      // Some SDKs return a top-level text property
      const topText = result?.text ?? result?.message ?? null;
      if (typeof topText === 'string') {
        const t = topText.trim();
        if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
          const parsedTop = JSON.parse(t);
          if (parsedTop?.view === 'artifact' && parsedTop.data?.product) {
            const p = parsedTop.data.product;
            return {
              productName: p.name,
              category: p.status ?? 'Product',
              specs: parsedTop.data.specs ?? [],
              highlights: parsedTop.data.highlights ?? [],
              features: parsedTop.data.features ?? [],
            };
          }
          return parsedTop;
        }
        try {
          const parsedTop = JSON.parse(topText);
          if (parsedTop?.view === 'artifact' && parsedTop.data?.product) {
            const p = parsedTop.data.product;
            return {
              productName: p.name,
              category: p.status ?? 'Product',
              specs: parsedTop.data.specs ?? [],
              highlights: parsedTop.data.highlights ?? [],
              features: parsedTop.data.features ?? [],
            };
          }
          return parsedTop;
        } catch {}
      }
    } catch (e) {
      console.warn('Failed to parse tool result as JSON', e);
    }

    return null;
  }

  const { app, isConnected, error } = useApp({
    appInfo: {
      name: 'Micron Product MCP App',
      version: '1.0.0',
    },
    capabilities: {},
    onAppCreated: (appInstance) => {
      appInstance.ontoolresult = (result) => {
        const parsed = parseToolResult(result);
        setToolData(parsed);
        setMessage(parsed ? 'Product information loaded via MCP.' : 'Received tool result (no structured data).');
      };

      appInstance.ontoolinput = () => {
        setMessage('Requesting product data from MCP host...');
      };
    },
  });

  useHostStyles(app);

  useEffect(() => {
    if (!app || !isConnected) return;

    const loadProductInfo = async () => {
      try {
        const result = await app.callServerTool({
          name: 'get_product_details',
          arguments: {},
        });

        const parsed = parseToolResult(result);
        if (parsed) {
          setToolData(parsed);
          setMessage('Product details loaded successfully.');
        } else {
          setMessage('Product details received but no structured data found.');
        }
      } catch (err) {
        console.error('MCP tool call failed:', err);
        setMessage('Unable to load product data from the MCP host.');
      }
    };

    loadProductInfo();
  }, [app, isConnected]);

  if (error) {
    return <p role="alert">MCP connection failed: {error.message}</p>;
  }

  if (!isConnected) {
    return <p>Connecting to the MCP host...</p>;
  }

  const currentData = toolData ?? {
    productName: productData.productName,
    category: productData.category,
    specs: productData.specs,
    highlights: productData.highlights,
    features: productData.features,
  };

  return (
    <main className="page-shell" style={{ maxWidth: 980, margin: '0 auto', padding: '2rem 1rem' }}>
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">M</div>
          <div>
            <p className="eyebrow">Micron</p>
            <h1>MCP Product Details</h1>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="pill">{currentData.category}</span>
          <h2>{currentData.productName}</h2>
          <p className="lead">
            Built for modern data centers, the Micron 7450 combines high throughput,
            predictable latency, and exceptional endurance for mission-critical applications.
          </p>
          <p aria-live="polite">{message}</p>
        </div>
      </section>

      <section className="specs">
        <div className="section-header">
          <p className="section-kicker">Technical details</p>
          <h3>Specifications</h3>
        </div>
        <div className="spec-grid">
          {(currentData.specs ?? []).map((spec) => (
            <div key={spec.label} className="spec-item">
              <span>{spec.label}</span>
              <strong>{spec.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="info-grid">
        <article className="info-panel">
          <p className="section-kicker">Why it matters</p>
          <h3>Purpose-built performance for data growth</h3>
          <ul className="check-list">
            {(currentData.highlights ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

export default McpRoot;
