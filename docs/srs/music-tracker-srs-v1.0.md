# Music Tracker — Software Requirements Specification v1.0 (Final)

**Trạng thái:** Final draft — phạm vi kỹ thuật đã chốt, policy clearance của Spotify đang chờ xác nhận **Cập nhật:** 03/11/2026 **Loại sản phẩm:** Personal Music Activity Tracker (nền tảng độc lập) **Provider đầu tiên:** Spotify (Web API) **Tên sản phẩm:** Music Tracker là tên làm việc. Các ứng viên đặt tên lại: LexiListen, LexiHear (chưa chốt)

## 1. Vision

### 1.1. Product Vision

Music Tracker là một nền tảng cá nhân, độc lập, giúp người dùng **hiểu thói quen nghe nhạc của chính mình** trên nhiều nguồn khác nhau. Sản phẩm thu thập lịch sử nghe từ các provider, chuẩn hóa về một mô hình dữ liệu thống nhất và lưu giữ lâu dài dưới quyền kiểm soát của người dùng.

**Vision statement:** *Một nơi duy nhất để hiểu bạn đã nghe gì, khi nào và như thế nào, bất kể bạn nghe ở đâu.*

### 1.2. Mission

Biến lịch sử nghe nhạc rải rác ở nhiều dịch vụ thành một bộ dữ liệu thống nhất, trung thực về nguồn gốc, không suy diễn những gì provider không cung cấp, và tôn trọng chính sách của từng nền tảng.

### 1.3. Music Tracker là gì và không là gì

| Là | Không là |
| --- | --- |
| Công cụ theo dõi và quản lý lịch sử nghe đa nguồn | Dịch vụ streaming hoặc trình phát nhạc |
| Nền tảng dữ liệu nghe nhạc có provenance rõ ràng | Sản phẩm thay thế Spotify, Apple Music, YouTube Music |
| Hỗ trợ nhạc Việt, nhạc Anh và mọi ngôn ngữ bình đẳng | Công cụ chỉ dành cho học tiếng Anh |

### 1.4. Mục tiêu lớn hơn: vai trò trong hệ sinh thái English Learning

Music Tracker là một trong ba nền tảng của **Personal English Learning Ecosystem**, cùng với LocalRead (đọc sách) và English Hub (quản lý quá trình học tiếng Anh).

**Khẳng định về tính độc lập:**

1. Music Tracker là **một dự án độc lập hoàn chỉnh**, có backend, database, API và giao diện riêng.
2. Music Tracker **vẫn đầy đủ chức năng tracking** ngay cả khi English Hub không tồn tại.
3. Music Tracker **không bị giới hạn bởi mục tiêu học tiếng Anh**. Nhạc Việt và nhạc ngôn ngữ khác được đối xử ngang với nhạc Anh.
4. Music Tracker sở hữu dữ liệu nghe nhạc và nghiệp vụ liên quan. English Hub chỉ là một **consumer tùy chọn** qua API có versioning và xác thực.
5. Không có phụ thuộc ngược: Music Tracker không import code, không chia sẻ database và không yêu cầu English Hub để chạy.

**Cách English Hub sử dụng Music Tracker (tương lai):** lấy các dữ liệu phục vụ việc học như English tracks, learning segments, lyrics có nguồn hợp lệ, vocabulary và shadowing sessions.

**Lưu ý policy:** Dữ liệu có nguồn gốc Spotify **không được phép** chuyển sang English Hub cho đến khi có xác nhận chính sách (xem mục 12). Với các nguồn khác như file nhạc cục bộ, việc tích hợp English Hub không bị hạn chế bởi chính sách này.

## 2. Product Idea và tham chiếu

### 2.1. Ý tưởng sản phẩm

Người dùng nghe nhạc trên nhiều dịch vụ, nhưng lịch sử nghe nằm rải rác, mỗi nơi một định dạng và một giới hạn. Music Tracker giải quyết bằng ba ý tưởng cốt lõi:

