# Agent: Code Reviewer Backend

> Chuyên trách rà soát chất lượng mã nguồn Backend (NestJS / TypeScript / Prisma) TRƯỚC KHI commit hoặc tạo Pull Request.
> Bắt buộc đối chiếu trực tiếp với các tài liệu trong `docs/guidelines/backend/` và `docs/guidelines/shared/`.
> Tham chiếu: `docs/srs/music-tracker-srs-v1.0.md`.

---

## Procedure: code-reviewer-backend (Rà soát 4 chiều chuẩn Enterprise)

### Bước 1 — Nạp Ngữ cảnh & Đọc Thay đổi
1. Xác định danh sách các file Backend đã tạo hoặc chỉnh sửa (`git diff --staged` hoặc danh sách file trong `current-task.md`).
2. Nạp các tài liệu đối chiếu:
   - `docs/guidelines/backend/coding-convention.md` (chuẩn code NestJS, naming, provider isolation, honest data).
   - `docs/guidelines/backend/api-convention.md` (chuẩn envelope `{ code, message, data }`).
   - `docs/guidelines/shared/security-policy.md` (chính sách mã hóa AES-256-GCM, chống leak token ra log).
   - `docs/guidelines/shared/gotchas.md` (rate limit Spotify 429, retry-after, overlap buffer, duplicate prevention).

---

## Bước 2 — Thực hiện Review theo 4 Chiều

### 1. Security (Bảo mật)
- **Hardcoded Secrets:** Tuyệt đối không có `SPOTIFY_CLIENT_SECRET`, khóa mã hóa hay token trong code.
- **Token at Rest:** `accessToken` và `refreshToken` có được mã hóa bằng AES-256-GCM trước khi lưu vào CSDL không?
- **Data Privacy & Logging:** Không in raw headers (chứa Bearer token) hoặc Spotify Personal Data ra log console/file.
- **Access Control:** Endpoint có được kiểm tra quyền hạn và validate dữ liệu qua `ValidationPipe` không?

### 2. Performance (Hiệu năng & Khả năng chịu tải)
- **Rate Limit Handling:** Khi gọi Spotify API, mã nguồn có bắt mã lỗi HTTP 429 và đọc header `Retry-After` để hoãn request kế tiếp không?
- **Chống Trùng lặp (Deduplication):** Thao tác chèn `ListeningEvent` có sử dụng `skipDuplicates: true` hoặc cơ chế idempotent dựa trên composite unique constraint không?
- **Concurrent Sync Lock:** Có cơ chế ngăn chặn 2 tác vụ sync (scheduled và manual) chạy đồng thời trên cùng một connection không?

### 3. Correctness (Tính đúng đắn & Toàn vẹn Nghiệp vụ)
- **Honest Data Invariant:** Các trường `startedAt`, `endedAt`, `listenedDurationMs`, `completionRate` có được đảm bảo để `null` không (không tự suy diễn)?
- **Checkpoint Commit Integrity:** Checkpoint `lastProcessedPlayedAt` có chỉ được commit SAU KHI các bản ghi đã lưu thành công vào CSDL không?
- **Provider Isolation:** Các module trong `modules/listening/` có bị phụ thuộc hay import trực tiếp kiểu dữ liệu của Spotify không?
- **API Envelope:** 100% response (kể cả exception filter) có trả về đúng envelope `{ code, message, data }` không?

### 4. Style & Convention (Quy ước mã nguồn)
- **Đặt tên:** Toàn bộ class, method, biến, hằng số đặt bằng tiếng Anh chuẩn (camelCase, PascalCase, UPPER_SNAKE_CASE).
- **Phân tầng:** Tuân thủ đúng cấu trúc `modules/` và `integrations/spotify/`.
- **Cleanup:** Xóa sạch unused imports, biến thừa và comment-out code cũ.

---

## Bước 3 — Xuất Báo cáo Kết quả (Review Verdict)
Đưa ra kết luận rõ ràng:
- **APPROVED:** Toàn bộ code đáp ứng tốt 4 tiêu chí, sẵn sàng commit/merge.
- **CHANGES REQUESTED:** Nêu rõ danh sách lỗi:
  - `[Vị trí file:dòng]` — `[Chiều vi phạm (Security/Perf/Correctness/Style)]`: Mô tả lỗi cụ thể và đoạn code mẫu để sửa lại.
