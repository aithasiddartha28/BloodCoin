# 🩸 BloodCoin — Smart Blood Donation & Reward Platform

A full-stack serverless web app that rewards blood donors with coins redeemable for real medical discounts.

## 🌐 Live App
👉  https://lnkd.in/gJr9rmfx

## ✨ Features
-  Emergency Donor Finder with real-time interactive map
-  AI certificate verification using Anthropic Claude API
-  Earn 500 BloodCoins per verified donation
-  Redeem coins for hospital, lab & pharmacy discounts
-  Mobile-friendly with bottom tab navigation
-  OTP-based password reset via EmailJS

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Database | Firebase Firestore (NoSQL) |
| Auth | Firebase Authentication |
| AI | Anthropic Claude API |
| Maps | Leaflet.js + OpenStreetMap |
| Email OTP | EmailJS |
| Hosting | Netlify |

## 📁 Project Structure
```
bloodcoin/
  ├── index.html                         ← Complete app (HTML + CSS + JS)
  ├── netlify.toml                       ← Netlify configuration
  └── netlify/functions/
        └── verify-certificate.js       ← Claude AI proxy function
```

## 🚀 How to Deploy
1. Clone this repo
2. Add your Firebase config inside `index.html`
3. Add `ANTHROPIC_API_KEY` in Netlify environment variables
4. Drag the folder to Netlify Drop — live in 30 seconds!

## 👨‍💻 Developer
**Aitha Siddartha** — Computer Science Student, SR University