1. **Multi-source ingestion:** mỗi provider có một Adapter riêng lo xác thực, thu thập và chuẩn hóa dữ liệu.
2. **Unified model:** mọi nguồn được đưa về cùng một mô hình, trung tâm là `ListeningEvent`, kèm Track Identity Resolution và deduplication.
3. **Honest data:** phân biệt dữ liệu quan sát được và dữ liệu ước tính. Trường nào provider không cung cấp thì để `null`, không tự suy diễn.

### 2.2. Câu hỏi sản phẩm hướng tới

- Nghe gì, vào thời điểm nào và trong bao lâu?
- Một bài hát được nghe bao nhiêu lần?
- Thói quen nghe thay đổi thế nào theo ngày, tuần, tháng?
- Nghệ sĩ, album và thể loại nào được nghe nhiều nhất?
- Gu âm nhạc thay đổi ra sao theo thời gian?

Các câu hỏi liên quan đến analytics với dữ liệu Spotify đang bị chặn bởi policy gate (mục 12). Với MVP hiện tại, phạm vi của tài liệu này là nền tảng thu thập và đồng bộ.

### 2.3. Tham chiếu ý tưởng (inspiration)

Các tham chiếu dưới đây dùng để định hướng ý tưởng, không phải đặc tả để sao chép. Cần kiểm tra điều khoản của từng dịch vụ trước khi dựa vào chúng.

| Tham chiếu | Điều học được |
| --- | --- |
| Last.fm (scrobbling) | Mô hình ghi nhận lịch sử nghe đa nguồn thành một hồ sơ thống nhất |
| ListenBrainz | Hướng mở, dữ liệu nghe thuộc về người dùng, định danh track chuẩn hóa |
| Các công cụ thống kê Spotify (như stats.fm) | Nhu cầu thực tế về thống kê nghe nhạc cá nhân, đồng thời là lời nhắc về rủi ro phụ thuộc một provider |
| Spotify Web API (Recently Played) | Nguồn dữ liệu đầu tiên và các giới hạn thực tế của nó |

Tài liệu chính thức: xem mục 17.

### 2.4. Music Intelligence Roadmap

**Level 1 — Listening Intelligence:** thời lượng và tần suất nghe, xu hướng ngày/tuần/tháng, top tracks/artists/albums, repeat rate, phân bố genre và ngôn ngữ khi có metadata đáng tin cậy.

**Level 2 — Music Content Intelligence:** nhận diện ngôn ngữ, phân tích genre/mood/tempo, lyrics có nguồn hợp lệ, trích xuất vocabulary và expressions.

Ưu tiên hoàn thiện tracking trước, analytics sau, AI phân tích nội dung sau cùng. Mọi level đều tuân thủ policy của từng provider.

## 3. Scope

### 3.1. In scope (MVP — Technical Integration Foundation)

- Spotify OAuth: kết nối và ngắt kết nối tài khoản.
- Tích hợp Recently Played API.
- Ingestion và normalization listening events (chịu policy gate).
- Đồng bộ định kỳ và thủ công.
- Quản lý checkpoint và chống trùng lặp.
- Token refresh và xử lý lỗi API.
- Trạng thái tích hợp và log đồng bộ.
- Giao diện web quản lý kết nối và đồng bộ.

### 3.2. Out of scope

- Phát nhạc, điều khiển phát và Spotify Web Playback SDK.
- Agent theo dõi nền trên mobile.
- Phát hiện chính xác thời điểm bắt đầu/kết thúc phát.
- Đo thời lượng nghe thực tế và completion rate.
- Gợi ý hoặc phân tích bằng AI.
- Analytics và user profile dựa trên dữ liệu Spotify (chờ policy clearance).
- Chuyển dữ liệu có nguồn gốc Spotify sang English Hub.
- Apple Music, YouTube Music, local music (giai đoạn sau, qua Adapter độc lập).

### 3.3. Phân kỳ

| Giai đoạn | Nội dung |
| --- | --- |
| MVP | Kết nối Spotify, token lifecycle, Adapter, Recently Played client, normalization, scheduler, manual sync, checkpoint, dedup, log, disconnect và xóa dữ liệu |
| Post-MVP (có điều kiện) | Playback State polling, listening analytics và profiles (nếu được cho phép), tích hợp English Hub (nếu được phép chuyển dữ liệu), thêm provider khác |

