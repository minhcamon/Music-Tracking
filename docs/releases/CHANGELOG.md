# Nhật ký Phát hành (Release Changelog) — Music Tracker

> Lưu trữ toàn bộ lịch sử thay đổi phiên bản của hệ thống Music Tracker theo chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) và [Semantic Versioning](https://semver.org/).
> Định dạng nhóm: `Added` (Thêm mới), `Changed` (Thay đổi), `Deprecated` (Sắp bỏ), `Removed` (Gỡ bỏ), `Fixed` (Sửa lỗi), `Security` (Bảo mật).

---

## [Unreleased] — Kế hoạch Phát triển Tiếp theo (Roadmap MVP)

### Planned (Sắp triển khai)
- **Backend Core:** Scaffolding NestJS Modular Monolith, tích hợp Passport OAuth2 Spotify.
- **Provider Module:** Mã hóa AES-256-GCM lưu trữ access/refresh tokens.
- **Sync Engine:** Bộ lập lịch cron `@nestjs/schedule` với cơ chế overlap buffer 2 phút.
- **Deduplication:** Khóa unique DB chống trùng lặp `(connection_id, provider_track_id, played_at)`.
- **Frontend SPA:** Giao diện React 19 + shadcn/ui quản lý kết nối và giám sát đồng bộ.

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

