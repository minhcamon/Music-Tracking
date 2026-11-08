# Scope Contract & Boundary Guard

> Tài liệu xác lập ranh giới bất biến của dự án (Scope Truth) cho **Music Tracker MVP**.
> AI Agent **BẮT BUỘC** kiểm tra ranh giới tại file này trước khi thực hiện feature mới, kiến trúc mới, thêm dependency hoặc thay đổi data model.
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 3, 7, 8, 12, 16).

---

## 1. Phạm vi Hiện tại (In Scope — MVP: Technical Integration Foundation)

*Các tính năng, định dạng và luồng nghiệp vụ ĐƯỢC PHÉP thực thi trong phiên bản MVP:*

- [x] **FR-01: Connect Spotify (OAuth 2.0):**
  - Luồng Authorization Code Flow hoàn toàn qua Backend.
  - Xin scope tối thiểu: `user-read-recently-played`.
  - Validate state callback, đổi authorization code lấy access token + refresh token.
  - Lưu trữ token mã hóa an toàn trong CSDL (`ProviderConnection`), ghi nhận `providerUserId` và trạng thái `CONNECTED`.
- [x] **FR-02: Disconnect Spotify & Data Purge:**
  - Dừng các tác vụ đồng bộ nền ngay lập tức.
  - Vô hiệu hóa/thu hồi credential.
  - Thực hiện quy trình xóa dữ liệu cá nhân Spotify theo Spotify Developer Terms.
  - Chuyển trạng thái kết nối sang `DISCONNECTED`.
- [x] **FR-03: Retrieve Recently Played API Client:**
  - Endpoint: `GET /v1/me/player/recently-played`.
  - Hỗ trợ tham số `after` (timestamp ms) phục vụ incremental sync.
  - Giới hạn tối đa 50 bản ghi/trang, xử lý phân trang cursor-based theo URL trả về.
  - Giữ nguyên timestamp `played_at` do Spotify cung cấp.
- [x] **FR-04: Data Normalization (Provider Independence):**
  - Chuẩn hóa payload từ Spotify sang thực thể độc lập `ListeningEvent`.
  - Phân định rõ Provider identity (Spotify ID/URI chỉ là source reference) với Domain identity.
- [x] **FR-05: Scheduled Sync Engine:**
  - Sử dụng `@nestjs/schedule` quét mỗi 1 phút tìm các connection có `nextSyncAt` đến hạn.
  - Tần suất cấu hình: 15, 30 hoặc 60 phút (mặc định 30 phút); có chế độ chỉ đồng bộ thủ công.
  - Phân tán lịch chạy (jitter/offset) để tránh dồn request cùng thời điểm.
- [x] **FR-06: Manual Sync (Đồng bộ tức thì):**
  - Kích hoạt đồng bộ ngay lập tức từ giao diện người dùng.
  - Khóa chống chạy đồng thời (concurrency lock) trên cùng một `providerConnectionId`.
- [x] **FR-07: Incremental Sync & Checkpoint Management:**
  - Checkpoint là `played_at` mới nhất đã xử lý thành công (không phải thời điểm gọi API).
  - Trừ mốc overlap (mặc định 2 phút) khi tính `after` để chống rớt bản ghi ở ranh giới.
  - Chỉ commit checkpoint vào `ProviderSyncState` sau khi lưu CSDL thành công.
- [x] **FR-08: Duplicate Prevention (Khóa chống trùng lặp):**
  - Thiết lập unique constraint DB trên `(providerConnectionId, providerTrackId, playedAt)`.
  - Idempotent upsert/insert bỏ qua bản ghi trùng.
- [x] **FR-09: Token Lifecycle & Auto Refresh:**
  - Tự động refresh token trước khi hết hạn (hoặc khi nhận HTTP 401).
  - Nếu refresh thất bại vĩnh viễn (bị thu hồi): Đặt trạng thái `REAUTH_REQUIRED`, dừng sync tự động, không retry vô hạn.
  - Tuyệt đối không phơi bày access/refresh token ra Frontend hay file log.
- [x] **FR-10: Sync Monitoring & Observability:**
  - Theo dõi trạng thái sync (`SUCCESS`, `FAILED`, `RATE_LIMITED`, `PENDING`).
  - Ghi nhận số bản ghi nhận/chèn/bỏ qua, mã lỗi, `Retry-After`.
  - Phát hiện và ghi nhận Potential Data Gap khi khoảng trống lịch sử vượt quá khả năng khôi phục của Spotify.
