# Từ điển Thuật ngữ Nghiệp vụ (Domain Glossary) — Music Tracker

> Định nghĩa **Ngôn ngữ chung (Ubiquitous Language)** của dự án Music Tracker.
> Đồng bộ cách hiểu và gọi tên khái niệm giữa Yêu cầu (SRS), Giao diện (Frontend), Mã nguồn (Backend NestJS) và Cơ sở dữ liệu (PostgreSQL/Prisma).
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md`.

---

## 1. Từ viết tắt phổ biến (Acronyms)

| Từ viết tắt | Tên đầy đủ | Giải nghĩa / Vai trò |
|---|---|---|
| **SRS** | Software Requirements Specification | Tài liệu đặc tả yêu cầu phần mềm chính thức |
| **OAuth** | Open Authorization (OAuth 2.0) | Giao thức ủy quyền truy cập API an toàn không chia sẻ mật khẩu |
| **PKCE** | Proof Key for Code Exchange | Cơ chế bảo vệ mở rộng cho OAuth Authorization Code Flow |
| **DTO** | Data Transfer Object | Đối tượng vận chuyển dữ liệu giữa Client và Server |
| **ORM** | Object-Relational Mapping | Công cụ ánh xạ bảng CSDL thành đối tượng code (Prisma) |
| **NFR** | Non-Functional Requirement | Yêu cầu phi chức năng (bảo mật, hiệu năng, độ tin cậy) |
| **FR** | Functional Requirement | Yêu cầu chức năng nghiệp vụ |
| **PoC** | Proof of Concept | Bản thử nghiệm kiểm chứng tính khả thi kỹ thuật |
| **UTC** | Coordinated Universal Time | Giờ phối hợp quốc tế — chuẩn bắt buộc lưu trữ mọi mốc thời gian |
| **ADR** | Architecture Decision Record | Bản ghi nhận các quyết định kiến trúc trọng yếu |
| **DoD** | Definition of Done | Tiêu chuẩn bắt buộc để xác nhận một task đã hoàn thành |

---

## 2. Danh mục Phân hệ / Modules

| Mã Module | Tên phân hệ | Thư mục mã nguồn | Mô tả nghiệp vụ |
|---|---|---|---|
| `PROVIDER` | Provider Management | `src/modules/provider/` | Quản lý kết nối OAuth, lưu trữ token mã hóa, refresh token và ngắt kết nối/xóa dữ liệu |
| `LISTENING` | Listening Domain | `src/modules/listening/` | Quản lý thực thể sự kiện nghe chuẩn hóa `ListeningEvent`, lưu trữ và truy vấn lịch sử nghe |
| `SYNC` | Synchronization Engine | `src/modules/synchronization/` | Lên lịch đồng bộ định kỳ (@nestjs/schedule), kích hoạt manual sync, quản lý checkpoint và dedup |
| `SPOTIFY` | Spotify Integration | `src/integrations/spotify/` | Adapter độc lập giao tiếp Spotify Web API (Recently Played API, Token exchange, Rate limit, Mapping) |

---

## 3. Danh mục Thực thể cốt lõi (Core Entities — 16 Models)

### 3.1. Authentication (3 Models)
| Thuật ngữ | Tên bảng (DB) | Định nghĩa & Ý nghĩa nghiệp vụ |
|---|---|---|
| **User** | `users` | Tài khoản người dùng trong hệ thống (sở hữu catalog và lịch sử nghe riêng biệt) |
| **AuthSession** | `auth_sessions` | Phiên đăng nhập hoạt động của người dùng (theo dõi user-agent, IP, hạn dùng) |
| **AuthToken** | `auth_tokens` | Token xác thực mã hóa một chiều (Refresh Token, Email Verification, Password Reset) |

### 3.2. Provider Management (1 Model)
| Thuật ngữ | Tên bảng (DB) | Định nghĩa & Ý nghĩa nghiệp vụ |
|---|---|---|
| **ProviderConnection** | `provider_connections` | Liên kết ủy quyền OAuth giữa User và Music Provider (lưu token mã hóa AES-256-GCM) |

### 3.3. Canonical Catalog (5 Models)
| Thuật ngữ | Tên bảng (DB) | Định nghĩa & Ý nghĩa nghiệp vụ |
|---|---|---|
| **Artist** | `artists` | Nghệ sĩ chuẩn hóa trong kho nhạc cá nhân của User (định danh độc lập nguồn nhạc) |
| **Album** | `albums` | Album chuẩn hóa trong kho nhạc cá nhân của User |
| **Track** | `tracks` | Bài hát chuẩn hóa trong kho nhạc cá nhân của User (ISRC, tiêu đề, thời lượng) |
| **TrackArtist** | `track_artists` | Bảng liên kết N-N giữa Track chuẩn và Artist chuẩn (kèm vai trò: Primary/Featured) |
| **TrackAlbum** | `track_albums` | Bảng liên kết N-N giữa Track chuẩn và Album chuẩn (kèm số đĩa, số thứ tự bài) |

### 3.4. Provider Catalog (4 Models)
| Thuật ngữ | Tên bảng (DB) | Định nghĩa & Ý nghĩa nghiệp vụ |
|---|---|---|
| **ProviderArtist** | `provider_artists` | Nghệ sĩ theo nguồn cung cấp (Spotify Artist ID, URI, ảnh, metadata gốc) |
| **ProviderAlbum** | `provider_albums` | Album theo nguồn cung cấp (Spotify Album ID, release date, metadata gốc) |
| **ProviderTrack** | `provider_tracks` | Bài hát theo nguồn cung cấp (Spotify Track ID, duration, ISRC, raw metadata) |
| **ProviderTrackArtist** | `provider_track_artists` | Bảng liên kết N-N giữa ProviderTrack và ProviderArtist |

### 3.5. Listening Domain (1 Model)
| Thuật ngữ | Tên bảng (DB) | Định nghĩa & Ý nghĩa nghiệp vụ |
|---|---|---|
| **ListeningEvent** | `listening_events` | Nhật ký sự kiện nghe nhạc thực tế bất biến (Immutable log kèm provenance và Honest Data Rule) |

### 3.6. Synchronization Engine (2 Models)
| Thuật ngữ | Tên bảng (DB) | Định nghĩa & Ý nghĩa nghiệp vụ |
|---|---|---|
| **ProviderSyncState** | `provider_sync_states` | Trạng thái đồng bộ, checkpoint `lastProcessedPlayedAt`, và lịch chạy tiếp theo (1-1 với ProviderConnection) |
| **SyncRun** | `sync_runs` | Lịch sử kiểm toán chi tiết từng đợt chạy đồng bộ (số records fetch/insert/skip, lỗi, cờ data gap) |

---

## 4. Quy ước Enums & Trạng thái chuẩn (System Enums — 8 Enums)

### 4.1. `UserRole`
- `ADMIN`: Quản trị viên hệ thống.
- `USER`: Người dùng thông thường.

### 4.2. `TokenType`
- `REFRESH_TOKEN`: Token làm mới phiên đăng nhập ứng dụng.
- `EMAIL_VERIFICATION`: Token xác minh địa chỉ email đăng ký.
- `PASSWORD_RESET`: Token đặt lại mật khẩu người dùng.

### 4.3. `MusicProvider`
- `SPOTIFY`: Nền tảng Spotify (First provider).
- `APPLE_MUSIC`: Nền tảng Apple Music (Extensibility).
- `YOUTUBE_MUSIC`: Nền tảng YouTube Music (Extensibility).
- `LOCAL_FILE`: Tập tin âm nhạc cục bộ (Extensibility).

### 4.4. `ConnectionStatus`
- `CONNECTED`: Tài khoản đã ủy quyền thành công, token hợp lệ, sẵn sàng đồng bộ dữ liệu.
- `REAUTH_REQUIRED`: Token hết hạn hoặc bị thu hồi trên Spotify, refresh thất bại; cần người dùng cấp quyền lại.
- `DISCONNECTED`: Người dùng chủ động ngắt kết nối; token đã bị thu hồi.

### 4.5. `ArtistRole`
- `PRIMARY`: Nghệ sĩ chính thể hiện bài hát.
- `FEATURED`: Nghệ sĩ khách mời / kết hợp (ft.).
- `PRODUCER`: Nhà sản xuất âm nhạc.
- `REMIXER`: Nghệ sĩ phối lại bản nhạc.

### 4.6. `AlbumType`
- `ALBUM`: Album chính thức.
- `SINGLE`: Đĩa đơn (Single).
- `COMPILATION`: Tuyển tập nhiều nghệ sĩ hoặc tuyển tập đặc biệt.
- `EP`: Đĩa mở rộng (Extended Play).

### 4.7. `SyncMode`
- `AUTO`: Đồng bộ tự động theo chu kỳ định kỳ (15, 30 hoặc 60 phút).
- `MANUAL`: Chỉ đồng bộ khi người dùng bấm nút kích hoạt trên giao diện.

### 4.8. `SyncStatus`
- `IDLE`: Đang chờ đến lịch chạy tiếp theo, không có tiến trình chạy ngầm.
- `RUNNING`: Đang trong quá trình gọi API và xử lý dữ liệu đồng bộ.
- `SUCCESS`: Lần đồng bộ vừa hoàn tất thành công, checkpoint đã được commit an toàn.
- `FAILED`: Gặp lỗi xử lý hoặc lỗi mạng trong quá trình gọi API (không làm tiến checkpoint).
- `RATE_LIMITED`: Bị chặn tạm thời bởi Spotify API (HTTP 429); hệ thống đang chờ hết thời gian `Retry-After`.
- `PARTIAL_SUCCESS`: Đồng bộ được một phần dữ liệu nhưng có cảnh báo hoặc trang kế tiếp bị gián đoạn.

---

## 5. Quy ước Nguồn gốc Dữ liệu & Xử lý Thời gian (Data Provenance & Time)

### 5.1. Phân định các trường Thời gian (Time Fields)
- `playedAt` (Timestamp UTC): Mốc thời gian nghe nhạc do Spotify API trả về. **Không được coi `playedAt` là thời điểm bắt đầu hay kết thúc bài hát**.
- `observedAt` (Timestamp UTC): Mốc thời gian hệ thống Music Tracker gọi API và tiếp nhận bản ghi.
- `createdAt` (Timestamp UTC): Thời điểm bản ghi được ghi thành công vào PostgreSQL.

### 5.2. Các trường BẮT BUỘC để `null` (Honest Data Invariants)
Để đảm bảo dữ liệu trung thực và không bịa đặt những gì Spotify không cung cấp:
- `startedAt` = `null`
- `endedAt` = `null`
- `listenedDurationMs` = `null`
- `startProgressMs` = `null`
- `endProgressMs` = `null`
- `completionRate` = `null`
*(Lưu ý: `trackDurationMs` là thời lượng toàn bài hát từ metadata, không phải thời gian người dùng đã nghe).*

### 5.3. Khóa Chống Trùng lặp (Deduplication Key)
- Khóa duy nhất xác định một sự kiện nghe không bị lặp:
  `providerConnectionId + providerTrackId + playedAt`
