---
name: code-review-backend
description: Thực hiện rà soát chất lượng mã nguồn Backend (NestJS / TypeScript / Prisma) theo 4 chiều chuẩn Enterprise trước khi commit hoặc tạo PR
---

# Skill: Code Review Backend

Kích hoạt ở Bước 5 của procedure `developer-backend` hoặc khi có yêu cầu review lại mã nguồn Server trước khi bàn giao.
Tham chiếu: `docs/srs/music-tracker-srs-v1.0.md`.

---

## 4 Chiều Đánh giá Chi tiết:

### 1. Security (Bảo mật)
- **Hardcoded Secrets:** Quét toàn bộ file thay đổi, đảm bảo không có `SPOTIFY_CLIENT_SECRET`, JWT secret, hay khóa mã hóa bị hardcode.
- **Mã hóa Token at Rest:** Kiểm tra các hàm lưu token vào bảng `provider_connections`, bắt buộc mã hóa AES-256-GCM qua crypto helper.
- **Bảo mật dữ liệu (Data Privacy):** Kiểm tra log console/file, không in raw header `Authorization: Bearer ...` hay payload cá nhân của Spotify ra log.
- **Validate đầu vào:** 100% Request Body/Query phải có DTO class với decorator validation (`class-validator`) và được lọc qua `ValidationPipe`.

---

### 2. Performance & Resilience (Hiệu năng & Độ bền bỉ)
- **Rate Limit Spotify:** Bắt buộc bắt mã HTTP 429 và kiểm tra header `Retry-After` để hoãn request kế tiếp, tránh bị cạn quota rolling 30s.
- **Khử trùng lặp (Deduplication):** Kiểm tra thao tác chèn `ListeningEvent`, sử dụng composite unique key `(providerConnectionId, providerTrackId, playedAt)` với `skipDuplicates: true`.
- **Overlap Buffer:** Kiểm tra tham số `after` khi gọi Recently Played API, đảm bảo có trừ lùi 2 phút để không sót bài hát ở ranh giới checkpoint.
- **Concurrent Lock:** Đảm bảo không cho phép 2 tiến trình sync chạy đồng thời trên cùng một connection.

---

### 3. Correctness & Transaction (Tính Đúng đắn & Toàn vẹn Nghiệp vụ)
- **Honest Data Rule:** Các trường `startedAt`, `endedAt`, `listenedDurationMs`, `completionRate` BẮT BUỘC để `null`. Tuyệt đối không tự suy diễn thời lượng nghe từ `trackDurationMs`.
- **Nguyên tắc Checkpoint:** Checkpoint `lastProcessedPlayedAt` chỉ được commit sau khi lưu CSDL thành công. Lỗi API không được làm checkpoint tiến lên.
- **Cô lập Provider (Provider Isolation):** Các kiểu dữ liệu của Spotify chỉ nằm trong `src/integrations/spotify/`, không rò rỉ vào `modules/listening/`.
- **Chuẩn Envelope API:** 100% response (bao gồm cả HttpExceptionFilter) phải bọc trong envelope `{ code, message, data }`.
- **Xử lý Exception:** Không nuốt lỗi bằng khối `catch` rỗng; ném ngoại lệ có cấu trúc.

---

### 4. Style & Convention (Quy ước Mã nguồn)
- **Ngôn ngữ & Đặt tên:** 100% tên biến, tên hàm, tên class và comment logic dùng tiếng Anh chuẩn theo quy ước tại `docs/guidelines/backend/coding-convention.md`.
- **Phân tầng Modular Monolith:** Tuân thủ thứ tự gọi: `Controller -> Service -> Repository -> Prisma`.
- **Dọn dẹp code:** Loại bỏ các import thừa, cấm kiểu `any`, và xóa bỏ hoàn toàn code comment-out cũ trước khi commit.

---

## Mẫu Báo cáo Đánh giá (Review Output)

```markdown
### Kết quả Review: [APPROVED | CHANGES REQUESTED]

#### Danh sách vấn đề cần điều chỉnh (nếu có):
- **[File:Dòng]** — `[Security | Performance | Correctness | Style]`
  - **Vấn đề:** <Mô tả chi tiết lỗi>
  - **Đề xuất khắc phục:** <Đoạn code sửa lại mẫu>
```
