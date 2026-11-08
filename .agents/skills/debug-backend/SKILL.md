---
name: debug-backend
description: Quy trình cô lập lỗi, phân tích log và khắc phục sự cố phía Server NestJS / Prisma theo từng bước
---

# Skill: Debug Backend

Kích hoạt khi người dùng báo lỗi Server, API trả về mã lỗi 500, lỗi đồng bộ Spotify hoặc phát sinh ngoại lệ không mong muốn trong quá trình thực thi mã nguồn Backend NestJS.
Tham chiếu: `docs/srs/music-tracker-srs-v1.0.md`.

---

## Quy trình Xử lý Lỗi 5 Bước:

### Bước 1 — Thu thập Thông tin & Tái hiện Sự cố
1. **Trích xuất thông tin lỗi:**
   - Đọc trọn vẹn Stack Trace từ log NestJS (xác định file TypeScript và dòng gây lỗi).
   - Xác định HTTP Method, Endpoint, Query Params và Request Body.
   - Nếu là lỗi đồng bộ Spotify: Xác định HTTP Status code từ Spotify API (400, 401, 403, 404, 429, 5xx) và error response body (`error.message`).
2. **Xác định trạng thái môi trường:**
   - Môi trường chạy (Local, Dev, Docker Compose).
   - Trạng thái kết nối PostgreSQL và migration Prisma (`prisma migrate status`).
   - Trạng thái token Spotify trong bảng `provider_connections` (`tokenExpiresAt`, `status`).

---

### Bước 2 — Phân tích Nguyên nhân Gốc rễ (Root Cause Analysis - RCA)
1. **Khoanh vùng tầng gây lỗi:**
   - **Tầng Web / Controller:** Lỗi parse JSON, vi phạm validate DTO (`ValidationPipe`), sai kiểu tham số.
   - **Tầng Service / Domain:** Vi phạm logic nghiệp vụ, vi phạm Honest Data rule, checkpoint drift, concurrency race condition.
   - **Tầng Data / Prisma:** Lỗi unique constraint `P2002` (trùng lặp bài hát), lỗi kết nối CSDL, schema chưa migrate.
   - **Tầng Integration / Spotify API:**
     - 401 Unauthorized: Access token hết hạn hoặc refresh token bị thu hồi.
     - 429 Too Many Requests: Vượt quota rolling 30 giây của Development Mode hoặc rate limit (cần đọc `Retry-After`).
     - Null/Missing Metadata: Spotify trả về metadata bài hát không đầy đủ.
2. **Đối chiếu danh mục bẫy lỗi phổ biến:**
   - Tra cứu tại `docs/guidelines/shared/gotchas.md` để kiểm tra các bẫy thường gặp (boundary miss, data gap khi downtime, prisma batch create).

---

### Bước 3 — Đề xuất Phương án & Đánh giá Rủi ro
1. Trình bày ngắn gọn cho người dùng:
   - **Nguyên nhân chính xác:** Ghi rõ file, hàm và dòng code phát sinh lỗi.
   - **Phương án khắc phục:** Cách sửa code hoặc cập nhật cấu hình/migration Prisma.
   - **Phạm vi tác động:** Việc sửa này có làm thay đổi contract API hay ảnh hưởng đến logic checkpoint/sync không?
2. Chờ người dùng xác nhận nếu phương án sửa đổi cấu trúc dữ liệu hoặc logic lớn.

---

### Bước 4 — Sửa lỗi & Viết Test chống Hồi quy (Regression Test)
1. Tiến hành sửa mã nguồn bám sát `docs/guidelines/backend/coding-convention.md`.
2. Viết tối thiểu 1 Unit Test với Jest (mock Spotify API / Prisma) mô phỏng lại đúng payload gây lỗi ban đầu để chứng minh lỗi đã được giải quyết triệt để.
3. Chạy `pnpm run test` để đảm bảo không phá vỡ các tính năng hiện có.

---

### Bước 5 — Cập nhật Trạng thái & Nhật ký
1. Ghi nhận tóm tắt nguyên nhân và cách xử lý vào mục "Vấn đề phát sinh" trong `.agents/state/<dev-id>/progress.md`.
2. Nếu là giải pháp xử lý tạm thời (workaround) cần tối ưu sau: Ghi nhận ngay 1 dòng vào `.agents/state/<dev-id>/tech-debt.md`.
