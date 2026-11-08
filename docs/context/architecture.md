# System Architecture — Music Tracker

> Tài liệu mô tả kiến trúc kỹ thuật hệ thống, cấu trúc module, luồng dữ liệu và lược đồ cơ sở dữ liệu.
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 4, 5, 8, 9).

---

## 1. Tổng quan Hệ thống (System Overview)

- **Tên dự án:** Music Tracker (Tên làm việc; các ứng viên: LexiListen, LexiHear)
- **Kiến trúc chính:** **Modular Monolith** (Node.js LTS + NestJS + TypeScript)
- **Nguyên tắc cốt lõi:**
  1. *Spotify-first, not Spotify-dependent:* Toàn bộ logic đặc thù của Spotify nằm trong Adapter riêng biệt. Domain model trung lập tuyệt đối.
  2. *Backend-driven collection:* Công cụ thu thập và đồng bộ chạy nền độc lập hoàn toàn với Frontend.
  3. *Idempotent ingestion & Honest data:* Đồng bộ lặp lại không tạo bản ghi trùng lặp; trường nào Spotify không cung cấp thì giữ nguyên giá trị `null`.
- **Ngăn xếp Công nghệ:**
  - **Frontend:** React + TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query.
  - **Backend:** NestJS + TypeScript, Node.js LTS, Modular Monolith.
  - **ORM & Database:** Prisma ORM, PostgreSQL.
  - **Task Scheduler:** `@nestjs/schedule` (kèm cơ chế khóa phân tán PostgreSQL advisory lock khi cần scale).
  - **OAuth & AuthN:** Passport + OAuth2 (Authorization Code Flow).
  - **Bảo mật:** Mã hóa token at rest bằng AES-256-GCM.
  - **API Contract:** RESTful API versioning `/api/v1`, chuẩn Swagger OpenAPI.
  - **Triển khai:** Docker Compose + VPS.

---

## 2. Cấu trúc Module & Phân tầng (Modular Architecture)

Mã nguồn Backend tổ chức theo cấu trúc Modular Monolith phân tách rõ ràng giữa Core Business Domain và Provider Integrations:

```text
src/
├── app.module.ts              # Root module nạp các modules con
├── main.ts                    # Bootstrap application, ValidationPipe, Swagger setup
│
├── common/                    # Tiện ích, decorators, interceptors, error filters
│   ├── constants/             # ApiPaths, ErrorCodes
│   ├── decorators/            # CurrentUser, Public
│   ├── filters/               # HttpExceptionFilter (Envelope chuẩn { code, message, data })
│   ├── interceptors/          # TransformResponseInterceptor, LoggingInterceptor
│   └── utils/                 # Crypto/Cipher helper (AES-256-GCM)
│
├── modules/                   # Các module nghiệp vụ trung lập
│   ├── provider/              # Quản lý liên kết Provider & mã hóa Token
│   │   ├── controllers/       # ProviderConnectionController
│   │   ├── services/          # ProviderConnectionService, ProviderTokenService
│   │   └── dto/               # ConnectDto, ConnectionStatusResponseDto
│   │
│   ├── listening/             # Quản lý sự kiện nghe và dữ liệu lịch sử chuẩn hóa
│   │   ├── controllers/       # ListeningEventController
│   │   ├── services/          # ListeningEventService
│   │   └── repositories/      # ListeningEventRepository (Prisma wrapper)
│   │
│   └── synchronization/       # Động cơ đồng bộ nền và quản lý checkpoint
│       ├── controllers/       # SyncController (Manual sync trigger)
│       ├── schedulers/        # SyncSchedulerService (@nestjs/schedule)
│       ├── services/          # SyncCoordinatorService, SyncProcessorService
│       └── dto/               # SyncTriggerDto, SyncStatusResponseDto
│
└── integrations/              # Adapter riêng cho từng bên thứ ba (Provider-specific)
    └── spotify/               # Độc quyền xử lý Spotify Web API
        ├── clients/           # SpotifyApiClient (Recently Played, Token refresh)
        ├── adapters/          # SpotifyAdapter (Triển khai MusicProviderAdapter interface)
        ├── mappers/           # SpotifyPlayHistoryMapper (Ánh xạ sang ListeningEvent)
        └── types/             # SpotifyApiTypes (PlayHistoryObject, CursorResponse)
```