## 4. Tech Stack

**Trạng thái:** đã chốt làm baseline kỹ thuật cho SRS v1.0.

| Layer | Technology |
| --- | --- |
| **Frontend** | React + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Routing | React Router |
| Server State | TanStack Query |
| **Backend** | NestJS + TypeScript, Modular Monolith, Node.js LTS |
| ORM và migration | Prisma (Prisma Migrate) |
| Database | PostgreSQL |
| Scheduler | `@nestjs/schedule` |
| OAuth | Passport + OAuth2 libraries |
| API | REST, versioning `/api/v1` |
| API Docs | Swagger (`@nestjs/swagger`) |
| Testing | Jest |
| Deployment | Docker Compose + VPS |

**Đề xuất chờ xác nhận:**

- HTTP client: native Fetch (Node 18+ có sẵn, ít dependency) thay vì Axios.
- Validation: class-validator (tích hợp `ValidationPipe` và Swagger). Chỉ chọn Zod nếu muốn chia sẻ schema với frontend.

**Hoãn quyết định (Deferred):** CI/CD, monitoring và logging stack, secret management, frontend testing (Vitest + Testing Library), ESLint/Prettier, thư viện biểu đồ (shadcn/ui Chart dựa trên Recharts là lựa chọn tự nhiên). Phần frontend còn mục cân nhắc chưa được mô tả đầy đủ, cần bổ sung sau.

**Ràng buộc kiến trúc:**

1. Modular Monolith, chưa cần Redis, Kafka hay microservices.
2. Domain model trung lập với provider. Chỉ `integrations/spotify` được biết cấu trúc dữ liệu Spotify.
3. Mỗi Adapter khai báo rõ capabilities của provider.
4. Các trường `startedAt`, `endedAt`, `listenedDurationMs`, `device` là nullable.
5. Nếu chạy nhiều instance, `@nestjs/schedule` cần cơ chế khóa (ví dụ PostgreSQL advisory lock). Unique constraint vẫn là lớp bảo vệ cuối.
6. Passport chỉ lo bước authorization code. Việc lưu token mã hóa và refresh là code của module `provider-token`.

**Cấu trúc module:**

```text
modules/
├── provider/          (connection, token)
├── listening/         (listening-event, repository)
└── synchronization/   (scheduler, service, processor, sync-state)

integrations/
└── spotify/           (client, adapter, mapper, types)
```

## 5. System Overview

### 5.1. Nguyên tắc kiến trúc

1. **Spotify-first, not Spotify-dependent:** logic riêng của Spotify nằm trong Adapter.
2. **Provider independence:** entity lõi không phụ thuộc field của Spotify.
3. **Backend-driven collection:** đồng bộ chạy độc lập với frontend.
4. **Idempotent ingestion:** đồng bộ lặp lại không tạo bản ghi trùng.
5. **Data provenance:** phân biệt dữ liệu provider quan sát và dữ liệu do tracker sinh ra.
6. **No unsupported inference:** thông tin phát nhạc thiếu thì giữ là unknown.
7. **Policy compliance:** chỉ yêu cầu, lưu, hiển thị và xử lý dữ liệu cho mục đích được phép.

### 5.2. Kiến trúc tổng quan

```text
Frontend (React)
      |
      v
Backend (NestJS)
      |
      +--------------------+
      |                    |
      v                    v
Provider Management    Sync Scheduler
      |                    |
      v                    v
Spotify Adapter <----- Sync Job
      |
      v
Spotify Web API
      |
      v
Normalization -> Deduplication -> Persistence -> PostgreSQL
```

### 5.3. Nguồn phát được hỗ trợ

Tích hợp dựa trên lịch sử nghe của tài khoản Spotify đã xác thực, không phải một client cụ thể. Nghe trên Mobile, Desktop, Web Player hoặc thiết bị Spotify Connect có thể xuất hiện trong Recently Played. Mức độ bao phủ phải được kiểm chứng bằng PoC. Hệ thống không cam kết nhìn thấy mọi phiên phát.

## 6. External API Requirements

### 6.1. Endpoint chính

`GET /v1/me/player/recently-played`, scope bắt buộc `user-read-recently-played`.

