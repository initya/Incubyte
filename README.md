# Sweet Shop Management System — TDD Kata

A full-stack sweet store management system built using Test-Driven Development (TDD), featuring authentication, admin controls, inventory tracking, and a modern SPA frontend.

## 🚀 Tech Stack

### Backend
- **Node.js + TypeScript**
- **NestJS** (built-in testing, clean architecture, fast CRUD)
- **PostgreSQL** (Production-ready DB)
- **Prisma** (easiest DB modelling + migrations)
- **JWT Authentication** (Passport.js)
- **Jest + Supertest** (TDD)

### Frontend
- **React + Vite**
- **React Query** (API calls)
- **Tailwind CSS** (quick styling)

### Testing
- **Backend**: Jest + Supertest
- **Frontend** (optional): Vitest + React Testing Library

## 📦 Features

### Users
- ✅ Register / Login
- ✅ Browse sweets
- ✅ Search sweets
- ✅ Purchase sweets

### Admin
- ✅ Add sweets
- ✅ Update sweets
- ✅ Delete sweets
- ✅ Restock inventory

## 🧪 Tests

Run all backend tests:
```bash
cd backend
npm run test
```

Test report available inside:
`/test-report`

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sweet_shop?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"
PORT=3000
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start the development server:
```bash
npm run start:dev
```

The backend will be running on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## 📁 Project Architecture

### Backend Structure
```
backend/
 ├─ src/
 │   ├─ auth/
 │   │   ├─ auth.controller.ts
 │   │   ├─ auth.service.ts
 │   │   ├─ auth.module.ts
 │   │   ├─ dto/
 │   │   ├─ guards/
 │   │   ├─ strategies/
 │   │   └─ tests/
 │   │       ├─ auth.controller.spec.ts
 │   │       └─ auth.service.spec.ts
 │   ├─ sweets/
 │   │   ├─ sweets.controller.ts
 │   │   ├─ sweets.service.ts
 │   │   ├─ sweets.module.ts
 │   │   ├─ dto/
 │   │   └─ tests/
 │   │       ├─ sweets.controller.spec.ts
 │   │       └─ sweets.service.spec.ts
 │   ├─ inventory/
 │   │   ├─ inventory.controller.ts
 │   │   ├─ inventory.service.ts
 │   │   ├─ inventory.module.ts
 │   │   ├─ dto/
 │   │   └─ tests/
 │   │       ├─ inventory.controller.spec.ts
 │   │       └─ inventory.service.spec.ts
 │   ├─ prisma/
 │   │   ├─ schema.prisma
 │   │   ├─ prisma.service.ts
 │   │   └─ prisma.module.ts
 │   ├─ app.module.ts
 │   └─ main.ts
 ├─ prisma/
 │   └─ schema.prisma
 ├─ test-report/
 └─ package.json
```

### Frontend Structure
```
frontend/
 ├─ src/
 │   ├─ pages/
 │   │   ├─ Login.jsx
 │   │   ├─ Register.jsx
 │   │   ├─ Dashboard.jsx
 │   │   └─ AdminPanel.jsx
 │   ├─ components/
 │   │   ├─ SweetCard.jsx
 │   │   └─ Navbar.jsx
 │   ├─ api/
 │   │   ├─ auth.js
 │   │   ├─ sweets.js
 │   │   └─ client.js
 │   ├─ context/
 │   │   └─ AuthContext.jsx
 │   ├─ App.jsx
 │   ├─ main.jsx
 │   └─ index.css
 ├─ public/
 └─ package.json
```

## 🗄️ Database Schema

```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
  role     String @default("user") // admin or user
}

model Sweet {
  id        Int     @id @default(autoincrement())
  name      String
  category  String
  price     Float
  quantity  Int
}
```

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### Sweets (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sweets` | Add a sweet (Admin) |
| GET | `/api/sweets` | Get all sweets |
| GET | `/api/sweets/search?q=query` | Search sweets |
| GET | `/api/sweets/:id` | Get sweet by ID |
| PATCH | `/api/sweets/:id` | Update sweet |
| DELETE | `/api/sweets/:id` | Delete sweet (Admin) |