---

## 3. Luồng Dữ liệu (Data Flow)

### 3.1. Luồng Xác thực OAuth 2.0 (Spotify Connect)

```text
User (Browser) ──► GET /api/v1/auth/spotify/login ──► Redirect tới Spotify Auth URL
                                                                │
User đồng ý cấp quyền trên Spotify ◄────────────────────────────┘
        │
        ▼
Spotify Callback ──► GET /api/v1/auth/spotify/callback?code=...
        │
        ▼
Backend đổi Authorization Code ──► Spotify Token API (lấy access & refresh token)
        │
        ▼
Mã hóa Token (AES-256-GCM) ──► Lưu ProviderConnection (CONNECTED) ──► Khởi tạo ProviderSyncState
        │
        ▼
Redirect User về Frontend UI với trạng thái thành công
```

### 3.2. Luồng Đồng bộ Định kỳ & Xử lý Checkpoint (Scheduled Sync Flow)

```text
Cron (@nestjs/schedule) chạy mỗi 1 phút
        │
        ▼
Tìm các ProviderConnection đang CONNECTED có nextSyncAt <= NOW()
        │
        ▼
Kiểm tra Token hết hạn? ──► YES ──► Gọi Spotify Token Refresh ──► Cập nhật Token mới
        │
        ▼
Nạp ProviderSyncState (Lấy checkpoint lastProcessedPlayedAt)
        │
        ▼
Tính mốc after = (lastProcessedPlayedAt - 2 phút overlap)
        │
        ▼
Gọi Spotify API: GET /v1/me/player/recently-played?after=...&limit=50
        │
        ▼
Lặp xử lý các trang theo cursor 'next' (tối đa theo quota an toàn)
        │
        ▼
Ánh xạ qua Adapter ──► Normalization sang ListeningEvent
        │
        ▼
Khử trùng lặp (Deduplication) qua Unique Constraint DB:
(providerConnectionId, providerTrackId, playedAt)
        │
        ▼
Lưu thành công vào PostgreSQL ──► COMMIT Checkpoint (lastProcessedPlayedAt = max playedAt)
        │
        ▼
Cập nhật ProviderSyncState: status = SUCCESS, nextSyncAt = NOW() + syncInterval
```

---

## 4. Mô hình Cơ sở Dữ liệu (Database Schema — Prisma v1.0)

> Cơ sở dữ liệu sử dụng **PostgreSQL** và **Prisma ORM** gồm **16 models** và **8 enums**, tổ chức thành 6 nhóm miền nghiệp vụ rõ ràng:
> Multi-user Ready · Spotify-first · Multi-source Extensible. File gốc: `prisma/schema.prisma`.

### 4.0. Danh mục Enums (8 Enums)

| Enum | Giá trị | Ý nghĩa |
|---|---|---|
| `UserRole` | `ADMIN`, `USER` | Quyền hạn tài khoản trong ứng dụng |
| `TokenType` | `REFRESH_TOKEN`, `EMAIL_VERIFICATION`, `PASSWORD_RESET` | Phân loại token xác thực |
| `MusicProvider` | `SPOTIFY`, `APPLE_MUSIC`, `YOUTUBE_MUSIC`, `LOCAL_FILE` | Nền tảng dịch vụ âm nhạc tích hợp |
| `ConnectionStatus` | `CONNECTED`, `REAUTH_REQUIRED`, `DISCONNECTED` | Trạng thái ủy quyền kết nối provider |
| `ArtistRole` | `PRIMARY`, `FEATURED`, `PRODUCER`, `REMIXER` | Vai trò của nghệ sĩ đối với bài hát |
| `AlbumType` | `ALBUM`, `SINGLE`, `COMPILATION`, `EP` | Phân loại phát hành âm nhạc |
| `SyncMode` | `AUTO`, `MANUAL` | Chế độ chạy đồng bộ |
| `SyncStatus` | `IDLE`, `RUNNING`, `SUCCESS`, `FAILED`, `RATE_LIMITED`, `PARTIAL_SUCCESS` | Trạng thái tiến trình đồng bộ |

---

### 4.1. Nhóm Xác thực Ứng dụng (Authentication — 3 Models)

