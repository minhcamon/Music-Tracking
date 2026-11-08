# ADR-0004: Chiến lược Đồng bộ Tăng dần, Checkpoint và Chống Trùng lặp

> Chuẩn định dạng: Architecture Decision Record (Michael Nygard).
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 7, Mục 8, Mục 9).

| Thuộc tính | Giá trị |
|---|---|
| **Trạng thái** | `Accepted` |
| **Ngày tạo** | 2026-11-03 |
| **Tác giả / Quyết định bởi** | Solution Architect |
| **Tài liệu liên quan** | `docs/context/architecture.md §3`, `docs/context/scope.md` |

---

## 1. Bối cảnh (Context)

Spotify Recently Played API có các đặc điểm kỹ thuật sau:
- Chỉ trả về tối đa 50 bản ghi gần nhất (`limit=50`).
- Cung cấp tham số `after` (Unix timestamp ms) để lấy các bản ghi sau một mốc thời gian.
- `played_at` là timestamp dạng string do Spotify đánh dấu cho mỗi lần bài hát hoàn tất hoặc kết thúc phát.
- Nếu người dùng nghe nhạc trong khoảng thời gian hệ thống bị downtime hoặc sync ngắt quãng, có nguy cơ bỏ sót bài hát ở ranh giới checkpoint hoặc trùng lặp bản ghi khi gọi lại API.

---

## 2. Quyết định (Decision)

Hệ thống triển khai cơ chế đồng bộ tăng dần (Incremental Sync) với 3 nguyên tắc bất biến:

1. **Định nghĩa Checkpoint:**
   - Checkpoint được định nghĩa là giá trị `played_at` (UTC timestamp) của bản ghi mới nhất đã được **lưu thành công vào cơ sở dữ liệu** (lưu tại cột `last_processed_played_at` trong `provider_sync_states`).
   - Checkpoint **không bao giờ** là thời điểm hệ thống bắt đầu gọi API.
2. **Overlap Buffer (Trừ hao ranh giới):**
   - Khi tính toán tham số `after` cho request tiếp theo: `after = last_processed_played_at - 2 phút` (120,000 ms).
   - Mục đích: Đảm bảo không bao giờ bị rơi rớt các bài hát được nghe sát nút hoặc có độ trễ cập nhật trên hạ tầng Spotify.
3. **Idempotent Deduplication (Chống trùng lặp tuyệt đối):**
   - Thiết lập Composite Unique Constraint trên PostgreSQL: `(connection_id, provider_track_id, played_at)`.
   - Khi insert dữ liệu, sử dụng cơ chế `skipDuplicates: true` hoặc `ON CONFLICT DO NOTHING`.
   - Chỉ cập nhật `last_processed_played_at` và `next_sync_at` trong `provider_sync_states` sau khi transaction lưu toàn bộ danh sách bản ghi mới hoàn tất thành công.
4. **Nhật ký Kiểm toán Tiến trình Đồng bộ (`SyncRun`):**
   - Mọi đợt chạy (Scheduled hoặc Manual) đều ghi nhận một bản ghi vào bảng `sync_runs` với các thông số: thời lượng chạy (`durationMs`), số lượng fetch/insert/skip (`recordsFetched`, `recordsInserted`, `recordsSkipped`), mã lỗi chi tiết và cờ cảnh báo rò rỉ dữ liệu (`hasPotentialDataGap`).

---

## 3. Hệ quả & Đánh đổi (Consequences)

### Tích cực (Pros)
- An toàn tuyệt đối trước sự cố mạng và crash server: Nếu quá trình sync bị lỗi giữa chừng, checkpoint cũ vẫn được giữ nguyên, lần chạy tiếp theo sẽ fetch lại mà không làm mất dữ liệu.
- Idempotency đảm bảo việc chạy manual sync hay lặp job scheduler nhiều lần không sinh ra dữ liệu rác.

### Tiêu cực & Chi phí đánh đổi (Cons / Trade-offs)
- Overlap 2 phút đồng nghĩa với việc mỗi lần sync sẽ luôn kéo lại một vài bản ghi đã tồn tại; tuy nhiên nhờ có unique index tại DB, chi phí xử lý bỏ qua các bản ghi này là không đáng kể ($O(1)$ index lookup).

### Điểm cần theo dõi (Neutral / Follow-up)
- Kiểm chứng thực tế qua PoC xem buffer 2 phút có đủ tối ưu không; nếu phát hiện trường hợp Spotify delay lâu hơn thì cân nhắc điều chỉnh buffer linh hoạt.