- [x] **Web UI Management (React + Vite + Tailwind + shadcn/ui):**
  - Màn hình Connection Settings: Kết nối/ngắt kết nối Spotify, hiển thị trạng thái.
  - Màn hình Sync Settings: Cấu hình tần suất đồng bộ (15/30/60m hoặc manual), nút kích hoạt manual sync.
  - Màn hình Sync History/Status: Trạng thái lần đồng bộ gần nhất/kế tiếp, số bản ghi xử lý, log lỗi.

---

## 2. Ngoài Phạm vi (Out of Scope — CẤM THỰC THI TRONG MVP)

*Các yêu cầu tuyệt đối KHÔNG tự ý triển khai trong giai đoạn hiện tại:*

- ❌ **Phát nhạc & Điều khiển trình phát:** Không tích hợp Spotify Web Playback SDK, không có nút Play/Pause/Skip/Seek.
- ❌ **Agent chạy nền trên Mobile:** Không xây dựng mobile app hay daemon theo dõi trực tiếp từ thiết bị di động.
- ❌ **Tự suy diễn dữ liệu nghe (Inference Prevention):**
  - KHÔNG tính `listenedDurationMs`, `startedAt`, `endedAt`, `completionRate`.
  - Các trường này BẮT BUỘC để `null` trên database.
- ❌ **Tính năng AI / Machine Learning:** Không có recommendation, phân tích ngữ nghĩa, trích xuất từ vựng bằng AI.
- ❌ **Analytics & User Taste Profiles (POLICY BLOCKER):**
  - CẤM phân tích thói quen nghe, thống kê top tracks/artists, tính toán chỉ số nghe phái sinh từ dữ liệu Spotify cho đến khi có văn bản chấp thuận chính thức từ Spotify.
- ❌ **Chuyển dữ liệu Spotify sang English Hub (POLICY BLOCKER):**
  - CẤM export, sync hay truyền dữ liệu nguồn gốc Spotify sang hệ thống English Hub trong MVP.
- ❌ **Provider khác trong MVP:** Apple Music, YouTube Music, Local music files hoãn lại giai đoạn sau.

> [!CAUTION]
> **Boundary Guard Rule:** Nếu nhận được yêu cầu liên quan đến Analytics từ dữ liệu Spotify, chuyển dữ liệu sang English Hub, hoặc xây dựng trình phát nhạc $\rightarrow$ Agent **PHẢI DỪNG LẠI (STOP)**, trích dẫn rào cản chính sách (Mục 12 của SRS v1.0) và từ chối triển khai.

---

## 3. Các Hạng mục Hoãn lại (Deferred / Backlog Candidates)

- ⏳ **Playback State Polling:** Gọi `GET /v1/me/player` để bắt trạng thái realtime (cần đánh giá quyền hạn và policy).
- ⏳ **Listening Analytics Engine (Level 1):** Báo cáo xu hướng nghe ngày/tuần/tháng (chỉ kích hoạt khi qua Policy Gate).
- ⏳ **Music Content Intelligence (Level 2):** Phân tích thể loại, phân tích lời bài hát, trích xuất từ vựng cho English Hub.
- ⏳ **Multi-provider Expansion:** Xây dựng Adapter cho Apple Music, YouTube Music, Local File Scanner.
- ⏳ **English Hub Integration API:** Cung cấp API chuyên dụng cho English Hub tiêu thụ dữ liệu học tập.

---

## 4. Ràng buộc Kỹ thuật Cố định (Hard Constraints)

- **Ngăn xếp Backend:** NestJS + TypeScript, Node.js LTS, PostgreSQL, Prisma ORM, `@nestjs/schedule`, Passport OAuth2.
- **Ngăn xếp Frontend:** React + TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router.
- **Kiến trúc:** Modular Monolith. Domain model trung lập, cô lập mã nguồn Spotify vào `integrations/spotify/`.
- **Bảo mật:**
  - Token mã hóa tại CSDL (AES-256-GCM).
  - Không hardcode client secrets, không in token/personal data ra log.
  - Tôn trọng header `Retry-After` khi gặp HTTP 429.
- **Xử lý thời gian:** Toàn bộ lưu trữ dùng chuẩn UTC với độ chính xác millisecond (`playedAt`, `observedAt`, `createdAt`).

---

## 5. Giới hạn Đã biết (Known Limitations)

- **Giới hạn Spotify Recently Played:** API chỉ trả về tối đa 50 bản ghi gần nhất trong lịch sử nghe. Nếu người dùng nghe quá 50 bài giữa 2 lần sync, các bài vượt quá sẽ bị mất vĩnh viễn (Data Gap).
- **Không hỗ trợ Podcast:** Endpoint `recently-played` của Spotify không hỗ trợ các tập podcast.
- **Development Mode Quotas:** Ứng dụng ở chế độ dev của Spotify giới hạn tối đa 5 người dùng được phê duyệt trong allowlist và áp dụng rate limit cửa sổ rolling 30 giây.