#### Bảng `users` (Tài khoản người dùng)
- **Cột chính:** `id` (VARCHAR(36), PK), `email` (VARCHAR(255), Unique), `password_hash` (VARCHAR(255)), `display_name` (VARCHAR(100), Nullable), `avatar_url` (VARCHAR(500), Nullable), `role` (`UserRole`, Default `USER`), `is_active` (BOOLEAN, Default `true`), `created_at`, `updated_at`.
- **Quan hệ:** 1-N với `auth_sessions`, `auth_tokens`, `provider_connections`, `artists`, `albums`, `tracks`, `listening_events`, `sync_runs`.

#### Bảng `auth_sessions` (Phiên đăng nhập người dùng)
- **Cột chính:** `id` (VARCHAR(36), PK), `user_id` (FK -> `users`), `user_agent` (TEXT), `ip_address` (VARCHAR(45)), `is_valid` (BOOLEAN, Default `true`), `expires_at` (TIMESTAMPTZ), `created_at`, `updated_at`.
- **Chỉ mục:** `@@index([user_id])`.

#### Bảng `auth_tokens` (Token xác thực & bảo mật)
- **Cột chính:** `id` (VARCHAR(36), PK), `user_id` (FK -> `users`), `session_id` (FK -> `auth_sessions`, Nullable), `token_hash` (VARCHAR(255), Unique), `token_type` (`TokenType`), `is_revoked` (BOOLEAN, Default `false`), `expires_at`, `created_at`, `revoked_at`.
- **Chỉ mục:** `@@index([user_id, token_type])`.

---

### 4.2. Nhóm Quản lý Provider (Provider Management — 1 Model)

#### Bảng `provider_connections` (Liên kết tài khoản dịch vụ âm nhạc)
- **Cột chính:** `id` (VARCHAR(36), PK), `user_id` (FK -> `users`), `provider` (`MusicProvider`, Default `SPOTIFY`), `provider_user_id` (VARCHAR(100)), `provider_user_email` (VARCHAR(255), Nullable), `provider_display_name` (VARCHAR(255), Nullable), `access_token_encrypted` (TEXT), `refresh_token_encrypted` (TEXT), `token_expires_at` (TIMESTAMPTZ), `scopes` (TEXT), `status` (`ConnectionStatus`, Default `CONNECTED`), `connected_at`, `updated_at`.
- **Ràng buộc:** `@@unique([user_id, provider, provider_user_id])`.
- **Chỉ mục:** `@@index([user_id])`, `@@index([provider, status])`.

---

### 4.3. Nhóm Kho nhạc Chuẩn hóa (Canonical Catalog — 5 Models)

> Kho nhạc chuẩn hóa thuộc quyền sở hữu của từng `User` (`user_id`), cho phép hợp nhất nhận diện nghệ sĩ, bài hát và album qua nhiều nguồn provider mà không bị phụ thuộc provider cụ thể.

#### Bảng `artists` (Nghệ sĩ chuẩn hóa)
- **Cột:** `id` (PK), `user_id` (FK -> `users`), `name` (VARCHAR(255)), `bio` (TEXT, Nullable), `image_url` (VARCHAR(500), Nullable), `created_at`, `updated_at`.
- **Ràng buộc:** `@@unique([user_id, name])`, `@@index([user_id])`.

#### Bảng `albums` (Album chuẩn hóa)
- **Cột:** `id` (PK), `user_id` (FK -> `users`), `name` (VARCHAR(255)), `album_type` (`AlbumType`, Default `ALBUM`), `release_date` (VARCHAR(50), Nullable), `total_tracks` (INT, Nullable), `cover_image_url` (VARCHAR(500), Nullable), `created_at`, `updated_at`.
- **Chỉ mục:** `@@index([user_id, name])`.

#### Bảng `tracks` (Bài hát chuẩn hóa)
- **Cột:** `id` (PK), `user_id` (FK -> `users`), `title` (VARCHAR(255)), `duration_ms` (INT, Nullable), `is_explicit` (BOOLEAN, Default `false`), `isrc` (VARCHAR(50), Nullable), `created_at`, `updated_at`.
- **Chỉ mục:** `@@index([user_id, title])`, `@@index([user_id, isrc])`.

