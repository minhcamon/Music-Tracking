# Sổ Ghi nhận Nợ Kỹ thuật (Technical Debt Ledger)

> **Dự án:** {{PROJECT_NAME}}
> **Namespace Dev:** {{DEV_ID}}
> **Cập nhật lần cuối:** {{LAST_UPDATED}}

---

## 1. Hướng dẫn ghi nhận
- Ghi nhận các giải pháp tạm thời (workaround), đoạn code chưa tối ưu, thiếu test coverage hoặc các điểm cần refactor khi có thời gian.
- Phân loại mức độ ưu tiên:
  - `HIGH`: Rủi ro bảo mật tiềm ẩn, nguy cơ nghẽn hiệu năng hoặc rò rỉ bộ nhớ.
  - `MEDIUM`: Chưa tối ưu thuật toán, code trùng lặp cần tách hàm/module chung.
  - `LOW`: Đặt tên chưa mượt mà, thiếu comment giải thích logic phức tạp, format chưa chuẩn.

---

## 2. Danh sách nợ kỹ thuật tồn đọng

| ID | Mức độ | Vị trí (File & Dòng) | Vấn đề / Giải pháp tạm hiện tại | Đề xuất khắc phục trong tương lai |
|---|---|---|---|---|
| TD-01 | MEDIUM | `src/...` | {{MO_TA_VAN_DE}} | {{HUONG_XU_LY}} |

---

## 3. Các mục đã xử lý (Resolved)

| ID | Ngày xử lý | Mô tả xử lý | PR / Commit liên quan |
|---|---|---|---|
| — | — | — | — |