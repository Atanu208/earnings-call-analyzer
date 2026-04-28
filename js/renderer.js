function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCompanyProfile(company) {
  const ticker = company.ticker || 'CONCALL';

  document.getElementById('tickerBadge').textContent    = ticker;
  document.getElementById('headerCompany').textContent  = company.name || 'Earnings Call Analyzer';
  document.getElementById('topbarCompany').textContent  =
    `${(company.name || 'COMPANY').toUpperCase()} · ${ticker} · CONCALL INTELLIGENCE REPORT`;

  document.getElementById('companyProfile').innerHTML = `
    <div class="meta-row"><span class="meta-key">COMPANY</span><span class="meta-val">${escHtml(company.name || '—')}</span></div>
    <div class="meta-row"><span class="meta-key">TICKER</span><span class="meta-val">${escHtml(ticker)}</span></div>
    <div class="meta-row"><span class="meta-key">SECTOR</span><span class="meta-val">${escHtml(company.sector || '—')}</span></div>
    <div class="meta-row"><span class="meta-key">PERIOD</span><span class="meta-val">${escHtml(company.quarter || '—')}</span></div>
    <div class="meta-row"><span class="meta-key">AI MODEL</span><span class="meta-val">LLaMA 3.3 70B</span></div>
    <div class="meta-row"><span class="meta-key">COST</span><span class="meta-val positive">Free</span></div>
  `;
}

function renderResults(data) {
  if (data.company) renderCompanyProfile(data.company);

  const impactBadge    = v => `badge-${v === 'HIGH' ? 'high' : 'medium'}`;
  const severityBadge  = v => `badge-${v === 'CRITICAL' ? 'critical' : v === 'HIGH' ? 'high' : 'medium'}`;

  document.getElementById('resultsContainer').innerHTML = `
    <div class="result-section" style="animation-delay:0s">
      <div class="result-header" style="background:#fafbfc;">
        <span class="result-icon">🔲</span>
        <div>
          <div class="result-title" style="color:var(--ink)">SWOT Analysis</div>
          <div class="result-sub" style="color:var(--ink-4)">Strengths · Weaknesses · Opportunities · Threats</div>
        </div>
      </div>
      <div class="result-body">
        <div class="swot-grid">
          <div class="swot-q S">
            <div class="swot-qlabel">◈ Strengths</div>
            <ul class="swot-list">${data.swot.strengths.map(s =>
              `<li><span class="swot-dot" style="color:var(--strength)">✓</span>${escHtml(s)}</li>`).join('')}
            </ul>
          </div>
          <div class="swot-q W">
            <div class="swot-qlabel">△ Weaknesses</div>
            <ul class="swot-list">${data.swot.weaknesses.map(s =>
              `<li><span class="swot-dot" style="color:var(--weakness)">▲</span>${escHtml(s)}</li>`).join('')}
            </ul>
          </div>
          <div class="swot-q O">
            <div class="swot-qlabel">◉ Opportunities</div>
            <ul class="swot-list">${data.swot.opportunities.map(s =>
              `<li><span class="swot-dot" style="color:var(--opportunity)">→</span>${escHtml(s)}</li>`).join('')}
            </ul>
          </div>
          <div class="swot-q T">
            <div class="swot-qlabel">⚠ Threats</div>
            <ul class="swot-list">${data.swot.threats.map(s =>
              `<li><span class="swot-dot" style="color:var(--threat)">!</span>${escHtml(s)}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="result-section" style="animation-delay:0.08s">
      <div class="result-header" style="background:var(--moat-bg);">
        <span class="result-icon">🏰</span>
        <div>
          <div class="result-title" style="color:var(--moat)">Competitive MOAT</div>
          <div class="result-sub" style="color:var(--moat);opacity:0.6">Sustainable competitive advantages</div>
        </div>
      </div>
      <div class="result-body">
        ${data.moat.map(m => `
          <div class="moat-item">
            <div class="moat-item-title">🔒 ${escHtml(m.title)}</div>
            <div class="moat-item-desc">${escHtml(m.description)}</div>
          </div>`).join('')}
      </div>
    </div>

    <div class="result-section" style="animation-delay:0.16s">
      <div class="result-header" style="background:var(--tailwind-bg);">
        <span class="result-icon">🌬️</span>
        <div>
          <div class="result-title" style="color:var(--tailwind)">Market Tailwinds</div>
          <div class="result-sub" style="color:var(--tailwind);opacity:0.65">External factors accelerating growth</div>
        </div>
      </div>
      <div class="result-body-flush">
        <ul class="factor-list">
          ${data.tailwinds.map(t => `
            <li class="factor-item">
              <span class="factor-arrow" style="color:var(--tailwind)">↑</span>
              <div class="factor-body">
                <div class="factor-heading">${escHtml(t.heading)}</div>
                <div class="factor-desc">${escHtml(t.description)}</div>
                <span class="badge ${impactBadge(t.impact)}">${escHtml(t.impact)} IMPACT</span>
              </div>
            </li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="result-section" style="animation-delay:0.24s">
      <div class="result-header" style="background:var(--headwind-bg);">
        <span class="result-icon">⚡</span>
        <div>
          <div class="result-title" style="color:var(--headwind)">Business Headwinds</div>
          <div class="result-sub" style="color:var(--headwind);opacity:0.65">Challenges and risks from the concall</div>
        </div>
      </div>
      <div class="result-body-flush">
        <ul class="factor-list">
          ${data.headwinds.map(h => `
            <li class="factor-item">
              <span class="factor-arrow" style="color:var(--headwind)">↓</span>
              <div class="factor-body">
                <div class="factor-heading">${escHtml(h.heading)}</div>
                <div class="factor-desc">${escHtml(h.description)}</div>
                <span class="badge ${severityBadge(h.severity)}">${escHtml(h.severity)} SEVERITY</span>
              </div>
            </li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  document.getElementById('verdictText').textContent = data.verdict     || '—';
  document.getElementById('verdictNote').textContent = data.verdictNote || '—';
  document.getElementById('verdictCard').style.display = 'block';
}

function showError(message, hint) {
  const el = document.getElementById('errorState');
  document.getElementById('errorMsg').textContent  = message;
  document.getElementById('errorHint').textContent = hint || '';
  el.style.display = 'flex';
}

function hideError() {
  document.getElementById('errorState').style.display = 'none';
}