#### Bảng `track_artists` (Quan hệ N-N Bài hát — Nghệ sĩ)
- **Cột:** `id` (PK), `track_id` (FK -> `tracks`), `artist_id` (FK -> `artists`), `role` (`ArtistRole`, Default `PRIMARY`), `position` (INT, Default 0), `created_at`.
- **Ràng buộc:** `@@unique([track_id, artist_id, role])`, `@@index([artist_id])`.

#### Bảng `track_albums` (Quan hệ N-N Bài hát — Album)
- **Cột:** `id` (PK), `track_id` (FK -> `tracks`), `album_id` (FK -> `albums`), `disc_number` (INT, Default 1), `track_number` (INT, Nullable), `created_at`.
- **Ràng buộc:** `@@unique([track_id, album_id])`, `@@index([album_id])`.

---

### 4.4. Nhóm Kho nhạc theo Nguồn Cung cấp (Provider Catalog — 4 Models)

> Lưu trữ nguyên bản metadata, URI, URL từ từng Provider (Spotify), liên kết N-1 với `provider_connections` và ánh xạ tùy chọn (1-1/N-1) lên Canonical Catalog.

#### Bảng `provider_artists`
- **Cột:** `id` (PK), `connection_id` (FK -> `provider_connections`), `canonical_artist_id` (FK -> `artists`, SetNull), `provider` (`MusicProvider`), `provider_artist_id` (VARCHAR(100)), `name` (VARCHAR(255)), `provider_uri`, `provider_url`, `image_url`, `raw_metadata` (JSONB), timestamps.
- **Ràng buộc:** `@@unique([connection_id, provider_artist_id])`, `@@index([provider, provider_artist_id])`, `@@index([canonical_artist_id])`.

#### Bảng `provider_albums`
- **Cột:** `id` (PK), `connection_id` (FK -> `provider_connections`), `canonical_album_id` (FK -> `albums`, SetNull), `provider` (`MusicProvider`), `provider_album_id` (VARCHAR(100)), `name`, `album_type` (VARCHAR(50)), `release_date`, `total_tracks`, `cover_image_url`, `provider_uri`, `provider_url`, `raw_metadata` (JSONB), timestamps.
- **Ràng buộc:** `@@unique([connection_id, provider_album_id])`, `@@index([provider, provider_album_id])`, `@@index([canonical_album_id])`.

#### Bảng `provider_tracks`
- **Cột:** `id` (PK), `connection_id` (FK -> `provider_connections`), `canonical_track_id` (FK -> `tracks`, SetNull), `provider_album_id` (FK -> `provider_albums`, SetNull), `provider` (`MusicProvider`), `provider_track_id` (VARCHAR(100)), `title`, `duration_ms`, `is_explicit`, `isrc`, `provider_uri`, `provider_url`, `raw_metadata` (JSONB), timestamps.
- **Ràng buộc:** `@@unique([connection_id, provider_track_id])`, `@@index([provider, provider_track_id])`, `@@index([canonical_track_id])`, `@@index([isrc])`.

#### Bảng `provider_track_artists` (Quan hệ N-N ProviderTrack — ProviderArtist)
- **Cột:** `id` (PK), `provider_track_id` (FK -> `provider_tracks`), `provider_artist_id` (FK -> `provider_artists`), `role` (`ArtistRole`), `position`, `created_at`.
- **Ràng buộc:** `@@unique([provider_track_id, provider_artist_id, role])`, `@@index([provider_artist_id])`.

---

### 4.5. Nhóm Sự kiện Nghe nhạc (Listening Domain — 1 Model)

#### Bảng `listening_events` (Thực thể trung tâm — Immutable Log)

