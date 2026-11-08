# ADR-0005: Tuân thủ Chính sách Spotify (Policy Gate) và Nguyên tắc Dữ liệu Trung thực (Honest Data)

> Chuẩn định dạng: Architecture Decision Record (Michael Nygard).
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 1.4, Mục 8.3, Mục 12).

| Thuộc tính | Giá trị |
|---|---|
| **Trạng thái** | `Accepted` |
| **Ngày tạo** | 2026-11-03 |
| **Tác giả / Quyết định bởi** | Solution Architect & Compliance Lead |
| **Tài liệu liên quan** | `docs/context/scope.md §2`, `docs/guidelines/shared/security-policy.md` |

---

## 1. Bối cảnh (Context)

Spotify Developer Policy áp dụng các quy định rất nghiêm ngặt đối với ứng dụng bên thứ ba:
1. Nghiêm cấm phân tích nội dung Spotify hoặc dịch vụ Spotify để tạo ra các chỉ số nghe nhạc phái sinh (derived listening metrics), thống kê sử dụng (usage statistics), hoặc hồ sơ sở thích người dùng (user taste profile).
2. Nghiêm cấm đưa dữ liệu Spotify vào các mô hình AI/Machine Learning để huấn luyện hoặc xử lý phái sinh.
3. Hạn chế nghiêm ngặt việc chuyển giao dữ liệu người dùng Spotify sang các dịch vụ khác bên ngoài.
4. Spotify Web API không cung cấp thời điểm bắt đầu nghe, thời điểm kết thúc nghe hay thời lượng nghe thực tế của người dùng đối với một bài hát (chỉ cung cấp `played_at` và `duration_ms` là độ dài gốc của bản ghi).

---

## 2. Quyết định (Decision)

Hệ thống thiết lập 2 nguyên tắc kiến trúc mang tính pháp lý và kỹ thuật cốt lõi:

1. **Nguyên tắc Dữ liệu Trung thực (Honest Data Principle):**
   - Không tự suy diễn hay tính toán bất kỳ trường dữ liệu nào mà Spotify không cung cấp.
   - Các trường `startedAt`, `endedAt`, `listenedDurationMs`, `startProgressMs`, `endProgressMs`, `completionRate` **BẮT BUỘC ĐỂ GIÁ TRỊ NULL** trên cơ sở dữ liệu.
   - `played_at` được giữ nguyên vẹn dưới dạng UTC timestamp, không được gán ghép là thời điểm bắt đầu hay kết thúc nghe.

2. **Cổng Kiểm soát Chính sách (Spotify Policy Gate — Release Blocker):**
   - **KHÓA TOÀN BỘ** các tính năng Analytics, Listening Intelligence, User Profiling, AI Analysis đối với dữ liệu thu thập từ Spotify trong giai đoạn MVP.
   - **CẤM CHUYỂN DỮ LIỆU** có nguồn gốc Spotify sang English Hub hoặc bất kỳ hệ sinh thái đối tác nào.
   - Nếu trong tương lai Spotify không cấp văn bản chấp thuận cho việc analytics cá nhân, kiến trúc Adapter độc lập sẽ cho phép hệ thống ưu tiên các nguồn dữ liệu mở (Local files, Apple Music, YouTube Music) cho tính năng analytics mà không cần sửa đổi kiến trúc lõi.

---

## 3. Hệ quả & Đánh đổi (Consequences)

### Tích cực (Pros)
- Bảo vệ sản phẩm tuyệt đối khỏi rủi ro bị Spotify thu hồi Client ID hoặc đình chỉ ứng dụng vì vi phạm điều khoản nhà phát triển (Developer Terms).
- Kiến trúc dữ liệu trong sạch, phân định rành mạch giữa dữ liệu thực tế do provider cung cấp và dữ liệu tự sinh.

### Tiêu cực & Chi phí đánh đổi (Cons / Trade-offs)
- Người dùng chưa thể xem biểu đồ thống kê top bài hát hay phân tích thể loại âm nhạc từ dữ liệu Spotify ngay trong bản phát hành đầu tiên.

### Điểm cần theo dõi (Neutral / Follow-up)
- Tiếp tục theo dõi và gửi văn bản yêu cầu Spotify xem xét mục đích sử dụng cá nhân phi thương mại để mở khóa tính năng Analytics trong các phiên bản tiếp theo.