| Tham số | Mô tả |
| --- | --- |
| `limit` | Số bản ghi, tối đa 50 |
| `after` | Unix timestamp (ms), lấy bản ghi sau mốc này |
| `before` | Unix timestamp (ms), lấy bản ghi trước mốc này |

`after` và `before` loại trừ nhau. Phản hồi có `items`, `cursors`, `next` và thông tin phân trang; implementation phải đi theo thông tin phân trang trả về. Endpoint hiện không hỗ trợ podcast episodes.

### 6.2. Dữ liệu trả về (`PlayHistoryObject`)

- **Track:** `id`, `name`, `uri`, `duration_ms`, `explicit`, `external_urls`, `artists[]`, `album` (id, name, release\_date, images\[\]).
- **Lịch sử nghe:** `played_at`, `context` (type, uri, href, external\_urls).

Implementation phải xử lý field nullable, thiếu, deprecated hoặc thay đổi.

### 6.3. Playback State (mở rộng tương lai)

`GET /v1/me/player` và `GET /v1/me/player/currently-playing` (`is_playing`, `progress_ms`, `item`, `device`, `timestamp`, `context`). Không thuộc MVP. Đây chỉ là snapshot, không phải lịch sử phát, và chỉ được đánh giá nếu có quyền thu thập và sử dụng dữ liệu cho mục đích sản phẩm.

## 7. Functional Requirements

| ID | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-01 | **Connect Spotify:** OAuth 2.0 Authorization Code Flow qua backend, chỉ xin scope tối thiểu, validate callback, đổi code lấy token, lưu token an toàn, ghi provider account ID và trạng thái, hiển thị trạng thái kết nối | Must |
| FR-02 | **Disconnect Spotify:** dừng đồng bộ, thu hồi hoặc vô hiệu hóa credential, xóa Spotify Personal Data theo Developer Terms và Policy, chặn request tiếp theo, cập nhật trạng thái | Must |
| FR-03 | **Retrieve Recently Played:** dùng access token của người dùng, tối đa 50 bản ghi mỗi trang, hỗ trợ incremental theo timestamp và phân trang, xử lý phản hồi rỗng và metadata null, giữ nguyên `played_at`, không coi `played_at` là thời điểm bắt đầu hay kết thúc | Must (chịu policy gate) |
| FR-04 | **Normalize:** ánh xạ sang entity độc lập provider, phân biệt provider identity, track identity, metadata, timestamp, context và provenance. ID và URI của Spotify chỉ là source reference | Must (chịu policy gate) |
| FR-05 | **Scheduled Sync:** scheduler kiểm tra mỗi 1 phút các connection có `nextSyncAt` đến hạn, không gọi Spotify mỗi phút cho mọi tài khoản. Interval tự động 15/30/60 phút, mặc định 30 phút, có chế độ chỉ thủ công. Phân tán job để tránh dồn request | Must |
| FR-06 | **Manual Sync:** đồng bộ ngay không chờ lịch, chặn job đồng thời cho cùng connection, hiển thị kết quả, dùng cùng logic checkpoint và dedup | Must |
| FR-07 | **Incremental Sync:** nạp checkpoint đã commit, tính mốc `after` có thể trừ overlap (ban đầu 2 phút, cần kiểm chứng), gọi Recently Played, theo phân trang, normalize và validate, insert idempotent, chỉ commit checkpoint sau khi lưu thành công. Checkpoint là `played_at` mới nhất đã xử lý, không phải thời điểm gọi API | Must |
| FR-08 | **Duplicate Prevention:** khóa `provider_connection_id + provider_track_id + played_at` với unique constraint (Prisma `@@unique`). Nghe lại cùng bài ở thời điểm khác tạo event riêng. Đây là khóa kỹ thuật tự thiết kế, không phải ID chính thức của Spotify | Must |
| FR-09 | **Token Refresh:** refresh khi hoặc trước khi hết hạn, không bao giờ lộ token ra frontend, xử lý lỗi refresh, đặt `REAUTH_REQUIRED` khi cần, không retry vô hạn với credential hỏng vĩnh viễn | Must |
| FR-10 | **Sync Monitoring:** ghi lần thử và lần thành công gần nhất, `lastProcessedPlayedAt`, `nextSyncAt`, trạng thái, số bản ghi nhận/chèn/bỏ qua trùng, loại lỗi và HTTP status. Log không lưu Spotify Personal Data hay nguyên response không cần thiết | Must |