| Tên cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa nghiệp vụ / Provenance |
|---|---|---|---|
| `id` | `VARCHAR(36)` | PK, UUID | Mã sự kiện nghe chuẩn hóa |
| `user_id` | `VARCHAR(36)` | FK -> `users` | Người dùng sở hữu lịch sử |
| `connection_id` | `VARCHAR(36)` | FK -> `provider_connections` | Khóa ngoại kết nối nguồn |
| `provider_track_id` | `VARCHAR(36)` | FK -> `provider_tracks` | Bài hát nguồn được phát |
| `canonical_track_id`| `VARCHAR(36)` | FK -> `tracks`, Nullable | Bài hát chuẩn hóa liên kết |
| `played_at` | `TIMESTAMPTZ` | Not Null | Mốc thời gian nghe (do Provider trả về, UTC) |
| `context_type` | `VARCHAR(50)` | Nullable | Context nghe: `playlist`, `album`, `artist` |
| `context_uri` | `VARCHAR(255)` | Nullable | URI của context nghe |
| `observed_at` | `TIMESTAMPTZ` | Default `NOW()` | Thời điểm Tracker gọi API nhận được bản ghi |
| `created_at` | `TIMESTAMPTZ` | Default `NOW()` | Thời điểm ghi bản ghi vào CSDL |
| **`started_at`** | `TIMESTAMPTZ` | **BẮT BUỘC NULL** | Không suy diễn thời điểm bắt đầu nghe |
| **`ended_at`** | `TIMESTAMPTZ` | **BẮT BUỘC NULL** | Không suy diễn thời điểm kết thúc nghe |
| **`listened_duration_ms`** | `INTEGER` | **BẮT BUỘC NULL** | Không suy diễn thời gian nghe thực tế |
| **`start_progress_ms`** | `INTEGER` | **BẮT BUỘC NULL** | Không suy diễn tiến độ bắt đầu |
| **`end_progress_ms`** | `INTEGER` | **BẮT BUỘC NULL** | Không suy diễn tiến độ kết thúc |
| **`completion_rate`** | `FLOAT` | **BẮT BUỘC NULL** | Không tự tính tỷ lệ hoàn thành |

> **Ràng buộc Chống Trùng lặp (Unique Constraint):**
> `@@unique([connection_id, provider_track_id, played_at])`
>
> **Chỉ mục Tối ưu Truy vấn:**
> `@@index([user_id, played_at(sort: Desc)])`, `@@index([canonical_track_id])`

---

### 4.6. Nhóm Đồng bộ & Vận hành (Synchronization — 2 Models)

#### Bảng `provider_sync_states` (Trạng thái Checkpoint 1-1 với ProviderConnection)
- **Cột:** `id` (PK), `connection_id` (FK -> `provider_connections`, Unique), `sync_mode` (`SyncMode`, Default `AUTO`), `sync_interval_minutes` (INT, Default 30), `last_sync_attempt_at`, `last_successful_sync_at`, `last_processed_played_at` (TIMESTAMPTZ, Checkpoint mốc nghe mới nhất), `next_sync_at` (TIMESTAMPTZ), `status` (`SyncStatus`, Default `IDLE`), `last_error_code` (VARCHAR(100)), `retry_after` (INT), `consecutive_failures` (INT, Default 0), timestamps.
- **Chỉ mục:** `@@index([next_sync_at, status])`.

#### Bảng `sync_runs` (Nhật ký kiểm toán từng lần chạy đồng bộ)
- **Cột:** `id` (PK), `connection_id` (FK -> `provider_connections`), `user_id` (FK -> `users`), `sync_mode` (`SyncMode`), `status` (`SyncStatus`), `started_at`, `completed_at`, `duration_ms` (INT), `cursor_before` (VARCHAR(255)), `cursor_after` (VARCHAR(255)), `records_fetched` (INT, Default 0), `records_inserted` (INT, Default 0), `records_skipped` (INT, Default 0), `error_code`, `error_message` (TEXT), `has_potential_data_gap` (BOOLEAN, Default `false`), `created_at`.
- **Chỉ mục:** `@@index([connection_id, started_at(sort: Desc)])`, `@@index([user_id, started_at(sort: Desc)])`.

---

## 5. Kiến trúc Bảo mật & Mã hóa (Security Design)

- **Mã hóa Token:** Thuật toán mã hóa đối xứng **AES-256-GCM** với khóa `ENCRYPTION_SECRET` (32 bytes) cấu hình qua biến môi trường. Mỗi lần mã hóa sinh ra IV (Initialization Vector) 12 bytes ngẫu nhiên, lưu trữ kèm auth tag để chống can thiệp.
- **Bảo mật API Spotify:**
  - `SPOTIFY_CLIENT_SECRET` chỉ tồn tại tại Backend.
  - Tuyệt đối không trả token về Frontend.
  - Token không bao giờ được xuất hiện trong log hoặc exception message.
- **Bảo mật API Endpoint:**
  - Mọi API dưới `/api/v1` yêu cầu xác thực phiên người dùng (trừ OAuth redirect endpoints).
