# API Convention — Backend

> Quy ước thiết kế REST API chuẩn cho Backend.
> **Contract-first**: Mọi response bắt buộc nhất quán cấu trúc `{ code, message, data }`.

---

## 1. Quy ước đặt tên endpoint

- Dùng **danh từ số nhiều**, đại diện cho tài nguyên (resource).
- Phân cấp rõ ràng, **không quá 3 cấp sau version**: `/api/v1/departments/{id}/teams/{id}/users`.
- Resource gồm nhiều từ → dùng **kebab-case**: `/api/v1/user-roles`.
- **Đặt `/api/<version>` ở đầu** endpoint: `/api/v1/...`.

| Action | METHOD | ENDPOINT | Param type | Ví dụ |
|---|---|---|---|---|
| Lấy danh sách tìm kiếm / filter phức tạp | POST | `/api/v1/<resources>/search` | Request body | `/api/v1/users/search` |
| Lấy danh sách LOV / danh mục nhỏ | GET | `/api/v1/<resources>` | Query param | `/api/v1/provinces?status=active` |
| Lấy chi tiết theo ID | GET | `/api/v1/<resources>/{id}` | Path param | `/api/v1/users/1` |
| Tạo mới | POST | `/api/v1/<resources>` | Request body | `/api/v1/users` |
| Cập nhật toàn bộ | PUT | `/api/v1/<resources>/{id}` | Path + body | `/api/v1/users/1` |
| Cập nhật một phần | PATCH | `/api/v1/<resources>/{id}` | Path + body | `/api/v1/users/1` |
| Xóa | DELETE | `/api/v1/<resources>/{id}` | Path param | `/api/v1/users/1` |

> Với các luồng nghiệp vụ đặc thù (RPC-style như phê duyệt, kích hoạt), cho phép đặt động từ ở cuối: `/api/v1/orders/{id}/approve` (POST).

---

## 1b. Khai báo endpoint tập trung (`ApiPaths`)

Mọi path endpoint khai báo **tập trung trong file constants duy nhất** (ví dụ class `ApiPaths` hoặc `routes.constant.ts`), **KHÔNG** viết chuỗi URL phân tán rải rác trong từng Controller:

- Gốc API: `API_BASE = "/api"`
- Version: `API_V1 = API_BASE + "/v1"`
- Ghép chuỗi theo resource: `USERS = API_V1 + "/users"` → `USERS_SEARCH = USERS + "/search"`
- Controller và Router chỉ tham chiếu hằng số, không dùng string literal.

---

## 2. Kiểu dữ liệu & Định dạng (Request/Response)

- Chuẩn ngày/giờ: Ưu tiên chuẩn quốc tế **ISO-8601** để đồng bộ giữa Frontend và Backend.
  - Date: `YYYY-MM-DD`
  - DateTime: `YYYY-MM-DDTHH:mm:ssZ` (hoặc `YYYY-MM-DD HH:mm:ss`)
- Số tiền / Số thập phân lớn: Dùng `BigDecimal` (Java) hoặc kiểu `string` (khi serialize JSON) để chống mất độ chính xác.
- Danh sách rỗng: Luôn trả mảng rỗng `[]`, **NEVER** trả `null`.

---

## 3. Định dạng Response Envelope (BẮT BUỘC)

Mọi HTTP response (kể cả thành công hay thất bại) đều bọc trong một format thống nhất:

```json
{
  "code": "MESSAGE_CODE",
  "message": "User-friendly message",
  "data": null
}