## 8. Data Requirements

### 8.1. ProviderConnection

`id`, `userId`, `provider` (`SPOTIFY`), `providerUserId`, `accessTokenEncrypted`, `refreshTokenEncrypted`, `tokenExpiresAt`, `scopes`, `status` (`CONNECTED`, `REAUTH_REQUIRED`, `DISCONNECTED`), `connectedAt`, `updatedAt`.

### 8.2. ListeningEvent

`id`, `providerConnectionId`, `provider`, `providerTrackId`, `trackName`, `artistReferences`, `albumReference`, `trackDurationMs`, `providerUri`, `providerUrl`, `coverArtUrl`, `playedAt`, `contextType`, `contextUri`, `observedAt`, `createdAt`.

### 8.3. Trường không được tự suy diễn

| Field | Hành vi MVP |
| --- | --- |
| `startedAt`, `endedAt` | `null` |
| `listenedDurationMs` | `null` |
| `startProgressMs`, `endProgressMs` | `null` |
| `completionRate` | Không tính |

`trackDurationMs` là độ dài cả bài hát, không phải thời gian đã nghe. Không suy ra thời lượng nghe từ `playedAt` hay `trackDurationMs`.

### 8.4. ProviderSyncState

`id`, `providerConnectionId`, `syncMode` (`AUTO`, `MANUAL`), `syncIntervalMinutes` (15/30/60), `lastSyncAttemptAt`, `lastSuccessfulSyncAt`, `lastProcessedPlayedAt`, `nextSyncAt`, `syncStatus` (`SUCCESS`, `FAILED`, `RATE_LIMITED`, `PENDING`), `lastErrorCode`, `retryAfter`.

### 8.5. Data provenance

Mỗi bản ghi từ provider giữ nguồn gốc và provenance. Hệ thống phân biệt: trường provider quan sát, trường vận hành do Music Tracker sinh, trường ước tính, và trường unknown. Dữ liệu riêng của provider không được trình bày như định danh đã xác minh xuyên provider.

## 9. Synchronization Workflow

```text
Scheduler -> tìm connection đến hạn -> kiểm tra trạng thái -> refresh token nếu cần
 -> nạp ProviderSyncState -> tính mốc after -> gọi Recently Played
 -> xử lý các trang -> normalize -> deduplicate -> lưu bản ghi mới
 -> commit checkpoint -> cập nhật trạng thái -> lên lịch lần kế tiếp
```

**Quy tắc checkpoint:**

- Chỉ tiến checkpoint sau khi lưu thành công. Request lỗi không làm checkpoint tiến.
- Lỗi xử lý một phần phải an toàn khi retry.
- Dùng overlap để giảm rủi ro mất bản ghi ở ranh giới.
- Trang đủ 50 bản ghi kích hoạt xử lý phân trang theo phản hồi API.
- Nếu khoảng trống vượt quá lịch sử còn truy xuất được, ghi nhận potential data gap thay vì khẳng định đã khôi phục đầy đủ.

**Khôi phục sau downtime:** khi backend khởi động lại, tìm connection quá hạn, nạp checkpoint, thử incremental sync, dedup và ghi nhận khoảng trống không khôi phục được. Hệ thống không bảo đảm khôi phục đầy đủ nếu Spotify không còn cung cấp lịch sử cũ.

## 10. Error Handling

| Điều kiện | Hành vi |
| --- | --- |
| 200 | Xử lý phản hồi |
| 204 | Coi là rỗng khi phù hợp |
| 400 | Log lỗi request, không retry mù quáng |
| 401 | Thử refresh token, yêu cầu cấp quyền lại nếu thất bại |
| 403 | Đánh dấu vấn đề quyền truy cập |
| 404 | Xử lý tài nguyên hoặc endpoint không khả dụng |
| 429 | Tôn trọng `Retry-After`, trì hoãn request kế tiếp |
| 429 QUOTA\_EXCEEDED | Phân biệt cạn quota với rate limit thông thường |
| 5xx | Retry exponential backoff có jitter |
| Network timeout | Retry an toàn, không tiến checkpoint |
| Refresh token không hợp lệ/bị thu hồi | Đặt `REAUTH_REQUIRED` |
| Thiếu metadata | Giữ field có sẵn, không loại bỏ event hợp lệ |

