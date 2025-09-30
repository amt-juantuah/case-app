# Case Management System

A full-stack case management system with:
- **Backend API (Express + Axios)** for case data handling
- **Frontend Client (React/Next.js)** for user interaction
- **Testing with Jest & React Testing Library**

---

## 🚀 Features
- Manage cases (CRUD operations)
- Update case status & priority
- Delete cases with confirmation
- Toast notifications for success/error
- Tested frontend & backend
- Modular architecture (client + api separated)

---

## 📂 Project Structure

```
project-root/
├── api/           # NODE Backend API service
│   ├── src/       
│   └── README.md
├── client/        # Next.js client app
│   ├── src/
│   └── README.md
└── README.md      # This file (root README)
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/amt-juantuah/case-app.git
cd case-app
```

### 2. Install dependencies

#### API (Backend)
```bash
cd api
npm install
npm run dev   # starts backend on http://localhost:5000
```

#### Client (Frontend)
```bash
cd client
npm install
npm start     # or npm run dev (Next.js)
```

The client will run on:
```
http://localhost:3000
```

---

## 🧪 Testing

### API Tests
```bash
cd api
npm test
```

### Client Tests
```bash
cd client
npm test
```

---

## 🔗 Endpoints

- **Get all cases** → `GET /cases`
- **Get case by ID** → `GET /cases/:id`
- **Create case** → `POST /cases`
- **Update case status** → `PATCH /cases/:id/status`
- **Update case priority** → `PATCH /cases/:id/priority`
- **Delete case** → `DELETE /cases/:id`

---

## 👨‍💻 Development Notes
- The **client** uses the **API service (`api.js`)** to make requests to the backend.
- All API calls are wrapped with error handling + toast notifications.
- For tests, API calls are mocked to avoid hitting the real database.
