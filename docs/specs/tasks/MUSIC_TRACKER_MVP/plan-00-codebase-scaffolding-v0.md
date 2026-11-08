# PLAN-00: Khởi tạo Cấu trúc Dự án (Project Structure Scaffolding) — Version 0

> **Mã kế hoạch:** `PLAN-00` | **Mã chức năng:** `MUSIC_TRACKER_MVP`  
> **Trạng thái:** **HOÀN THÀNH (DONE)** | **Thẩm định:** `teamwork_victory_auditor` (VICTORY CONFIRMED)  
> **Người lập:** Orchestrator (Kỹ năng: `orchestrate`) | **Thực thi:** Teamwork Multi-Agent Team  
> **Tham chiếu:** [architecture.md](../../context/architecture.md), [tech-stack Backend](../../guidelines/backend/tech-stack.md), [tech-stack Frontend](../../guidelines/frontend/tech-stack.md), [task-plan.md](task-plan.md).

---

### 1. Mục tiêu & Phạm vi (Goal & Scope)
- **Mục tiêu:** Thiết lập nền tảng mã nguồn (Scaffolding) cho toàn bộ hệ thống Music Tracker ở **Version 0** theo mô hình **Tách bạch 2 thư mục độc lập (`backend/` và `frontend/`)**. Chuẩn bị sẵn sàng môi trường để các Procedure `developer-backend` và `developer-frontend` triển khai nghiệp vụ mà không gặp xung đột phụ thuộc hoặc sai lệch cấu trúc.
- **Phạm vi:**
  - Khởi tạo thư mục `backend/`: NestJS 10.x/11.x Modular Monolith, TypeScript strict mode, Prisma ORM.
  - Chuyển và liên kết `prisma/schema.prisma` v1.0 vào `backend/prisma/schema.prisma`.
  - Khởi tạo thư mục `frontend/`: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui base.
  - Root runner scripts trong `package.json` (hỗ trợ chạy lệnh tiện ích cho cả 2 phía).

---

### 2. Kiến trúc Thư mục Độc lập & Luồng Tương tác (Directory Architecture & Data Flow)

```text
Music-Tracking (Root)
│
├── backend/                    # Backend NestJS Modular Monolith + Prisma ORM
│   ├── src/
│   │   ├── main.ts             # Port 3000, CORS, ValidationPipe, Envelope
│   │   ├── app.module.ts       # Root module nạp Config, Schedule, Business modules
│   │   ├── common/             # Interceptors, Filters, Decorators, Crypto AES-256
│   │   ├── modules/            # Provider, Listening, Synchronization
│   │   └── integrations/       # Spotify Adapter, API Client, Types
│   ├── prisma/
│   │   └── schema.prisma       # Official Database Schema v1.0 (16 models, 8 enums)
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json            # Scripts: start:dev, build, test, prisma:*
│
├── frontend/                   # Frontend React 19 SPA + Vite + shadcn/ui
│   ├── src/
│   │   ├── app/                # App entry, Routing, Providers
│   │   ├── components/ui/      # shadcn/ui primitives (Button, Card, Dialog...)
│   │   ├── core/               # Base API Client (/api/v1), Auth storage
│   │   ├── layouts/            # MainLayout, Header, Sidebar
│   │   ├── modules/            # Connection, Sync, History UI
│   │   └── shared/             # Utils (cn helper, formatters)
│   ├── vite.config.ts          # Port 5173, proxy /api -> http://localhost:3000
│   ├── tailwind.config.js      # Design tokens, dark mode class
│   ├── tsconfig.json           # Path alias @/* -> ./src/*
│   └── package.json            # Scripts: dev, build, preview, test
│
├── docker-compose.yml          # PostgreSQL 16 Alpine container (Port 5432)
├── .env.example                # Root env template
├── package.json                # Root convenience runner scripts
├── docs/                       # Project Knowledge Hub
└── .agents/                    # AI Engineering Operating System
```

---

### 3. Cấu trúc Thư mục Chi tiết (Directory Layout & Scaffolding)

#### 3.1. Thư mục `backend/` (NestJS + Prisma)
- `backend/package.json`:
  - Scripts:
    - `start:dev`: `nest start --watch`
    - `build`: `nest build`
    - `test`: `jest`
    - `prisma:generate`: `prisma generate`
    - `prisma:migrate`: `prisma migrate dev`
  - Dependencies: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `@nestjs/schedule`, `@nestjs/swagger`, `@nestjs/config`, `@prisma/client`, `class-validator`, `class-transformer`, `reflect-metadata`, `rxjs`.
  - DevDependencies: `@nestjs/cli`, `@nestjs/schematics`, `@nestjs/testing`, `@types/node`, `@types/express`, `prisma`, `typescript`, `ts-node`, `jest`, `ts-jest`.
- `backend/prisma/schema.prisma`: Chứa 16 models và 8 enums chuẩn v1.0.
- Cấu trúc khung `backend/src/`:
  - `main.ts`: Khởi động NestJS trên port 3000, bật CORS, nạp ValidationPipe, bọc TransformResponseInterceptor và HttpExceptionFilter.
  - `app.module.ts`: Root module nạp ConfigModule, ScheduleModule, PrismaModule.
  - `common/`: Bộ khung chuẩn bị cho interceptors, filters, decorators, AES-256 cipher util.
  - `modules/provider/`, `modules/listening/`, `modules/synchronization/`.
  - `integrations/spotify/`.

