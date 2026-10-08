import { productData } from './productData.js';

function App() {
  const product = productData;
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">M</div>
          <div>
            <p className="eyebrow">Micron</p>
            <h1>Product Details</h1>
          </div>
        </div>
        <nav className="nav">
          <a href="#overview">Overview</a>
          <a href="#specs">Specs</a>
          <a href="#highlights">Highlights</a>
          <a href="#support">Support</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="overview">
          <div className="hero-copy">
            <span className="pill">{product.category}</span>
            <h2>{product.productName}</h2>
            <p className="lead">
              Built for modern data centers, the Micron 7450 combines high throughput,
              predictable latency, and exceptional endurance for mission-critical applications.
            </p>

            <div className="price-row">
              <div>
                <span className="label">Starting at</span>
                <strong>{product.startingPrice}</strong>
              </div>
              <button className="primary-btn">Buy Now</button>
            </div>

            <ul className="quick-stats">
              <li>
                <span>7,000</span>
                <small>MB/s Read</small>
              </li>
              <li>
                <span>1.92 TB</span>
                <small>Capacity</small>
              </li>
              <li>
                <span>{product.warranty}</span>
                <small>Warranty</small>
              </li>
            </ul>
          </div>

          <div className="product-visual" aria-label="Micron SSD illustration">
            <div className="card-glow" />
            <div className="drive">
              <div className="drive-top" />
              <div className="drive-chip" />
            </div>
            <div className="floating-badge badge-one">PCIe 4.0</div>
            <div className="floating-badge badge-two">176L NAND</div>
          </div>
        </section>

        <section className="info-grid" id="highlights">
          <article className="info-panel">
            <p className="section-kicker">Why it matters</p>
            <h3>Purpose-built performance for data growth</h3>
            <ul className="check-list">
              {product.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="info-panel accent-panel">
            <p className="section-kicker">Best for</p>
            <h3>High-demand workloads</h3>
            <div className="stacked-tags">
              <span>AI inference</span>
              <span>Virtualization</span>
              <span>Databases</span>
              <span>Analytics</span>
              <span>Cloud native</span>
            </div>
          </article>
        </section>

        <section className="specs" id="specs">
          <div className="section-header">
            <p className="section-kicker">Technical details</p>
            <h3>Specifications</h3>
          </div>

          <div className="spec-grid">
            {product.specs.map((spec) => (
              <div key={spec.label} className="spec-item">
                <span>{spec.label}</span>
                <strong>{spec.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="feature-section" id="support">
          <div className="section-header">
            <p className="section-kicker">Designed for scale</p>
            <h3>Performance, endurance, and peace of mind</h3>
          </div>

          <div className="feature-grid">
            {product.features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-icon">✓</div>
                <h4>{feature.title}</h4>
                <p>{feature.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