Retry có giới hạn và tránh retry storm.

## 11. User Interface Requirements

**Connection Settings:** kết nối/ngắt kết nối Spotify, xem trạng thái, xem quyền đã cấp khi khả thi, xem lần đồng bộ gần nhất và kế tiếp, kích hoạt đồng bộ thủ công.

**Sync Settings:** tự động mỗi 15, 30 hoặc 60 phút, hoặc chỉ thủ công. Mặc định 30 phút.

**Sync Status:** phân biệt Connected and synchronized, Pending, Failed, Rate limited, Reauthorization required, Disconnected. Giao diện không được ngụ ý lịch sử đầy đủ hoặc real-time khi Spotify không bảo đảm.

## 12. Compliance và Policy Gate

**Release blocker.** Spotify Developer Policy hiện cấm phân tích Spotify Content hoặc Spotify Service để tạo chỉ số nghe nhạc phái sinh, usage statistics, user metrics, benchmarking hoặc user profiles, cấm đưa Spotify Content vào mô hình AI/ML, và hạn chế chuyển dữ liệu sang dịch vụ khác. Không được giả định dự án cá nhân được miễn trừ. Cần xác nhận bằng văn bản từ Spotify.

**Các năng lực bị khóa cho dữ liệu Spotify cho đến khi có xác nhận:** chỉ số nghe phái sinh, analytics hành vi nghe, user taste profile, benchmarking và usage statistics, xử lý AI/ML, chuyển dữ liệu sang English Hub hoặc dịch vụ khác (trừ ngoại lệ được cho phép rõ ràng).

**Chiến lược dự phòng:** nếu Spotify không cho phép, giữ Spotify Adapter ở vai trò giới hạn và ưu tiên các nguồn dữ liệu khác (file nhạc cục bộ, Apple Music, YouTube Music) cho analytics. Kiến trúc Adapter độc lập được thiết kế để điều này không phải viết lại hệ thống.

**Development Mode (cần kiểm tra lại trước triển khai):** chủ app cần Spotify Premium, tối đa 5 người dùng trong allowlist, có quota riêng ngoài rate limit rolling window, nhiều Client ID của cùng một developer dùng chung quota. Rate limit tính theo cửa sổ 30 giây.

**Quyền riêng tư:** có chính sách quyền riêng tư rõ ràng, chỉ xin quyền cần thiết, người dùng có thể ngắt kết nối. Khi ngắt kết nối hoặc yêu cầu dừng xử lý, dữ liệu cá nhân Spotify áp dụng phải bị xóa và không còn được yêu cầu hay xử lý. Thời gian lưu giữ chỉ ở mức cần thiết và được phép.

## 13. Non-Functional Requirements

- **NFR-01 Security:** chỉ dùng HTTPS với Spotify, token mã hóa at rest, client secret chỉ ở backend, token không xuất hiện trong log, chỉ chủ sở hữu truy cập provider connection.
- **NFR-02 Reliability:** đồng bộ idempotent, job lỗi không làm hỏng checkpoint, scheduler khôi phục job quá hạn sau restart, lỗi ở một connection không chặn connection khác.
- **NFR-03 Maintainability:** logic Spotify nằm trong Adapter, entity lõi không phụ thuộc class của Spotify, mapping API tách khỏi domain, hỗ trợ Adapter tương lai.
- **NFR-04 Time Handling:** lưu UTC, giữ độ chính xác millisecond, UI có thể hiển thị theo múi giờ người dùng, `playedAt`, `observedAt`, `createdAt` là các trường riêng.
- **NFR-05 Observability:** ghi trạng thái job, số request API, HTTP status, số lần retry, số bản ghi chèn và bỏ qua, thời gian đồng bộ, potential data gap. Không giữ Spotify Content hay credential không cần thiết trong log.