#### 3.2. Thư mục `frontend/` (React 19 + Vite + shadcn/ui)
- `frontend/package.json`:
  - Scripts:
    - `dev`: `vite`
    - `build`: `tsc -b && vite build`
    - `preview`: `vite preview`
  - Dependencies: `react@^19.0.0`, `react-dom@^19.0.0`, `react-router@^7.0.0`, `@tanstack/react-query@^5.0.0`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`.
  - DevDependencies: `vite@^6.0.0`, `@vitejs/plugin-react`, `tailwindcss@^3.4.0`, `postcss`, `autoprefixer`, `typescript`, `@types/react`, `@types/react-dom`.
- Cấu trúc khung `frontend/src/`:
  - `app/`: App.tsx, providers.tsx, router.tsx.
  - `components/ui/`: Sẵn sàng cho các component shadcn/ui.
  - `core/api/`: Base API client bọc `fetch`/`axios` với base URL `/api/v1`.
  - `layouts/`: MainLayout, Header, Sidebar.
  - `modules/`: `connection/`, `sync/`, `history/`.

#### 3.3. Root Runner & Scripts
- Root `package.json` tiện ích:
  - `"dev:backend"`: `cd backend && npm run start:dev`
  - `"dev:frontend"`: `cd frontend && npm run dev`
  - `"build:backend"`: `cd backend && npm run build`
  - `"build:frontend"`: `cd frontend && npm run build`

---

### 4. Hợp đồng Khởi tạo & API Interface (Scaffolding Contracts)
- **API Envelope:** Backend bắt buộc bọc toàn bộ response theo cấu trúc:
  ```json
  {
    "code": 0,
    "message": "OK",
    "data": {}
  }
  ```
- **Base Endpoint:** Prefix toàn bộ API Backend bằng `/api/v1`.
- **Healthcheck Endpoint:** Cung cấp `GET /api/v1/health` trả về trạng thái server và kết nối PostgreSQL.
- **Frontend Proxy:** Cấu hình `vite.config.ts` proxy `/api` trỏ về `http://localhost:3000` để tránh CORS khi dev.

---

### 5. Ảnh hưởng Giao diện (UI / UX Impact)
- Màn hình khởi tạo (Placeholder Dashboard):
  - Hiển thị tiêu đề **Music Tracker v0.1**.
  - Hiển thị trạng thái kết nối tới Backend API (`Healthy` / `Offline`).
  - Giao diện Dark/Light mode chuẩn Tailwind và cấu trúc Layout cơ bản.

---

### 6. Trường hợp Biên & Gotchas Kỹ thuật (Edge Cases & Gotchas)
- **Gotcha 1 (Node.js & Windows Path):** Cấu hình path alias `@/*` và `tsconfig` trên Windows cần đồng bộ giữa `vite.config.ts` và `tsconfig.json`.
- **Gotcha 2 (Prisma Output Path):** Đảm bảo `@prisma/client` sinh đúng vị trí để Backend `apps/api` import trực tiếp từ `@prisma/client`.
- **Gotcha 3 (Port Collision):** Đảm bảo port 3000 (API) và 5173 (Web) không bị xung đột, có fallback biến môi trường `PORT`.
- **Gotcha 4 (Package Isolation):** Tuyệt đối không cài các thư viện ngoài danh mục đã duyệt (cấm Redux, antd, Moment.js, Microservices).

---

### 7. Rủi ro & Giả định (Risks & Assumptions)
- **Rủi ro:** Cài đặt package qua npm có thể tốn thời gian tải hoặc gặp EPERM trên Windows.
  - *Biện pháp:* Khởi tạo cấu trúc file và package.json gọn nhẹ, cài đặt từng package theo đúng danh mục đã duyệt.
- **Giả định:** Node.js v20+ (hiện tại v25.9.0) và npm 11.x đã sẵn sàng trên máy dev.

---

### 8. Chiến lược Kiểm thử & Xác thực (Verification Strategy)
- **Layer 1 (Lint & Typecheck):**
  - Chạy `npm run build` hoặc `tsc --noEmit` cho cả `backend/` và `frontend/`.
- **Layer 2 (Prisma Validation):**
  - Chạy `npx prisma validate` và `npx prisma generate` bên trong `backend/`.
- **Layer 3 (Smoke Test Dev Servers):**
  - Khởi động Backend: `cd backend && npm run start:dev` $\rightarrow$ cURL `http://localhost:3000/api/v1/health` $\rightarrow$ Trả về `{ code: 0, message: "OK", data: { status: "healthy" } }`.
  - Khởi động Frontend: `cd frontend && npm run dev` $\rightarrow$ Mở `http://localhost:5173` $\rightarrow$ Giao diện render thành công.

---

### 9. Đánh giá Kiến trúc & Tiêu chuẩn Hoàn thành (Architecture Impact & DoD)
- **Tác động Kiến trúc:** Thiết lập nền móng chuẩn mực phân tách 2 thư mục độc lập `backend/` và `frontend/`, giúp quản lý dependencies độc lập 100%, không xung đột versions hay build toolings.
- **DoD Version 0:**
  - [ ] Khung thư mục `backend/` và `frontend/` được khởi tạo đầy đủ.
  - [ ] Prisma Client sinh ra không lỗi trong `backend/`.
  - [ ] Endpoint `/api/v1/health` phản hồi chuẩn envelope `{ code: 0, message: "OK", data }`.
  - [ ] Frontend Vite build pass.
  - [ ] Cập nhật `docs/releases/CHANGELOG.md` ghi nhận hoàn tất Version 0.
