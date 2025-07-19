# TravMate - Travel Companion App 🚀

A modern travel companion built with React Native (Expo) featuring AI-powered recommendations, trip planning, and secure payments.

[![Demo Video](https://img.shields.io/badge/WATCH_DEMO-FF0000?style=for-the-badge&logo=youtube)](https://drive.google.com/file/d/16Q66eQ3ChEmyWf8tyHjaoibazD1UkdBs/view) 
[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## ✨ Features

- 🗺️ Interactive maps with `react-native-maps`
- 🤖 AI recommendations via Google Gemini
- 💳 Integrated Stripe payments
- 📅 Trip planning and itinerary management
- 📍 Location tracking with `expo-location`
- 🎨 Beautiful UI with NativeWind (Tailwind for RN)

---

## 🛠️ Tech Stack

| Category          | Technologies                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| **Core**          | React Native, Expo, TypeScript                                              |
| **Navigation**    | `expo-router`, `@react-navigation`                                         |
| **State**         | Zustand                                                                     |
| **Styling**       | NativeWind, `expo-linear-gradient`                                         |
| **APIs**          | Axios, React Query                                                         |
| **AI**            | `@google/generative-ai`                                                    |
| **Payments**      | `@stripe/stripe-react-native`                                              |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Yarn/npm/pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/travmate-app.git
cd travmate-app

# Install dependencies
npm install

# Start the development server
npx expo start
