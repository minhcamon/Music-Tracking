# Task: Khởi tạo Cấu trúc Dự án (Project Structure Scaffolding) — Version 0

> **Trạng thái:** `COMPLETED`
> **Bắt đầu:** 2026-11-08
> **Hoàn thành:** 2026-11-08
> **Module / Chức năng:** `INFRASTRUCTURE` / `SCAFFOLDING`
> **Spec liên quan:** `docs/specs/business-spec/MUSIC_TRACKER_MVP/srs.md`, `docs/specs/tasks/MUSIC_TRACKER_MVP/plan-00-codebase-scaffolding-v0.md`, `docs/context/architecture.md`

---

## 1. Mục tiêu (Objective)
Thiết lập bộ khung dự án hoàn chỉnh cho Version 0:
- Cấu hình workspace & scripts chuẩn (2 thư mục độc lập `backend/` và `frontend/`, root runner scripts).
- Khởi tạo khung Backend Modular Monolith NestJS (`src/main.ts`, `src/app.module.ts`, `src/common/`, `src/modules/`, `src/integrations/spotify/`).
- Tích hợp Prisma Client & liên kết schema v1.0 (16 models, 8 enums).
- Khởi tạo khung Frontend React 19 + Vite + Tailwind CSS + shadcn/ui base (`src/app/`, `src/layouts/`, `src/modules/`, `src/core/api/`).
- Xác thực toàn bộ quy trình build và khởi chạy dev server (`npm run build:backend`, `npm run build:frontend`, `npm run test:backend`, `npm run prisma:generate`).

---

## 2. Định nghĩa Hoàn thành (Definition of Done - DoD)
- [x] Cấu trúc thư mục khớp 100% với `docs/context/architecture.md` và `docs/guidelines/` (2 thư mục độc lập `backend/` và `frontend/`).
- [x] `npm run build:backend` và `npm run build:frontend` biên dịch sạch sẽ, mã thoát 0.
- [x] `npm run prisma:generate` (hoặc `npx prisma generate`) sinh Prisma Client v5.22.0 thành công từ `backend/prisma/schema.prisma` v1.0.
- [x] Không tự ý cài đặt package ngoài danh mục công nghệ đã duyệt trong `docs/guidelines/*/tech-stack.md`.
- [x] Kiểm thử tự động hoàn tất: 4/4 test suites (12 tests) Backend pass, TypeScript strict mode pass trên cả 2 phía.

---

## 3. Các bước tổng quan (Overview Steps)
- [x] Bước 1: Lựa chọn và chốt phương án cấu trúc Repository (2 thư mục độc lập `backend/` & `frontend/` per PLAN-00)
- [x] Bước 2: Thiết lập Root Workspace runner scripts trong `package.json` (`dev:backend`, `dev:frontend`, `build:backend`, `build:frontend`, `test:backend`, `prisma:generate`)
- [x] Bước 3: Scaffolding Backend NestJS Modular Monolith + Prisma Client v1.0 + Quarantined Spotify Integration + Token Encryption AES-256-GCM + Honest Data rule
- [x] Bước 4: Scaffolding Frontend React 19 + Vite + Tailwind CSS + shadcn/ui base + Reverse proxy `/api` -> `http://localhost:3000` + Base API client + Dynamic Health Polling badge
- [x] Bước 5: Kiểm chứng Build & Scripts Verification (`npm run build:backend`, `npm run build:frontend`, `npm run test:backend`, `npm run prisma:generate` exit code 0)
