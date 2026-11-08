# Task: {{TASK_NAME}}

> **Trạng thái:** `IN_PROGRESS` | `COMPLETED` | `BLOCKED`
> **Bắt đầu:** {{START_DATE}}
> **Module / Chức năng:** {{MODULE_NAME}}
> **Spec liên quan:** {{SPEC_PATH}}

---

## 1. Mục tiêu (Objective)
{{TASK_OBJECTIVE}}

---

## 2. Định nghĩa Hoàn thành (Definition of Done - DoD)
- [ ] Mã nguồn tuân thủ đúng quy chuẩn trong `docs/guidelines/`.
- [ ] 100% API response tuân thủ envelope `{ code, message, data }`.
- [ ] Không có lỗi biên dịch (compile error) hoặc cảnh báo linter[cite: 1].
- [ ] Đã viết unit test và xác nhận pass xanh[cite: 1].
- [ ] Đã rà soát qua procedure `code-reviewer-*` đúng tầng[cite: 1].

---

## 3. Các bước tổng quan (Overview Steps)
- [ ] Bước 1: Khởi tạo Data Types, DTO hoặc Entity
- [ ] Bước 2: Xử lý tầng dữ liệu (Repository / Query / Migration)
- [ ] Bước 3: Cài đặt logic nghiệp vụ (Service / Custom Hook)[cite: 4]
- [ ] Bước 4: Cài đặt tầng giao tiếp (Controller / UI Component)[cite: 4]
- [ ] Bước 5: Kiểm thử và review chất lượng mã nguồn[cite: 1]

---

## 4. Kế hoạch chi tiết (Detailed Implementation Plan)
<!-- AI developer-* tự động điền danh sách file và bước con cụ thể ở Bước 2 trước khi code -->

### Danh sách file tác động:
- [ ] `{{FILE_PATH_1}}`
- [ ] `{{FILE_PATH_2}}`

### Checklist chi tiết:
- [ ] 1. ...
- [ ] 2. ...