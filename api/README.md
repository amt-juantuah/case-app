# Case Management API (Backend)

This is the backend service for the Case Management Application.  
It provides a simple **case/task management API** that allows caseworkers to create, view, update, and delete tasks efficiently.  

Built with:
- **Node.js v23.11.0**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **Jest** for unit & integration testing


---

## 🚀 Features

- Create a new case (task) with title, description, status, priority, and due date.
- Retrieve a case by ID.
- Retrieve all cases.
- Update the status of a case.
- Update the priority of a case.
- Delete a case.
- Validation for UUIDs, status, and priority fields.
- Centralized error handling.
- Comprehensive unit and integration tests.

---

## 📂 Project Structure

```
api/
├── bin/
│   └── www               # Server entry point
├── app.js                # Main Express app
├── constants.js          # Status, priority values & messages
├── prisma/
│   ├── schema.prisma     # Prisma schema
│   └── migrations/       # Database migrations
├── models/
│   └── case.js           # Case model wrapper
├── services/
│   └── caseService.js    # Business logic for case operations
├── routes/               # Express routes for /cases
│   ├── createCaseRoute.js
│   ├── deleteCaseRoute.js
│   ├── retrieveCaseRoute.js
│   ├── updateCaseRoute.js      
├── middleware/
│   ├── errorHandler.js
│   ├── validateCaseExists.js
│   ├── validateUuidParam.js
│   ├── validateStatusAndPriority.js
└── tests/                # Jest test files
 
```
---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/amt-juantuah/case-app.git
cd case-app/api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA_NAME" #your postgresql database connection string
PORT=5000
NODE_ENV=development
API_KEY=<your_api_key>
DEMO_USERNAME=admin
DEMO_PASSWORD=admin123
DEMO_ROLE=demo
```
Note: You will need A PostgreSQL database server running and accessible
Note: Update your .env file with your PostgreSQL connection string

### 4. Create and Run migrations (Based on Prisma ORM)

```bash
npx prisma migrate dev --name init;
```

This creates the database tables based on the schema and it also applies first migrations.

```bash
npx prisma generate;
```

This generates the Prisma Client.

### 5. Start the server

For development (with nodemon):

```bash
npm run dev
```

For production:

```bash
npm start
```

Locally, Server might run on: **http://localhost:5000**

---

## 📡 API Endpoints

### 1. Create Case
`POST /cases`

**Request body:**
```json
{
  "title": "Fix hearing date issue",
  "description": "Update incorrect hearing date",
  "status": "OPEN",
  "priority": "HIGH",
  "dueDate": "2025-09-28T12:00:00.000Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fix hearing date issue",
    "description": "Update incorrect hearing date",
    "status": "OPEN",
    "priority": "HIGH",
    "dueDate": "2025-09-28T12:00:00.000Z"
  }
}
```

---

### 2. Get Case by ID
`GET /cases/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fix hearing date issue",
    "status": "OPEN",
    "priority": "HIGH"
  }
}
```

If not found → **404**
```json
{ "success": false, "message": "Case not found" }
```

---

### 3. Get All Cases
`GET /cases`

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": "uuid1", "title": "Case 1", "status": "OPEN" },
    { "id": "uuid2", "title": "Case 2", "status": "CLOSED" }
  ]
}
```

---

### 4. Update Case Status
`PATCH /cases/:id/status`

**Request body:**
```json
{ "status": "IN_PROGRESS" }
```

**Response (200):**
```json
{ "success": true, "message": "Case status updated" }
```

---

### 5. Update Case Priority
`PATCH /cases/:id/priority`

**Request body:**
```json
{ "priority": "LOW" }
```

**Response (200):**
```json
{ "success": true, "message": "Case priority updated" }
```

---

### 6. Delete Case
`DELETE /cases/:id`

**Response (200):**
```json
{ "success": true, "message": "Case deleted successfully" }
```

---

## 🧪 Testing

Run all tests:

```bash
npm test
```

- Includes **unit tests** (services, middleware)  
- Includes **integration tests** (routes, error handling)  
- Test coverage report is automatically generated.

---

## 📖 Notes

- Validation ensures **UUID format**, **valid status** (`OPEN`, `IN_PROGRESS`, `CLOSED`), and **valid priority** (`LOW`, `MEDIUM`, `HIGH`).  
- All errors are handled by a centralized `errorHandler` middleware.  
- Database is connected via **Prisma ORM**, making migrations & queries type-safe.  
