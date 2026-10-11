# ⛽ TouchGasPedal

> **Touch Grass by touching the gas pedal.**  
> An open-source driving route curator powered by Google's open-weight **Gemma** model, built for the **Hacktoberfest 2026 "Touch Grass" DEV Challenge**.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2026-orange.svg)](https://hacktoberfest.com)
[![Gemma AI](https://img.shields.io/badge/Powered%20By-Gemma%20Open--Weight-blue.svg)](https://ai.google.dev/gemma)

---

## 🌿 Why "TouchGasPedal"? (The Touch Grass Philosophy)

Most AI apps keep you glued to your phone screen: chatting back and forth, generating infinite feeds, or optimizing digital workflows.

**TouchGasPedal does the opposite.**

- **Time on screen:** Under 60 seconds (pick your mood, pick duration, get route).
- **Time in the real world:** 1 to 3+ hours outside exploring scenic overlooks, quiet country roads, local tea shacks, and mountain curves.
- Once your route is generated, tap **Start Navigation**, mount your phone on the dashboard, roll the windows down, and go.

---

## ✨ Features

- 🎭 **Mood-Based Curation:** Choose from *Peaceful*, *Scenic*, *City Cruise*, *Adventure*, *Night Drive*, or *Foodie Run*.
- ⏱️ **Flexible Time Windows:** From quick 30-minute stress-busters to full 3+ hour weekend road trips.
- 🎯 **Real-World Micro-Challenges:** Fun real-world scavenger items at stops (e.g., *"Find the highest bench and sit for 5 minutes without touching your phone"*).
- 📍 **One-Tap Google Maps Launch:** Immediately translates the AI-generated waypoints into an active navigation session.
- 🧠 **Powered by Gemma:** Leverages Google's lightweight, open-weight models (`gemma-3-27b-it` / `gemma-2-9b-it`) for local & privacy-first reasoning.

---

## 🛠️ Tech Stack & Open Innovation

- **AI Model:** Google Gemma via `@google/generative-ai`
- **Backend:** Node.js, Express.js
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (Zero bloat, instant load)
- **Geocoding:** OpenStreetMap / Nominatim (Open data ecosystem)

---

## 🚀 Quickstart

### 1. Clone & Install

```bash
git clone https://github.com/your-username/touchgaspedal.git
cd touchgaspedal
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and provide your Google AI Studio API key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=your_google_ai_studio_api_key
PORT=3000
```

### 3. Run the App

```bash
npm start
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
