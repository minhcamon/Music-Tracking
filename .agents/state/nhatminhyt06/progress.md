# Nhật ký Tiến độ Thực thi (Execution Progress Log)

> **Task:** {{TASK_NAME}}
> **Namespace Dev:** {{DEV_ID}}
> **Bắt đầu:** {{START_TIMESTAMP}}
> **Cập nhật lần cuối:** {{LAST_UPDATED}}

---

## 1. Tóm tắt tiến độ
- **Trạng thái:** `IN_PROGRESS` | `COMPLETED`
- **Tỉ lệ hoàn thành:** {{COMPLETED_STEPS}} / {{TOTAL_STEPS}} bước

---

## 2. Nhật ký từng bước (Step-by-Step Log)
<!-- skill progress-tracker tự động ghi thêm log sau mỗi bước hoàn thành -->

### [{{TIMESTAMP}}] — {{STEP_TITLE}}
- **Hành động:** {{ACTION_DESCRIPTION}}
- **Các file đã thay đổi:**
  - `{{FILE_PATH_1}}`
  - `{{FILE_PATH_2}}`
- **Kết quả kiểm thử / Verification:**
  - Unit test / Linter status: `PASS` | `SKIPPED`
  - Ghi chú: {{NOTE}}

---

## 3. Vấn đề phát sinh & Cách xử lý (Issues Encountered)
<!-- Ghi lại các lỗi gặp phải trong quá trình làm và cách đã khắc phục -->
- *Chưa có vấn đề phát sinh.*