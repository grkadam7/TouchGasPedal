// State
let selectedMood = null;
let selectedDuration = null;
let userLocation = '';

// DOM Elements
const moodCards = document.querySelectorAll('.mood-card');
const durationBtns = document.querySelectorAll('.duration-btn');
const locationInput = document.getElementById('location-input');
const geoBtn = document.getElementById('geo-btn');
const findDriveBtn = document.getElementById('find-drive-btn');

const stepDuration = document.getElementById('step-duration');
const stepLocation = document.getElementById('step-location');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const routeCard = document.getElementById('route-card');
const errorSection = document.getElementById('error-section');
const errorText = document.getElementById('error-text');
const retryBtn = document.getElementById('retry-btn');

// Mood Selection
moodCards.forEach(card => {
  card.addEventListener('click', () => {
    moodCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMood = card.dataset.mood;

    stepDuration.classList.remove('hidden');
    stepDuration.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    checkFormReady();
  });
});

// Duration Selection
durationBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    durationBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedDuration = btn.dataset.duration;

    stepLocation.classList.remove('hidden');
    stepLocation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    checkFormReady();
  });
});

// Location Input
locationInput.addEventListener('input', (e) => {
  userLocation = e.target.value.trim();
  checkFormReady();
});

// Geolocation
geoBtn.addEventListener('click', async () => {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser');
    return;
  }

  geoBtn.disabled = true;
  geoBtn.style.opacity = '0.5';

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      try {
        // Reverse geocoding via OpenStreetMap Nominatim
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.suburb || data.address.county || 'My Location';
        locationInput.value = city;
        userLocation = city;
        checkFormReady();
      } catch (err) {
        locationInput.value = `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
        userLocation = locationInput.value;
        checkFormReady();
      } finally {
        geoBtn.disabled = false;
        geoBtn.style.opacity = '1';
      }
    },
    (err) => {
      alert('Unable to retrieve location. Please type your city/area.');
      geoBtn.disabled = false;
      geoBtn.style.opacity = '1';
    }
  );
});

function checkFormReady() {
  if (selectedMood && selectedDuration && userLocation.length > 1) {
    findDriveBtn.removeAttribute('disabled');
  } else {
    findDriveBtn.setAttribute('disabled', 'true');
  }
}

// Generate Route Call
findDriveBtn.addEventListener('click', generateDrive);
retryBtn.addEventListener('click', () => {
  errorSection.classList.add('hidden');
  generateDrive();
});

async function generateDrive() {
  // Hide result & errors, show loader
  resultsSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');
  loadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

  try {
    const res = await fetch('/api/suggest-drive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: selectedMood,
        duration: selectedDuration,
        location: userLocation
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to curate drive');
    }

    renderRoute(data.route);
  } catch (err) {
    loadingSection.classList.add('hidden');
    errorText.innerText = err.message || 'Something went sideways. Try again!';
    errorSection.classList.remove('hidden');
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderRoute(route) {
  loadingSection.classList.add('hidden');

  // Build Google Maps search link
  const stopsQuery = (route.stops || []).map(s => s.name).join(' to ');
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userLocation)}&destination=${encodeURIComponent(route.route?.endPoint || userLocation)}&travelmode=driving`;

  const badgesHtml = (route.vibes || []).map(v => `<span class="badge mood-badge">${v}</span>`).join('');

  const stopsHtml = (route.stops || []).map((stop, i) => `
    <div class="stop-card">
      <div class="stop-num">${stop.order || i + 1}</div>
      <div class="stop-content">
        <h4>${stop.name}</h4>
        <div class="stop-meta">⏱️ ${stop.duration || '15 min'} • 🏷️ ${stop.type || 'Stop'}</div>
        <p class="stop-desc">${stop.description || ''}</p>
        ${stop.tip ? `<div class="stop-tip">💡 Tip: ${stop.tip}</div>` : ''}
      </div>
    </div>
  `).join('');

  const challengesHtml = (route.miniChallenges || []).map(c => `
    <div class="challenge-card">
      <div class="challenge-header">
        <span class="challenge-title">${c.emoji || '🎯'} ${c.title}</span>
        <span class="challenge-pts">+${c.points || 10} pts</span>
      </div>
      <p class="challenge-desc">${c.description}</p>
    </div>
  `).join('');

  routeCard.innerHTML = `
    <div class="route-header">
      <div class="route-badges">
        ${badgesHtml}
        <span class="badge">🕒 ${route.estimatedDuration || selectedDuration}</span>
        <span class="badge">📍 ${route.estimatedDistance || 'Scenic'}</span>
      </div>
      <h2 class="route-title">${route.routeName}</h2>
      <p class="route-tagline">${route.tagline || ''}</p>
      <p class="route-desc">${route.description}</p>
    </div>

    <div class="route-stats">
      <div class="stat-item">
        <span class="stat-label">Best Time</span>
        <span class="stat-val">${route.bestTimeOfDay || 'Anytime'}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Difficulty</span>
        <span class="stat-val">${route.difficulty || 'Easy'}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Music Vibe</span>
        <span class="stat-val">${route.playlistMood || 'Lo-fi Beats'}</span>
      </div>
    </div>

    <h3 class="section-subtitle">🛣️ Curated Stops & Overlooks</h3>
    <div class="stops-timeline">
      ${stopsHtml}
    </div>

    ${challengesHtml ? `
      <h3 class="section-subtitle">🏆 Real-World Micro Challenges (Get out & Explore!)</h3>
      <div class="challenges-grid">
        ${challengesHtml}
      </div>
    ` : ''}

    ${route.funFact ? `
      <div class="stop-tip" style="display:block; margin-bottom: 1.5rem; font-size: 0.88rem;">
        ✨ <strong>Did you know?</strong> ${route.funFact}
      </div>
    ` : ''}

    ${route.safetyTip ? `
      <p style="font-size: 0.78rem; color: #8b949e; margin-bottom: 1rem;">
        🛡️ <em>Safety note: ${route.safetyTip}</em>
      </p>
    ` : ''}

    <div class="route-actions">
      <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">
        🚀 Start Navigation in Google Maps
      </a>
      <button class="btn-secondary" onclick="window.print()">
        🖨️ Save / Print Route
      </button>
      <button class="btn-secondary" onclick="generateDrive()">
        🔄 Roll Another Route
      </button>
    </div>
  `;

  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
