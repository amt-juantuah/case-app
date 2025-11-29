# Client (Nextjs Frontend)

This is the **Next client application** for the Case Management System.  
It provides a user interface for managing cases, including creating, editing, deleting, and updating case status and priority.

---

## 🚀 Features
- Case Dashboard with list view
- View case details
- Create new cases
- Edit/update existing cases
- Delete cases with confirmation
- Integrated modals for confirmation and updates
- Axios-based API integration
- Toast notifications (via `react-hot-toast`)
- Fully tested with Jest + React Testing Library

---

## 📦 Tech Stack
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/) 
- [Axios](https://axios-http.com/)
- [React Hot Toast](https://react-hot-toast.com/)
- [Jest](https://jestjs.io/) & [Testing Library](https://testing-library.com/)

---

## ⚙️ Setup

1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables
   Create a `.env.local` file in the root with:

   ```env.local
   NEXT_PUBLIC_API_BASE_URL=API_BASE_URL (Example: "http://localhost:5000")
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The client will run on:
   ```
   http://localhost:3000
   ```

---

## 🧪 Testing

Run unit tests with:
```bash
npm run test
```

---

## 📂 Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── app/            # Page components (Next.js)
│   ├── services/       # API service functions (axios)
│   ├── validation/     # Form validation schema
│   └── constants.js    # App-wide constants/messages
├── public/             # Static assets
├── package.json
├── _tests_/            # Test files
└── README.md

```

---

## 🔗 API Integration

The client communicates with the backend API service at:
```
http://localhost:{BACKEND_PORT}
```
---
