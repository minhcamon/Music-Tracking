# Task: Khởi tạo Cấu trúc Dự án (Project Structure Scaffolding) — Version 0

> **Trạng thái:** `PLANNING`
> **Bắt đầu:** 2026-11-08
> **Module / Chức năng:** `INFRASTRUCTURE` / `SCAFFOLDING`
> **Spec liên quan:** `docs/specs/business-spec/MUSIC_TRACKER_MVP/srs.md`, `docs/context/architecture.md`

---

## 1. Mục tiêu (Objective)
Thiết lập bộ khung dự án hoàn chỉnh cho Version 0:
- Cấu hình workspace & scripts chuẩn (pnpm, TypeScript base, ESLint/Prettier).
- Khởi tạo khung Backend Modular Monolith NestJS (`src/main.ts`, `src/app.module.ts`, `src/common/`, `src/modules/`, `src/integrations/spotify/`).
- Tích hợp Prisma Client & liên kết schema v1.0.
- Khởi tạo khung Frontend React 19 + Vite + Tailwind CSS + shadcn/ui.
- Xác thực toàn bộ quy trình build và khởi chạy dev server.

---

## 2. Định nghĩa Hoàn thành (Definition of Done - DoD)
- [ ] Cấu trúc thư mục khớp 100% với `docs/context/architecture.md` và `docs/guidelines/`.
- [ ] `pnpm run build` hoặc typecheck cả Backend và Frontend pass không lỗi.
- [ ] `npx prisma generate` sinh Prisma Client thành công từ `prisma/schema.prisma`.
- [ ] Không tự ý cài đặt package ngoài danh mục công nghệ đã duyệt trong `docs/guidelines/*/tech-stack.md`.
- [ ] Có thể chạy kiểm thử smoke test cho cả dev server Backend và Frontend.

---

## 3. Các bước tổng quan (Overview Steps)
- [ ] Bước 1: Lựa chọn và chốt phương án cấu trúc Repository (Monorepo pnpm workspaces vs Backend/Frontend riêng biệt)
- [ ] Bước 2: Thiết lập Root Workspace, TypeScript configs, Lint & Format rules
- [ ] Bước 3: Scaffolding Backend NestJS Modular Monolith + Prisma Client
- [ ] Bước 4: Scaffolding Frontend React 19 + Vite + Tailwind CSS + shadcn/ui base
- [ ] Bước 5: Kiểm chứng Build & Dev Servers (Layer Verification)
