---
name: decisions-relevance
description: Rà soát tính phù hợp của các quyết định kiến trúc (ADR) trong docs/decisions/ đối với task và hướng dẫn lập ADR mới
---

# Skill: Decisions Relevance

Kích hoạt khi bắt đầu thiết kế tính năng mới, lựa chọn công nghệ, hoặc khi chuẩn bị đưa ra giải pháp kỹ thuật có tầm ảnh hưởng lớn đến kiến trúc hệ thống.

---

## Các bước thực hiện chi tiết:

### Bước 1 — Quét & Đối chiếu các ADR hiện có
1. **Đọc mục lục quyết định:** Đọc `docs/decisions/README.md` để nắm danh sách toàn bộ các quyết định kiến trúc cốt lõi đã được phê duyệt.
2. **Kiểm tra trạng thái ADR:**
   - Chỉ áp dụng các ADR có trạng thái `Accepted`.
   - Bỏ qua hoặc tham khảo bối cảnh của các ADR có trạng thái `Deprecated` hoặc `Superseded`.
3. **Đối chiếu với giải pháp kỹ thuật dự kiến:**
   - Kiểm tra xem cách giải quyết của task hiện tại có vi phạm hoặc đi ngược lại bất kỳ ADR nào đã chốt không.
   - *Nếu có xung đột:* Cảnh báo ngay cho người dùng, nêu rõ mã ADR bị ảnh hưởng và thảo luận hướng xử lý trước khi viết code.

---

### Bước 2 — Phân loại Quyết định phát sinh

Khi giải quyết task có phát sinh quyết định kỹ thuật mới, phân loại theo 2 mức:

#### Mức 1: Quyết định Kiến trúc Toàn dự án (Cần tạo ADR mới)
- **Dấu hiệu:** Thay đổi framework, bổ sung hệ quản trị CSDL, đổi cơ chế xác thực (Auth), thay đổi cấu trúc module, hoặc quyết định có tính đánh đổi lâu dài.
- **Hành động:** 
  1. Tạo file mới `docs/decisions/NNNN-<ten-quyet-dinh>.md` theo mẫu chuẩn Michael Nygard (`Context`, `Decision`, `Consequences`).
  2. Cập nhật bảng mục lục trong `docs/decisions/README.md`.

#### Mức 2: Quyết định Kỹ thuật Cục bộ trong Task (Micro-decisions)
- **Dấu hiệu:** Chọn thuật toán, tách component nhỏ, chọn thư viện tiện ích phụ trợ, đặt tên biến/hàm đặc thù.
- **Hành động:** 
  - Chỉ ghi nhận vào file `.agents/state/<dev-id>/decisions-log.md` của phiên làm việc, **không** tạo file ADR trong `docs/decisions/`.

---

### Bước 3 — Xuất Đánh giá Tính Tuân thủ (Compliance Check)

Trước khi chuyển sang bước code, thông báo ngắn gọn cho người dùng:
- *"Đã đối chiếu với kho ADR: Không có xung đột kiến trúc phát sinh."*
- Hoặc: *"Cảnh báo: Giải pháp đề xuất đang xung đột với ADR-xxxx ([Tiêu đề ADR]). Bạn có muốn cập nhật ADR này hay điều chỉnh lại phương án triển khai?"*
