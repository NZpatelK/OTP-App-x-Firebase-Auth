# 🔐 Secure Authentication with Firebase + Next.js (TSX)

This project is a personal learning journey into implementing **secure authentication** using **Firebase Authentication** with **Next.js** (TypeScript/TSX).

## 🚀 Features

- 📱 **Phone Number Login** with SMS verification (OTP)
- 📧 **Email Login** using Passwordless authentication (magic link)
- 💡 Full **UI/UX implementation** with smooth transitions and feedback
- ❌ Clear **error messages** for invalid OTPs, expired links, etc.
- ⏳ Smart **loading indicators** to improve user experience
- 🔒 Focus on **security best practices** to prevent credential leaks
- ✅ Built with **Next.js App Router** and **TypeScript**

## 🛠️ Tech Stack

- [Next.js (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 🎯 Goals

- Learn how to integrate Firebase Auth with modern frontend frameworks
- Handle **phone-based and passwordless email authentication**
- Build a smooth, user-friendly UI with **realtime feedback**
- Keep authentication logic **secure** and **modular**
- Avoid exposing Firebase secrets or leaking user credentials

## 🧠 What I’ve Learned So Far

- Setting up Firebase Auth for SMS and email-based login
- Handling OTP verification and magic link flows
- Managing component-level and global state (loading, errors)
- Using `.env.local` to hide Firebase config
- Improving user trust through thoughtful UI/UX patterns

## 🔐 Security Notes

- Firebase config is stored in `.env.local` and never committed
- Sensitive credentials and tokens are not exposed in the browser
- Authentication status and ID tokens handled securely
- Future-proofing for backend token validation (optional server-side)

## 📸 Demo (Coming soon...)

## 📜 License

MIT — Free to use, learn from, and contribute to.

---

> 💬 Feel free to open an issue or PR if you'd like to share improvements or suggestions!
