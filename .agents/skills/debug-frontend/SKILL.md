---
name: debug-frontend
description: Quy trình cô lập lỗi, phân tích console log, React render cycle và khắc phục sự cố phía Client React / Vite / TanStack Query
---

# Skill: Debug Frontend

Kích hoạt khi người dùng báo lỗi giao diện, component không re-render, lỗi console React, hoặc sự cố gọi API phía Client (React, Vite, TanStack Query, shadcn/ui).

---

## Quy trình Xử lý Lỗi 5 Bước:

### Bước 1 — Thu thập Thông tin & Tái hiện Sự cố
1. **Trích xuất thông tin lỗi:**
   - Đọc lỗi console (Console Error / Warning).
   - Kiểm tra Network tab: HTTP Method, Endpoint, Status Code, Payload request và Response body.
   - Xác định component hoặc custom hook phát sinh lỗi.
2. **Xác định trạng thái môi trường:**
   - Trình duyệt và kích thước màn hình.
   - Dữ liệu auth state (access token có hợp lệ không).

---

### Bước 2 — Phân tích Nguyên nhân Gốc rễ (Root Cause Analysis - RCA)
1. **Khoanh vùng thành phần gây lỗi:**
   - **Tầng State / React Lifecycle:** Đột biến state trực tiếp, vòng lặp vô tận trong `useEffect`, rò rỉ bộ nhớ do thiếu hàm cleanup.
   - **Tầng Data Fetching (TanStack Query):** Query key không khớp, mutation không invalidate queries liên quan, polling chạy quá mức.
   - **Tầng Form & Validation (Zod / React Hook Form):** Sai kiểu dữ liệu trường nhập liệu, schema validation chặn submit mà không hiển thị lỗi.
   - **Tầng UI / Rendering:** Truy cập thuộc tính của object null/undefined (`TypeError: Cannot read properties of undefined`), thiếu key trong danh sách lặp.
2. **Đối chiếu danh mục bẫy lỗi phổ biến:**
   - Tra cứu tại `docs/guidelines/shared/gotchas.md` (chống state mutation, polling tab background).

---

### Bước 3 — Đề xuất Phương án & Đánh giá Rủi ro
1. Trình bày ngắn gọn cho người dùng:
   - **Nguyên nhân chính xác:** Ghi rõ component, hook và dòng code phát sinh lỗi.
   - **Phương án khắc phục:** Cách sửa code component hoặc điều chỉnh query/hook.
   - **Phạm vi tác động:** Việc sửa có ảnh hưởng đến các màn hình hoặc component dùng chung khác không?
2. Chờ người dùng xác nhận nếu phương án cần thay đổi cấu trúc state toàn cục.

---

### Bước 4 — Sửa lỗi & Kiểm thử Giao diện
1. Tiến hành sửa mã nguồn bám sát `docs/guidelines/frontend/coding-convention.md`.
2. Kiểm tra lại giao diện với đủ 4 trạng thái: Loading, Empty, Error, và Success.
3. Chạy `pnpm run test` hoặc kiểm tra build `pnpm run build` để đảm bảo an toàn kiểu dữ liệu.

---

### Bước 5 — Cập nhật Trạng thái & Nhật ký
1. Ghi nhận tóm tắt nguyên nhân và cách xử lý vào mục "Vấn đề phát sinh" trong `.agents/state/<dev-id>/progress.md`.
2. Nếu là giải pháp xử lý tạm thời (workaround) cần tối ưu sau: Ghi nhận ngay 1 dòng vào `.agents/state/<dev-id>/tech-debt.md`.