### Inventory (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sweets/:id/purchase` | Decrease quantity |
| POST | `/api/sweets/:id/restock` | Increase quantity (Admin) |

## 🧪 TDD Approach

This project follows Test-Driven Development (TDD) principles:

1. **RED** → Write failing test
2. **GREEN** → Implement minimal code to pass
3. **REFACTOR** → Clean code, improve validation, add DTOs, error handling

### Example TDD Flow

For `POST /api/auth/register`:

```typescript
// 1. RED - Write failing test
it("should register a user", async () => {
  const res = await request(app.getHttpServer())
    .post("/api/auth/register")
    .send({
      name: "Nityanand",
      email: "test@test.com",
      password: "123456"
    });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("token");
});

// 2. GREEN - Implement minimal code
// Controller → Service → Prisma

// 3. REFACTOR - Add validation, DTOs, error handling
```

## 🎨 Frontend Features

- ✅ **Login + Register Pages** - Beautiful gradient UI
- ✅ **Dashboard** - Grid layout showing all sweets
- ✅ **Search Bar** - Real-time filtering by name or category
- ✅ **Purchase Button** - Disabled when quantity = 0
- ✅ **Admin Panel** - Full CRUD operations with table view
  - Add sweet
  - Update sweet
  - Delete sweet
  - Restock inventory

## 📝 Commit Strategy With AI Co-author

When AI tools are used to assist with development, include co-author attribution:

```
feat: implement user registration endpoint

Wrote initial TDD failing test + controller boilerplate using ChatGPT.
Added JWT generation logic manually.

Co-authored-by: ChatGPT <chatgpt@users.noreply.github.com>
```

### When to add co-author?
- ✅ When AI writes a test
- ✅ When AI writes boilerplate
- ✅ When you ask AI for debugging
- ✅ When scaffolding modules
- ❌ Not required for small fixes like renaming variables

## 🤖 My AI Usage

I used AI tools to support development in the following ways:

### Tools Used
- **ChatGPT**
- **GitHub Copilot**
- **Google Gemini**

### How I Used Them
- **Copilot**: Autocompleted repetitive controller/service boilerplate
- **ChatGPT**:
  - Designed API architecture
  - Generated sample Jest test cases (TDD)
  - Helped with Prisma schema modelling
- **Gemini**:
  - Helped refine frontend UI structure
  - Suggested improvements for search filters

### My Reflection
AI significantly improved my speed and helped maintain TDD discipline by generating structured failing tests. However, I manually validated all logic, refactored architecture, and wrote business rules myself to ensure originality. Every commit where AI assisted includes the required co-author line.

## 🚦 Running the Application

1. **Start PostgreSQL** (make sure it's running)

2. **Start Backend**:
```bash
cd backend
npm run start:dev
```

3. **Start Frontend** (in a new terminal):
```bash
cd frontend
npm run dev
```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

## 📊 Test Coverage

Run tests with coverage:
```bash
cd backend
npm run test:cov
```

Coverage reports are generated in `test-report/coverage/`

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (Admin/User)
- Input validation with class-validator
- CORS configuration
- Protected routes with guards

## 🛣️ Roadmap

- [ ] Add unit tests for frontend components
- [ ] Implement pagination for sweets list
- [ ] Add image upload for sweets
- [ ] Implement order history
- [ ] Add email notifications
- [ ] Implement shopping cart
- [ ] Add payment integration

## 📄 License

This project is part of a TDD Kata exercise.

## 👤 Author

Built as part of the Incubyte TDD Kata challenge.

---

**Note**: This project follows TDD principles. All backend endpoints have corresponding test cases. The frontend is built with modern React patterns and Tailwind CSS for a beautiful, responsive UI.

