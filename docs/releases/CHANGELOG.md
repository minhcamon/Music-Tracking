# Nhật ký Phát hành (Release Changelog) — Music Tracker

> Lưu trữ toàn bộ lịch sử thay đổi phiên bản của hệ thống Music Tracker theo chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) và [Semantic Versioning](https://semver.org/).
> Định dạng nhóm: `Added` (Thêm mới), `Changed` (Thay đổi), `Deprecated` (Sắp bỏ), `Removed` (Gỡ bỏ), `Fixed` (Sửa lỗi), `Security` (Bảo mật).

---

## [Unreleased] — Kế hoạch Phát triển Tiếp theo (Roadmap MVP)

### Planned (Sắp triển khai)
- **PLAN-03:** Backend Spotify OAuth 2.0 Integration & Token Management (AES-256-GCM).
- **PLAN-04:** Sync Engine & Checkpoint Management (Scheduler, Overlap 2m, Deduplication).
- **PLAN-05:** Frontend Management UI (ConnectionCard, SyncIntervalSelector, SyncLogTable, ListeningEventList).

---

## [v0.2.0] — 2026-11-08 (Version 0: Codebase Scaffolding — PLAN-00)

> Hoàn thành toàn diện việc khởi tạo khung mã nguồn độc lập cho Backend NestJS và Frontend React 19 theo kế hoạch PLAN-00 đã duyệt. Thẩm định độc lập bởi `teamwork_victory_auditor` (VICTORY CONFIRMED).

### Added
- **Backend Modular Monolith (`backend/`):**
  - Cấu hình NestJS 10.x/11.x với TypeScript strict mode, cổng 3000, tiền tố toàn cục `/api/v1`, CORS, và `ValidationPipe`.
  - Đồng bộ `prisma/schema.prisma` v1.0 (16 models, 8 enums) và sinh Prisma Client v5.22.0.
  - Endpoint sức khỏe `GET /api/v1/health` trả về response envelope chuẩn `{ code: 0, message: "OK", data: { status: "healthy" } }`.
  - Cài đặt `TransformResponseInterceptor` và `HttpExceptionFilter` chuẩn hóa định dạng API envelope.
  - Cài đặt tiện ích mã hóa AES-256-GCM (`CryptoUtil`) với IV 12-byte và auth tag 16-byte cho token lưu trữ.
  - Bộ khung các modules nghiệp vụ: `HealthModule`, `PrismaModule`, `ProviderModule`, `ListeningModule`, `SynchronizationModule`.
  - Cô lập nhà cung cấp (Provider Isolation): Toàn bộ Spotify API Client, Mapper và Types nằm tại `src/integrations/spotify/`.
  - 4 bộ Unit test suites (12 tests passed) và E2E test cho `HealthController`.
- **Frontend SPA (`frontend/`):**
  - Khởi tạo Single Page Application với React 19, TypeScript, Vite 6, Tailwind CSS 3.4, và shadcn/ui primitives (`Button`, `Card`, `Badge`).
  - Cấu hình Vite reverse proxy chuyển tiếp các request `/api` sang `http://localhost:3000`.
  - Base API Client (`api-client.ts`) tự động unwrap envelope `{ code, message, data }` và map lỗi chuẩn.
  - Khung giao diện: `MainLayout`, `Header` có dynamic polling badge trạng thái backend health, `Sidebar`, cùng các module stubs (`connection`, `sync`, `history`, `dashboard`).
  - Đóng gói production `tsc -b && vite build` hoàn thành 1663 modules, 0 lỗi.
- **Root Workspace Runner Scripts (`package.json`):**
  - Cung cấp các lệnh điều phối: `npm run dev:backend`, `npm run dev:frontend`, `npm run build:backend`, `npm run build:frontend`, `npm run test:backend`, `npm run prisma:generate`.

### Security & Compliance
- Tuân thủ **Honest Data Rule**: Các trường thời lượng thực tế trên mapper và models luôn là `null`.
- Tuân thủ **Provider Isolation**: Không import types hoặc logic của Spotify ra ngoài `src/integrations/spotify/`.
- Cập nhật và lưu vết nhật ký hoàn thành tại `.agents/state/nhatminhyt06/current-task.md` và `progress.md`.

---

## [v0.1.0] — 2026-11-08 (Foundation Baseline & Official DB Schema v1.0)

> Cột mốc hoàn thành nền tảng kỹ thuật kiến trúc, kho tri thức AI và thiết kế CSDL v1.0.

### Added
- **Official Database Schema v1.0:** Hoàn thiện `prisma/schema.prisma` với 16 models và 8 enums:
  - *Authentication (3 models):* `User`, `AuthSession`, `AuthToken`.
  - *Provider Management (1 model):* `ProviderConnection`.
  - *Canonical Catalog (5 models):* `Track`, `Artist`, `Album`, `TrackArtist`, `TrackAlbum`.
  - *Provider Catalog (4 models):* `ProviderTrack`, `ProviderArtist`, `ProviderAlbum`, `ProviderTrackArtist`.
  - *Listening Domain (1 model):* `ListeningEvent` với Honest Data Rule.
  - *Synchronization (2 models):* `ProviderSyncState` (1-1 checkpoint), `SyncRun` (1-N audit log).
  - *Enums (8):* `UserRole`, `TokenType`, `MusicProvider`, `ConnectionStatus`, `ArtistRole`, `AlbumType`, `SyncMode`, `SyncStatus`.
- **AI Engineering Operating System:**
  - Hệ thống `.agents/` hoàn chỉnh với 6 Agent procedures (`solution-architect`, `architect-reviewer`, `developer-backend`, `developer-frontend`, `code-reviewer-*`).
  - 10 chuyên môn kỹ năng: `orchestrate`, `task-state-init`, `progress-tracker`, `technical-design`, `verification`, `code-review-*`, `debug-*`.
  - Bộ hợp đồng điều phối trung tâm `AGENTS.md` với các quy tắc MUST / NEVER bất biến.
- **Tài liệu Kiến trúc & Tiêu chuẩn Kỹ thuật (`docs/`):**
  - Đồng bộ `docs/context/architecture.md` chi tiết 16 bảng CSDL.
  - Đồng bộ `docs/context/domain-glossary.md` với ngôn ngữ chung toàn diện.
  - Sổ ghi nhận quyết định kiến trúc: `ADR-0001` (NestJS), `ADR-0002` (PostgreSQL/Prisma v1.0), `ADR-0003` (React/shadcn/ui), `ADR-0004` (Sync Checkpoint & Deduplication), `ADR-0005` (Spotify Policy Gate & Honest Data).
  - Quy chuẩn kỹ thuật: Coding conventions, API envelope (`{ code, message, data }`), Git workflow, Security policy, Gotchas.
- **Hạ tầng & Khởi tạo Dự án:**
  - Git repository chính thức kết nối GitHub: `https://github.com/minhcamon/Music-Tracking`.
  - File cấu hình môi trường chuẩn `.env.example`.
  - File cấu hình `.gitignore` toàn diện bảo vệ bí mật và artifacts.
  - File `docker-compose.yml` cho container PostgreSQL 16 Alpine cục bộ.

### Security
- Thiết lập quy tắc bắt buộc mã hóa AES-256-GCM cho OAuth token at rest.
- Loại trừ toàn bộ `.env` và bí mật cá nhân khỏi Git history.
- Áp dụng Honest Data Rule: Các trường `startedAt`, `endedAt`, `listenedDurationMs`, `startProgressMs`, `endProgressMs`, `completionRate` bắt buộc `null` trên DB.

