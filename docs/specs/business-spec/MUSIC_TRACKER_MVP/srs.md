# Business Spec — Music Tracker MVP (Technical Integration Foundation)

> **Mã chức năng:** `MUSIC_TRACKER_MVP`
> **Nguồn đặc tả gốc:** `Music Tracker — Software Requirements Specification v1.0 (Final).md`
> **Trạng thái:** Final Draft v1.0 — Technical Baseline Approved.

---

## 1. Mục tiêu Nghiệp vụ (Business Objective)

Xây dựng nền tảng kỹ thuật tích hợp đầu tiên cho Music Tracker:
- Kết nối tài khoản Spotify của người dùng qua OAuth 2.0.
- Định kỳ và theo yêu cầu thu thập lịch sử nghe nhạc từ Spotify Recently Played API.
- Chuẩn hóa dữ liệu về mô hình `ListeningEvent` trung lập, trung thực về provenance (không suy diễn dữ liệu phát).
- Chống trùng lặp dữ liệu, quản lý checkpoint tin cậy và khôi phục an toàn sau downtime.
- Cung cấp giao diện quản trị kết nối, tần suất đồng bộ và nhật ký thực thi.

---

## 2. Danh sách Yêu cầu Chức năng (Functional Requirements)

| Mã FR | Tên chức năng | Chi tiết nghiệp vụ cốt lõi | Mức ưu tiên |
|---|---|---|---|
| **FR-01** | Connect Spotify | Luồng OAuth 2.0 Authorization Code Flow qua backend, xin scope `user-read-recently-played`, validate callback, mã hóa token AES-256 lưu vào DB, ghi nhận `CONNECTED`. | Must |
| **FR-02** | Disconnect Spotify | Dừng sync, thu hồi/vô hiệu hóa token, thực hiện quy trình xóa dữ liệu cá nhân theo Developer Terms, chuyển trạng thái `DISCONNECTED`. | Must |
| **FR-03** | Retrieve Recently Played | Gọi `GET /v1/me/player/recently-played`, tối đa 50 item/trang, hỗ trợ tham số `after` (ms), xử lý phân trang cursor `next`, giữ nguyên timestamp `played_at`. | Must |
| **FR-04** | Normalization | Ánh xạ payload Spotify sang `ListeningEvent`. Tách biệt provider ID với domain ID. Các trường thời lượng thực tế (`listenedDurationMs`, `startedAt`, `endedAt`) bắt buộc để `null`. | Must |
| **FR-05** | Scheduled Sync | `@nestjs/schedule` quét mỗi 1 phút tìm connection có `nextSyncAt` đến hạn. Hỗ trợ chu kỳ 15, 30 hoặc 60 phút (mặc định 30 phút). Phân tán job tránh nghẽn. | Must |
| **FR-06** | Manual Sync | Kích hoạt sync tức thì từ UI. Khóa chống chạy đồng thời (concurrency lock) trên cùng connection. Hiển thị kết quả ngay. | Must |
| **FR-07** | Incremental Sync & Checkpoint | Checkpoint là `played_at` mới nhất đã xử lý. Mốc `after = lastProcessedPlayedAt - 2 phút overlap`. Chỉ commit checkpoint sau khi insert DB thành công. | Must |
| **FR-08** | Duplicate Prevention | Khóa unique constraint DB `(connection_id, provider_track_id, played_at)`. Xử lý idempotent, bỏ qua bản ghi đã tồn tại. | Must |
| **FR-09** | Token Refresh | Kiểm tra và tự động refresh token trước khi gọi API hoặc khi gặp 401. Nếu refresh thất bại vĩnh viễn, đặt `REAUTH_REQUIRED`, ngừng retry vô hạn. | Must |
| **FR-10** | Sync Monitoring & Log | Ghi nhận thời điểm thử/thành công gần nhất, số bản ghi nhận/chèn/bỏ qua, mã lỗi, `Retry-After`. Cảnh báo potential data gap nếu có khoảng trống lớn. | Must |

---

## 3. Quy tắc Nghiệp vụ Bắt buộc (Business Rules & Invariants)

1. **Honest Data Rule:** Tuyệt đối không tự suy diễn hay tính toán `startedAt`, `endedAt`, `listenedDurationMs`, `completionRate`. Không coi `played_at` là thời điểm bắt đầu hay kết thúc bài hát.
2. **Policy Blocker Rule:** CẤM triển khai tính năng phân tích thói quen, thống kê top tracks/artists, user taste profile, AI recommendation hoặc chuyển dữ liệu Spotify sang English Hub cho đến khi có xác nhận chính thức bằng văn bản từ Spotify.
3. **Commit Rule:** Request API lỗi hoặc insert DB lỗi KHÔNG ĐƯỢC làm checkpoint tiến lên. Checkpoint chỉ tiến khi toàn bộ bản ghi của trang đã lưu thành công vào PostgreSQL.
4. **Data Isolation:** Toàn bộ logic API và format của Spotify phải đóng gói trong `integrations/spotify/`. Tầng core domain chỉ làm việc với `ListeningEvent`.

