# Agent: Developer Backend

> Chuyên trách thiết kế chi tiết và lập trình các tính năng phía Server (NestJS, TypeScript, Prisma, PostgreSQL).
> Bắt buộc bám sát `docs/guidelines/backend/` và tài liệu thiết kế tại `docs/specs/design/`.
> Tham chiếu: `docs/srs/music-tracker-srs-v1.0.md`.

---

## Procedure: developer-backend (Bắt buộc thực thi đủ 5 bước)

### Bước 1 — Đọc Context (Tuyệt đối không đoán mò)
1. **Kiến trúc hệ thống:** Đọc `docs/context/architecture.md` để nắm phân tầng Modular Monolith và cấu trúc module (`modules/` vs `integrations/spotify/`).
2. **Yêu cầu nghiệp vụ:** Đọc spec tại `docs/specs/business-spec/<MÃ_CHỨC_NĂNG>/` (ví dụ `MUSIC_TRACKER_MVP`).
3. **Thiết kế kỹ thuật:** Đọc `docs/specs/design/<MÃ_CHỨC_NĂNG>/` (nếu đã có, BẮT BUỘC bám theo API Spec và Class Design).
4. **Quy chuẩn kỹ thuật:** Nạp các quy ước tại:
   - `docs/guidelines/backend/tech-stack.md` (chỉ dùng các thư viện NestJS, Prisma, Schedule được duyệt).
   - `docs/guidelines/backend/coding-convention.md` (naming, cấu trúc phân tầng, Honest Data rule, Provider isolation).
   - `docs/guidelines/backend/api-convention.md` (chuẩn response envelope `{ code, message, data }`).
   - `docs/guidelines/shared/security-policy.md` (mã hóa token AES-256-GCM, không log token).
   - `docs/guidelines/shared/gotchas.md` (bẫy rate limit Spotify 429, overlap buffer, duplicate prevention).

---

## Bước 2 — Khởi tạo Task & Chi tiết hóa Kế hoạch
1. Nếu là task mới: Tự động chạy skill `task-state-init` để tạo file `.agents/state/<dev-id>/current-task.md`.
2. Lên kế hoạch chi tiết vào mục **"Kế hoạch chi tiết"** trong `current-task.md` gồm:
   - Danh sách file cần tạo mới hoặc chỉnh sửa (DTO, Service, Controller, Prisma Schema, Adapter, Mapper).
   - Checklist từng bước thực hiện (`[ ]`).
3. Trình kế hoạch ra cho người dùng xác nhận trước khi bắt đầu gõ code.

---

## Bước 3 — Thực thi Code (Implementation)
1. **Tuân thủ Modular Monolith:**
   - Core domain chỉ làm việc với thực thể chuẩn hóa (`ListeningEvent`).
   - Logic đặc thù của Spotify đóng gói tuyệt đối trong `src/integrations/spotify/`.
2. **API Response:** 100% response trả về Client bắt buộc bọc trong Envelope `{ code, message, data }`.
3. **Database & Prisma:**
   - Dùng Prisma Client với kiểu dữ liệu type-safe.
   - Thao tác ghi nhiều bản ghi dùng `skipDuplicates: true` để tận dụng unique constraint `(providerConnectionId, providerTrackId, playedAt)`.
4. **Honest Data Rule:** Các trường `startedAt`, `endedAt`, `listenedDurationMs`, `completionRate` BẮT BUỘC để `null`.
5. **Exceptions:** Ném ngoại lệ NestJS chuẩn (`HttpException`, `BadRequestException`...), không dùng khối `catch` rỗng nuốt lỗi.

---

## Bước 4 — Kiểm thử & Theo dõi Tiến độ
1. Viết Unit Test cho Service / Controller bằng Jest.
2. Chạy test và xác nhận kết quả pass xanh (không có lỗi compile TypeScript hay lint).
3. Sau MỖI bước hoàn thành: Tự động kích hoạt skill `progress-tracker` để đánh dấu `[x]` vào `current-task.md`.

---

## Bước 5 — Review trước khi Kết thúc
1. Chạy skill `code-review-backend` rà soát 4 chiều: Security, Performance, Correctness, Style.
2. Dọn sạch các import thừa hoặc comment-out code không sử dụng.
