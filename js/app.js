const SAMPLE_TRANSCRIPT = `OLA Electric Mobility Ltd — Q3 FY25 Earnings Conference Call
Date: February 2025

Management: Bhavish Aggarwal (CEO), Harish Abichandani (CFO)

CEO Opening Remarks:
Q3 was a significant quarter for OLA Electric. We registered revenue of approximately ₹1,243 crore, a YoY growth of 22%. We sold 112,000 scooters in the quarter, crossing 1 million cumulative deliveries since inception. Our flagship S1 Pro continues to dominate the premium segment with over 31% market share in the e-2W above ₹1 lakh segment.

We have expanded our service network to 800+ partner service centers across India. We acknowledge customer complaints around service quality and response time, and we have taken concrete steps — added 1,200 trained technicians, launched the OLA Care subscription for priority service, and improved our app-based service tracking.

Our Futurefactory in Tamil Nadu achieved 90% capacity utilization in December 2024. We are investing ₹800 crore in Phase 2 expansion to reach 1 million units/year capacity by end of FY26. This vertically integrated Gigafactory gives us significant cost advantages.

On FAME III subsidy: We are actively engaged with the government. The EV transition in India is inevitable — two-wheelers account for 70% of vehicle sales, and EV penetration is still only 5-6%. We believe this will reach 30%+ by FY30.

We launched OLA S1 X+ at ₹79,999 targeting mass-market segments. We expect this to drive significant volume growth in tier-2 and tier-3 cities.

CFO Remarks:
Gross margin improved to 11.2% from 8.4% last year, driven by better localization (85% domestic content now), mix shift, and operating leverage. EBITDA loss narrowed to ₹195 crore from ₹310 crore. We remain on track to achieve EBITDA breakeven by Q2 FY26.

Cash and cash equivalents: ₹2,400 crore. No near-term equity dilution planned.

On R&D: We filed 180 patents this quarter. Our proprietary BMS (Battery Management System) and in-house motor technology give us a 15-18% cost advantage vs. buying components.

Key Challenges: Used vehicle market and resale value concern among customers. Charging infrastructure still sparse in many cities. Competition from Bajaj Chetak, TVS iQube, and Ather Energy intensifying.

OLA is also entering the electric motorcycle segment — launching 4 models (Roadster, Roadster X, Roadster Air, Cruiser) by Q2 FY26. Total addressable market of motorcycles is 3x the scooter market.

Analyst Q&A Highlights:
- Q: What's the path to profitability? A: We expect EBITDA breakeven by Q2 FY26, PAT profitability by FY27.
- Q: How do you view competition? A: We have a vertically integrated supply chain, in-house technology, and a direct-to-customer model that no competitor can replicate easily.
- Q: Service quality improvement? A: Net Promoter Score improved from 28 to 54 over last 3 quarters. Customer satisfaction improving measurably.
- Q: Battery costs? A: We are targeting 20% battery cost reduction through cell localization by FY26 end.`;

const App = (() => {
  let stepInterval = null;

  function init() {
    document.getElementById('genDate').textContent = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  function prefillSample() {
    const ta = document.getElementById('transcriptInput');
    ta.value = SAMPLE_TRANSCRIPT;
    ta.style.minHeight = '260px';
  }

  async function runAnalysis() {
    const transcript = document.getElementById('transcriptInput').value.trim();

    if (!transcript) {
      alert('Please paste a transcript or load the sample data first.');
      return;
    }

    const btn = document.getElementById('analyzeBtn');
    btn.disabled = true;
    btn.textContent = '⟳ Analyzing...';

    hideError();
    document.getElementById('emptyResults').style.display = 'none';
    document.getElementById('resultsContainer').innerHTML = '';
    document.getElementById('loadingState').classList.add('active');
    document.getElementById('verdictCard').style.display = 'none';

    let si = 0;
    stepInterval = setInterval(() => {
      if (si < CONFIG.LOADING_STEPS.length) {
        document.getElementById('loadingStep').textContent = CONFIG.LOADING_STEPS[si++];
      }
    }, 800);

    try {
      const analysis = await callAnalyzeAPI(transcript);
      clearInterval(stepInterval);
      document.getElementById('loadingState').classList.remove('active');
      renderResults(analysis);
    } catch (err) {
      clearInterval(stepInterval);
      document.getElementById('loadingState').classList.remove('active');
      document.getElementById('emptyResults').style.display = 'block';
      showError(err.message, 'Check that the server is running and your .env file has a valid GROQ_API_KEY.');
    }

    btn.disabled = false;
    btn.innerHTML = '▶ Re-Analyze';
  }

  return { init, prefillSample, runAnalysis };
})();

document.addEventListener('DOMContentLoaded', App.init);
