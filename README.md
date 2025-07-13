# 📱 React Native Homework – User Profile App

This is my implementation of the React Native homework assignment.  
It demonstrates navigation, form handling, state management and UI best practices using Expo + TypeScript.

---

## 🚀 Live Preview (Expo Go)

You can try the app instantly on your phone using the **Expo Go** app.

1. Install Expo Go:
    - [iOS – App Store](https://apps.apple.com/app/expo-go/id982107779)
    - [Android – Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Open this link on your phone (or scan the QR code below):

🔗 [Launch App in Expo Go](https://expo.dev/preview/update?message=Initial+commit%0A%0AGenerated+by+create-expo-app+3.4.2.&updateRuntimeVersion=1.0.0&createdAt=2025-07-12T05%3A50%3A05.571Z&slug=exp&projectId=fd2503fb-f76a-41e7-abc6-bf56ca12b792&group=23533f0d-bbbb-405e-848e-a2dbf32e9e25)

![qr-code](assets/qr-code.svg)

---

## 🛠️ Setup Instructions

If you'd like to run the project locally:

1. Clone the repository:

```
git clone https://github.com/Norbi99/rn-homework.git
cd rn-homework
```

2. Install dependencies:

```
npm install
```
3. Start the Expo development server:
```
npx expo start
```

4. Open the app using the Expo Go mobile app (scan the new QR code that appears in terminal or browser).

---

## 🧱 Tech Stack

- **React Native (Expo)**
- **TypeScript**
- **Redux Toolkit** – global state management
- **React Hook Form + Yup** – form validation
- **React Navigation** – stack & bottom tab navigation
- **Toast Notifications** – via `react-native-toast-message`
- **Mocked API** – simulates network latency and failures
- **Custom Components** – Button, Switch, Card etc. for consistency and reusability

---

## 🧠 Architecture Decisions

- 📦 **Redux Toolkit** is used for predictable and scalable state handling.
- 🔀 **Navigation** is split across stack navigators and bottom tabs.
- ✅ **Profile editing** uses `react-hook-form` + `yup` for strong form logic.
- 🔁 **Mocked APIs** imitate realistic async behavior and failure rate.
- 🎨 **Component structure** keeps screens, logic, and UI elements modular and reusable.

---
## 🔎 Known Limitations

- 🚫 No backend integration or persistent storage (everything is local/mock)
- 🌓 Dark mode toggle is UI-only (no theme switching implemented)
- 🧮 Profile completion is currently hardcoded to 80%
- 🧪 No automated tests (would use Jest + React Native Testing Library)

---

## ⚠️ Submission Note

This submission is in a near-final state, sent early due to an upcoming vacation.

- All core features are implemented and working (navigation, validation, toast feedback, Redux, API simulation).
- However, some minor UI/UX refinements and edge case handling are still planned (e.g. success animations, dynamic profile completion, etc.).

If you'd prefer a fully polished final version, I’d be happy to complete and submit it by **2025.07.25.** as previously discussed.

Thank you for reviewing!









