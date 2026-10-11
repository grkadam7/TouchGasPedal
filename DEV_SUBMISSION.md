# TouchGasPedal ⛽: Touch Grass by Touching the Gas Pedal

*This is a submission for the [Hacktoberfest Open-Source AI Challenge: Week 1 — Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05).*

---

## 🌿 What I Built

Most modern AI applications share an unspoken goal: **maximize screen time.** Whether it’s endless back-and-forth chat prompts, AI image galleries, or automated feed generators, the user remains tethered to a digital screen.

**TouchGasPedal** inverts that paradigm.

**TouchGasPedal** is an open-source, AI-powered driving route discovery web application built with Google's open-weight **Gemma** model. It helps you disconnect from digital feeds by planning unforgettable, real-world scenic and peaceful drives:

1. **Pick your vibe:** *Peaceful & Relaxing*, *Scenic & Beautiful*, *City Cruise*, *Adventure & Thrilling*, *Night Drive*, or *Foodie Run*.
2. **Set your time window:** *30 min*, *1 hour*, *2 hours*, or *3+ hours*.
3. **Set your starting point:** Type any neighborhood or click the auto-locate button.
4. **Get your curated adventure:** Gemma generates a custom route with curated natural/scenic overlooks, roadside stops, time-of-day recommendations, a music vibe, and **real-world micro-challenges** (e.g., *"Find the highest viewpoint bench and sit for 5 minutes without touching your phone"*).
5. **One-tap Google Maps handoff:** Tap **Start Navigation**, mount your phone on the dashboard, roll the windows down, and drive.

**Screen time:** < 60 seconds.  
**Real-world exploration:** 1 to 3+ hours.

---

## 🚀 Live Demo & Repository

- **GitHub Repository:** [https://github.com/grkadam7/TouchGasPedal](https://github.com/grkadam7/TouchGasPedal) *(Permissive MIT License)*
- **Live Demo / Walkthrough:** [https://touchgaspedal.onrender.com](https://touchgaspedal.onrender.com) *(or your deployed URL / video link)*

---

## 🧠 Why Open Innovation Matters (Why Gemma?)

For an application that actively encourages people to unplug and venture into the physical world, relying on closed, proprietary cloud black-boxes presents critical limitations:

1. **Local & Trail-Ready Inferences:** Drivers frequently venture into rural valleys, national parks, and mountain passes where cellular data drops to zero. Open-weight models like **Gemma** can be executed on-device or on local edge hardware inside vehicles without an active internet connection.
2. **Zero Surveillance & Geolocation Privacy:** Your driving habits, physical whereabouts, and spontaneous routes should remain your own. Open-weight AI ensures users don't have to surrender personal telemetry and location footprints to proprietary advertising trackers.
3. **Community-Curated Route Knowledge:** Because Gemma is open-weight, local driving clubs, off-road communities, and biking groups can fine-tune custom LoRA adapters on local trail knowledge without permission or platform lock-in.

---

## 🛠️ Architecture & Technical Execution

```
                     ┌─────────────────────────────┐
                     │   Browser (Minimal UI)      │
                     │  Vibe • Duration • Geolocation
                     └──────────────┬──────────────┘
                                    │ POST /api/suggest-drive
                                    ▼
                     ┌─────────────────────────────┐
                     │     Node / Express API      │
                     └──────────────┬──────────────┘
                                    │
             ┌──────────────────────┴──────────────────────┐
             │                                             │
             ▼                                             ▼
┌───────────────────────────┐                ┌───────────────────────────┐
│ Gemma 4 Open-Weight Model │                │ Google Maps Hand-Off API  │
│ (Route & Stop Reasoning)  │                │ (Turn-by-turn Navigation) │
└───────────────────────────┘                └───────────────────────────┘
```

- **Frontend:** Vanilla HTML5, CSS3 (Nature-inspired dark theme), and vanilla JavaScript for ultra-lightweight, instantaneous mobile performance.
- **Backend:** Node.js + Express.js API.
- **Model Orchestration:** Google Gemma open-weight models (`gemma-4-26b-a4b-it` / `gemma-4-31b-it`) via `@google/generative-ai` with robust fallback to `gemini-2.5-flash`.
- **Geocoding:** OpenStreetMap / Nominatim API (fully aligned with the open-data ecosystem).
- **Navigation Handoff:** Universal Google Maps Intent URLs.

---

## 📸 Screenshots & Experience

*(Add 1-2 screenshots of the mood selector and the generated route card here!)*

> *"The Green Canopy Escape — A lush, refreshing drive toward the outskirts. Stop at Turahalli Forest Viewpoint. Micro-challenge: Find and photograph three different shades of green in the foliage."*

---

## 🎯 Partner & Featured Track Entries

This project is submitted to two prize tracks:

1. **Best Use of Gemma ($200):** Leverages Google's lightweight, open-weight models for fast local/offline-ready driving route synthesis and real-world exploration challenges.
2. **Best Use of Render ($200):** Includes an infrastructure-as-code `render.yaml` blueprint enabling 1-click cloud deployments on Render's free web service tier.

---

## 🏁 Conclusion

"Touch Grass" doesn't have to mean sitting idle on your lawn — sometimes the best way to clear your head and reconnect with the physical world is to turn the ignition, play some lo-fi beats, and follow a winding road.

Mount your phone, roll down the windows, and **TouchGasPedal**. ⛽🚗💨
