# Thiết kế Kỹ thuật (Technical Design)

> Nơi lưu trữ **tài liệu thiết kế kỹ thuật** sinh ra từ yêu cầu nghiệp vụ (spec), được lập **trước khi** lập trình viên / AI Agent viết code production.
> Đây là tài sản kiến trúc của dự án, được xem xét và duyệt trước khi thực thi.

---

## 1. Quy trình vận hành

```text
Spec nghiệp vụ (docs/specs/business-spec/<MÃ_CHỨC_NĂNG>/)
        │
        ▼
Agent solution-architect sinh tài liệu thiết kế vào docs/specs/design/<MÃ_CHỨC_NĂNG>/ (3 file tài liệu)
        │
        ▼
Agent architect-reviewer (hoặc Tech Lead) rà soát & xác nhận thiết kế
        │
        ▼
Agent developer-backend / developer-frontend code TUÂN THỦ theo đúng thiết kế
```

---

## 2. Tổ chức thư mục theo chức năng

Mỗi chức năng/module tương ứng với 1 thư mục con (ví dụ: `design/AUTH/`, `design/PAYMENT/`, `design/ORDER/`).
Khi bắt đầu thiết kế, copy các file từ thư mục `_template/` vào thư mục của chức năng đó:

| File | Nội dung chính | Phạm vi theo tầng |
|---|---|---|
| `API_Spec.md` | Endpoint, Request/Response DTO, Envelope JSON, catalog mã lỗi, DDL bảng mới | BE / Full-stack: Đầy đủ. FE-only: Chỉ cần contract API tiêu thụ |
| `Component_Class_Design.md` | Sơ đồ lớp, cấu trúc Package, Controller, Service, Repository, Entity, DTO, Module FE | BE-only: Phần I. FE-only: Phần II. Full-stack: Cả hai |
| `Processing_Flow.md` | Sơ đồ tuần tự (Mermaid Sequence Diagram), ranh giới Transaction, xử lý ngoại lệ | Toàn bộ luồng tương tác giữa Client ↔ API ↔ DB |
| `CHANGELOG.md` | Nhật ký thay đổi thiết kế (chỉ tạo khi có sự thay đổi sau bản baseline đầu tiên) | Tất cả các tầng |

---

## 3. Quy ước [cần xác nhận]

- Đánh dấu thẻ `[cần xác nhận]` cho mọi điểm spec nghiệp vụ chưa rõ ràng, chưa khớp với cấu trúc bảng hoặc chưa rõ mã trạng thái.
- Gom danh sách các điểm này vào mục cuối của tài liệu thiết kế để làm rõ trước khi bắt đầu viết code.

---

## 4. Vòng đời thiết kế

1. **Sinh thiết kế ban đầu (Baseline):** `solution-architect` đọc spec và sinh tài liệu thiết kế. Bản đầu tiên không cần ghi `CHANGELOG.md`.
2. **Review & Chốt:** Kiểm tra tính nhất quán với `docs/guidelines/` và kiến trúc hệ thống tại [architecture.md](../../context/architecture.md).
3. **Triển khai code:** Lập trình viên/Agent đọc thiết kế và bám sát tuyệt đối; không tự ý thay đổi API hay cấu trúc bảng.
4. **Cập nhật thay đổi (Sau Baseline):** Nếu có thay đổi yêu cầu, cập nhật tài liệu thiết kế và ghi nhận lịch sử vào `CHANGELOG.md` kèm lý do.
