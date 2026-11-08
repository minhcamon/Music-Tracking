# <MÃ_CHỨC_NĂNG> — Đặc tả API

| Thuộc tính | Giá trị |
|---|---|
| **Mã chức năng** | `<MÃ_CHỨC_NĂNG>` — <Tên nghiệp vụ> |
| **Phạm vi** | <Liệt kê các thao tác: LIST · VIEW · CREATE · UPDATE · DELETE> |
| **Phạm vi tầng** | Backend / Frontend / Full-stack |
| **Quy chuẩn áp dụng** | Bám sát [architecture.md](../../../context/architecture.md) và [api-convention.md](../../../guidelines/backend/api-convention.md) |
| **Cơ sở dữ liệu** | <Tên DB + ràng buộc: Bảng mới / Bảng hiện hữu> |
| **Tác giả / Ngày** | <Tên> — <YYYY-MM-DD> — v1.0 |

> `[cần xác nhận]` = Điểm spec yêu cầu nhưng chưa rõ ràng về logic hoặc cấu trúc dữ liệu.

---

## 1. Quy ước chung của chức năng

- **Envelope:** 100% response tuân thủ cấu trúc `{ code, message, data }` theo `docs/guidelines/backend/api-convention.md`.
- **Hằng số đường dẫn (Path Constants):** Gom toàn bộ path vào file quản lý tập trung (`ApiPaths`).
- **Quy tắc nghiệp vụ xuyên suốt:** (Ví dụ: Soft-delete, Audit log `created_at`/`updated_at`, Transaction boundary).

---

## 2. Đặc tả chi tiết từng API

### API 1 — <Tên thao tác> (Ví dụ: Tạo mới bản ghi)

- **Endpoint:** `POST /api/v1/<resources>`
- **Header:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Mô tả:** <Mô tả ngắn gọn chức năng của API>

#### Request Body — `<TênRequestDto>`

| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc validation | Mô tả |
|---|---|---|---|---|
| `<field_name>` | String / Long / ... | Y / N | `@NotBlank`, `@Size(...)` | `<Mô tả ý nghĩa>` |

#### Response — `ApiResponse<<TênResponseDto>>`

| Trường | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `<field_name>` | String / Long / ... | `<Mô tả ý nghĩa>` |

```json
{
  "code": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

#### Tiền điều kiện & Kiểm tra dữ liệu (Guards)

- Kiểm tra quyền hạn người dùng → HTTP 403 `ERR_FORBIDDEN`.
- Kiểm tra dữ liệu đầu vào → HTTP 400 `ERR_VALIDATION_FAILED`.
- Kiểm tra trùng lặp bản ghi → HTTP 400 `ERR_<MODULE>_ALREADY_EXISTS`.

#### Giao dịch & Dữ liệu (Transactional Boundary)

Các bước thực thi bên trong transaction (All-or-nothing):
- Insert bản ghi chính vào bảng A.
- Cập nhật trạng thái bản ghi liên quan trong bảng B.

---

## 3. Catalog mã lỗi của chức năng

| Mã lỗi (code) | HTTP Status | Thông báo (message) |
|---|---|---|
| `SUCCESS` | 200 / 201 | Thao tác thành công |
| `ERR_BAD_REQUEST` | 400 | Dữ liệu đầu vào không hợp lệ |
| `ERR_NOT_FOUND` | 404 | Không tìm thấy bản ghi |
| `ERR_<MODULE>_<DETAIL>` | 400 | <Thông báo lỗi nghiệp vụ cụ thể> |

---

## 4. DDL Cơ sở dữ liệu (Nếu có bảng mới)

```sql
CREATE TABLE <table_name> (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 5. Điểm [cần xác nhận]

- <Điểm chưa rõ cần xác nhận lại với BA hoặc Tech Lead>
