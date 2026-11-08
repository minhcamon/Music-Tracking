---
name: technical-design
description: Hỗ trợ sinh bộ 3 tài liệu thiết kế kỹ thuật từ spec nghiệp vụ theo template chuẩn của dự án
---

# Skill: Technical Design

Hỗ trợ agent `solution-architect` lập hồ sơ thiết kế kỹ thuật chi tiết trước khi tiến hành viết code.

---

## Các bước thực hiện:

1. **Đọc Spec Nghiệp vụ & Xác định Phạm vi:**
   - Đọc yêu cầu từ `docs/specs/business-spec/<MÃ_CHỨC_NĂNG>/`.
   - Xác định phạm vi tầng phụ trách: BE-only, FE-only hoặc Full-stack.
   - Nạp kiến trúc tổng thể tại `docs/context/architecture.md`.

2. **Khởi tạo Thư mục Thiết kế:**
   - Tạo thư mục: `docs/specs/design/<MÃ_CHỨC_NĂNG>/`.
   - Sao chép 3 file mẫu từ `docs/specs/design/_template/`:
     - `API_Spec.md`
     - `Component_Class_Design.md`
     - `Processing_Flow.md`

3. **Điền Nội dung Chi tiết theo Chuẩn:**
   - **`API_Spec.md`:** Đặc tả đầy đủ DTO, ràng buộc validation, envelope `{ code, message, data }` theo `docs/guidelines/backend/api-convention.md`, catalog mã lỗi và DDL bảng mới (nếu có).
   - **`Component_Class_Design.md`:** Vẽ sơ đồ lớp Mermaid `classDiagram`, mô tả module NestJS (`modules/` vs `integrations/spotify/`) hoặc module FE (`pages`, `components`, `hooks`, `api`, `types`).
   - **`Processing_Flow.md`:** Vẽ sơ đồ tuần tự Mermaid `sequenceDiagram`, chỉ định rõ các bước kiểm tra (guards) và ranh giới giao dịch CSDL.

4. **Đánh dấu Điểm Nghi vấn:**
   - Mọi thông tin nghiệp vụ chưa rõ ràng hoặc thiếu cấu trúc ánh xạ DB bắt buộc phải gắn thẻ `[cần xác nhận]` ở mục cuối của từng tài liệu.
