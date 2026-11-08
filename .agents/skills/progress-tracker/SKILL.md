---
name: progress-tracker
description: Tự động cập nhật checklist trong current-task.md và ghi nhật ký tiến độ vào progress.md sau mỗi bước hoàn thành
---

# Skill: Progress Tracker

Tự động kích hoạt ở Bước 4 trong procedure của các agent `developer-*` sau khi một bước công việc hoàn thành và kiểm thử thành công.

---

## Các bước thực hiện:

1. **Xác định namespace lập trình viên (`<dev-id>`):**
   - Lấy chuỗi trước `@` từ `git config user.email` (mặc định dùng `local-dev` nếu không tìm thấy).

2. **Cập nhật checklist trong `current-task.md`:**
   - Đọc `.agents/state/<dev-id>/current-task.md`.
   - Tìm bước công việc vừa hoàn tất trong mục **"Kế hoạch chi tiết"** hoặc **"Các bước tổng quan"** và đổi từ `[ ]` thành `[x]`.

3. **Ghi nhật ký vào `progress.md`:**
   - Mở `.agents/state/<dev-id>/progress.md`.
   - Bổ sung một khối entry mới vào mục **"Nhật ký từng bước"** theo định dạng:
     ```markdown
     ### [YYYY-MM-DD HH:mm:ss] — <Tên bước vừa hoàn thành>
     - **Hành động:** <Mô tả ngắn gọn việc vừa làm>
     - **Các file đã thay đổi:**
       - `<đường_dẫn_file_1>`
       - `<đường_dẫn_file_2>`
     - **Kết quả kiểm thử / Verification:** PASS (hoặc trạng thái kiểm tra linter/build)
     - **Ghi chú:** <Lưu ý thêm nếu có>
     ```

4. **Đánh giá hoàn tất Task:**
   - Nếu toàn bộ các mục trong checklist đã được đánh dấu `[x]`, cập nhật trạng thái tổng của task trong `current-task.md` từ `IN_PROGRESS` thành `COMPLETED`.
