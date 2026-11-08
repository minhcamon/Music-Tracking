# System Gotchas & Common Pitfalls — Music Tracker

> Tập hợp các "bẫy ngầm" kinh điển và lỗi logic phổ biến nhất trong hệ thống Music Tracker.
> AI Agent **BẮT BUỘC** phải đọc tài liệu này để chủ động phòng tránh các lỗi tiềm ẩn khi sinh mã nguồn.
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md`.

---

## 1. Spotify Web API & Data Tracking Gotchas

### 1.1 Cạm bẫy Tự suy diễn Dữ liệu phát (Fake Inference Trap)
- **Bẫy:** Lấy `track_duration_ms` (độ dài toàn bài từ metadata) hoặc tính hiệu timestamp rồi gán vào `listenedDurationMs` (thời gian đã nghe), hoặc coi `played_at` là thời điểm bắt đầu/kết thúc phát bài hát.
- **Thực tế:** Spotify Recently Played API **không cung cấp** thời điểm bắt đầu nghe thực tế, thời điểm kết thúc nghe thực tế, hay người dùng đã nghe bài hát trong bao lâu.
- **Khắc phục:** Tuyệt đối để `null` các trường `startedAt`, `endedAt`, `listenedDurationMs`, `completionRate`. Không được tự bịa số liệu.

### 1.2 Giới hạn 50 Bản ghi & Khoảng trống Lịch sử (Potential Data Gaps)
- **Bẫy:** Giả định rằng hệ thống có thể khôi phục lại toàn bộ lịch sử nghe sau nhiều ngày server bị downtime bằng cách gọi lặp API.
- **Thực tế:** Endpoint `recently-played` của Spotify chỉ lưu giữ tối đa 50 bản ghi gần nhất. Nếu người dùng nghe quá 50 bài giữa 2 lần sync, các bài vượt quá 50 sẽ **bị mất vĩnh viễn khỏi Spotify API**.
- **Khắc phục:** Khi backend khởi động lại sau thời gian dài ngắt quãng, nhận diện khoảng cách thời gian giữa checkpoint cũ và bài hát cổ nhất trong đợt sync mới. Nếu có khoảng trống, ghi nhận log `POTENTIAL_DATA_GAP` thay vì khẳng định hệ thống đã khôi phục đầy đủ.

### 1.3 Rate Limit HTTP 429 & Development Mode Quota
- **Bẫy:** Khi gặp HTTP 429, retry ngay lập tức hoặc retry mù quáng theo chu kỳ cố định, dẫn tới tài khoản bị Spotify block hoặc cạn quota ứng dụng.
- **Thực tế:** Spotify Development Mode áp dụng rate limit theo cửa sổ rolling 30 giây và giới hạn quota nghiêm ngặt cho mỗi developer.
- **Khắc phục:** 
  - Bắt buộc đọc header `Retry-After` trong response (giá trị tính bằng giây).
  - Tạm dừng tác vụ đồng bộ cho connection đó tối thiểu bằng thời gian `Retry-After`.
  - Cập nhật trạng thái `ProviderSyncState` thành `RATE_LIMITED` và lên lịch `nextSyncAt = NOW() + retryAfter`.

### 1.4 Sai lệch Checkpoint ở Ranh giới Thời gian (Boundary Miss)
- **Bẫy:** Truyền tham số `after = lastProcessedPlayedAt` chính xác đến từng millisecond khi gọi API trang tiếp theo, dẫn tới rớt các bài hát được nghe cùng thời điểm hoặc có độ trễ cập nhật trên hạ tầng Spotify.
- **Khắc phục:** Sử dụng Overlap Buffer: Trừ lùi 2 phút (120,000 ms) từ `lastProcessedPlayedAt` khi tính toán tham số `after`. Ràng buộc unique constraint trên PostgreSQL sẽ loại bỏ các bản ghi trùng lặp một cách an toàn.

---

## 2. Backend NestJS & Prisma Gotchas

### 2.1 Race Condition khi Chạy Đồng bộ Đồng thời (Concurrent Sync Jobs)
- **Bẫy:** Người dùng bấm nút "Manual Sync" trên UI đúng lúc scheduler `@nestjs/schedule` đang kích hoạt tiến trình đồng bộ tự động cho cùng một connection.
- **Khắc phục:** Áp dụng khóa đồng bộ (Execution Mutex / In-memory or DB Lock) cho từng `providerConnectionId`. Nếu một job đang chạy, request manual sync tiếp theo phải trả về thông báo trạng thái `ALREADY_IN_PROGRESS` thay vì chạy đè lên nhau.

### 2.2 Xử lý Lỗi Prisma Unique Constraint (`P2002`)
- **Bẫy:** Thực hiện batch insert với `createMany` thông thường mà không có cờ bỏ qua trùng lặp. Khi gặp bản ghi trùng khóa unique constraint `(providerConnectionId, providerTrackId, playedAt)`, Prisma sẽ throw exception và rollback toàn bộ batch.
- **Khắc phục:** Luôn sử dụng `prisma.listeningEvent.createMany({ data: events, skipDuplicates: true })`.

### 2.3 Rò rỉ Token & Bí mật trong Exception Logs
- **Bẫy:** Bắt lỗi gọi Spotify API hoặc Axios Error rồi ghi log nguyên object `error` ra console. Object này thường chứa toàn bộ Request Headers gồm `Authorization: Bearer <access_token>` hoặc Spotify Client Secret.
- **Khắc phục:** Chỉ log `error.response?.status`, `error.response?.data?.error`, không bao giờ log raw config hoặc raw headers.

### 2.4 Múi giờ UTC vs Giờ Local
- **Bẫy:** Parse chuỗi `played_at` thành Date object mà không chỉ định rõ UTC, dẫn tới server tại các múi giờ khác nhau lưu lệch giờ vào database.
- **Khắc phục:** Toàn bộ cột thời gian trong schema PostgreSQL phải là `@db.Timestamptz`. Prisma và NestJS xử lý toàn bộ thời gian dưới chuẩn UTC. Frontend chỉ format sang múi giờ hiển thị của người dùng ở bước render cuối cùng.

---

## 3. Frontend React & UI Gotchas

### 3.1 Polling Quá tải khi Tab không Active
- **Bẫy:** Cấu hình TanStack Query `refetchInterval: 3000` để theo dõi tiến độ sync nhưng không tắt khi người dùng chuyển sang tab khác, gây lãng phí tài nguyên trình duyệt và request server.
- **Khắc phục:** Sử dụng tính năng `refetchIntervalInBackground: false` của TanStack Query, hoặc chỉ kích hoạt polling ngắn khi trạng thái sync đang là `PENDING`.

### 3.2 Đột biến State Trực tiếp (State Mutation)
- **Bẫy:** Sửa đổi trực tiếp mảng hoặc object trong state (vd: `connection.status = 'DISCONNECTED'`). React không kích hoạt re-render.
- **Khắc phục:** Luôn tạo bản sao bất biến với spread operator: `setConnection({ ...connection, status: 'DISCONNECTED' })`.
