---
name: task-state-init
description: Tự động khởi tạo không gian làm việc state cá nhân và file current-task.md cho task mới
---

# Skill: Task State Init

Kích hoạt tự động ở Bước 2 của procedure `developer-*` khi bắt đầu một tính năng hoặc đầu việc mới.

---

## Các bước thực hiện chi tiết:

1. **Xác định namespace lập trình viên (`<dev-id>`):**
   - Chạy lệnh lấy email: `git config user.email`.
   - Trích xuất phần chuỗi trước ký tự `@`, chuyển về chữ thường, thay các ký tự đặc biệt thành dấu gạch ngang `-`.
   - *Ví dụ:* `dat.nguyen@example.com` ──► `dat-nguyen`.
   - Nếu không lấy được email từ git, sử dụng mặc định là `local-dev`.

2. **Khởi tạo thư mục State cá nhân:**
   - Kiểm tra xem thư mục `.agents/state/<dev-id>/` đã tồn tại chưa.
   - Nếu chưa tồn tại: Sao chép toàn bộ các file mẫu từ `.agents/state/_template/` sang `.agents/state/<dev-id>/`.

3. **Thiết lập file `.agents/state/<dev-id>/current-task.md`:**
   - Điền tên task hoặc tính năng vào tiêu đề.
   - Gán đường dẫn file spec liên quan (`docs/specs/business-spec/<MÃ_CHỨC_NĂNG>/`).
   - Thiết lập trạng thái `IN_PROGRESS` và gán ngày bắt đầu.

4. **Làm sạch nhật ký tiến độ:**
   - Khởi tạo lại nội dung file `.agents/state/<dev-id>/progress.md` để sẵn sàng theo dõi các bước làm việc mới.