## 14. Acceptance Criteria

Nền tảng tích hợp được chấp nhận về mặt kỹ thuật khi:

1. Người dùng hoàn tất được Spotify OAuth.
2. Backend lưu và refresh token an toàn.
3. Gọi được Recently Played với scope yêu cầu.
4. Adapter ánh xạ đúng track, artist, album, timestamp và context.
5. Đồng bộ chạy được khi frontend không mở.
6. Scheduler nhận diện connection đến hạn và thực thi job.
7. Đồng bộ lặp lại không tạo event trùng.
8. Checkpoint chỉ tiến sau khi lưu thành công.
9. Khôi phục được job quá hạn sau downtime.
10. Rate limit, quota và lỗi token được xử lý an toàn.
11. Người dùng ngắt kết nối và kích hoạt được quy trình xóa dữ liệu.
12. Dữ liệu thiếu về start/end/duration không bị bịa ra.
13. Code riêng của provider được cô lập khỏi domain lõi.

Tính năng analytics dựa trên dữ liệu Spotify không được phát hành cho đến khi policy gate được giải quyết.

## 15. Risks và Open Questions

| ID | Rủi ro / Câu hỏi | Trạng thái |
| --- | --- | --- |
| R-01 | Use case lịch sử nghe và analytics cá nhân có được Spotify Developer Policy cho phép? | Blocking |
| R-02 | Cửa sổ lịch sử Spotify thực sự cho truy xuất là bao lâu? | Cần test |
| R-03 | Recently Played có phản ánh nhất quán hoạt động mobile, desktop, Connect? | Cần test |
| R-04 | Điều gì xảy ra khi nhiều lượt phát trùng độ chính xác timestamp? | Cần test |
| R-05 | Xử lý downtime dài và khoảng trống lịch sử không khôi phục được | Ràng buộc thiết kế |
| R-06 | Interval mặc định 30 phút có đủ cho thói quen sử dụng? | Giả định ban đầu |
| R-07 | Trường dữ liệu Spotify nào được giữ và trong bao lâu? | Cần review policy |
| R-08 | Có thể đưa dữ liệu phái sinh từ Spotify qua English Hub API không? | Blocking |
| R-09 | Chưa chốt tên sản phẩm chính thức (Music Tracker, LexiListen, LexiHear) | Mở |
| R-10 | Chưa chốt HTTP client và thư viện validation | Chờ xác nhận |

**PoC kỹ thuật khuyến nghị trước khi triển khai production:** kiểm tra OAuth và refresh, mức hiển thị của phát nhạc trên mobile/desktop/web, hành vi phân trang, độ chính xác timestamp và xử lý bài lặp, hành vi sau nhiều giờ downtime, hành vi quota của Development Mode. Không dùng PoC để mặc định có quyền thực hiện analytics bị cấm.

## 16. Release Scope và các bước tiếp theo

**MVP — Technical Integration Foundation:** Spotify OAuth, token lifecycle an toàn, Spotify Adapter, Recently Played client, normalization, scheduler, manual sync, checkpoint và dedup, xử lý lỗi và log đồng bộ, disconnect và xóa dữ liệu. **Điều kiện phát hành:** policy review của Spotify xác nhận việc thu thập, lưu trữ và hiển thị dữ liệu dự kiến là được phép.

**Thứ tự ưu tiên:** (1) Spotify API PoC, (2) Policy Clearance bằng văn bản, (3) Sync Engine Design, (4) triển khai backend đầy đủ.

## 17. Official References

1. [Get Recently Played Tracks](https://developer.spotify.com/documentation/web-api/reference/get-recently-played)
2. [Authorization](https://developer.spotify.com/documentation/web-api/concepts/authorization)
3. [Scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes)
4. [Rate Limits](https://developer.spotify.com/documentation/web-api/concepts/rate-limits)
5. [Quota Modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)
6. [Spotify Developer Policy](https://developer.spotify.com/policy)
7. [Spotify Developer Terms](https://developer.spotify.com/terms)

**Hết tài liệu — Music Tracker SRS v1.0 (Final)**
