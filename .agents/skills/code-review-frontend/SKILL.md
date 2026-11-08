---
name: code-review-frontend
description: Thực hiện rà soát chất lượng mã nguồn Frontend (React / TypeScript / shadcn/ui) theo 4 chiều chuẩn mực trước khi commit hoặc tạo PR
---

# Skill: Code Review Frontend

Kích hoạt ở Bước 5 của procedure `developer-frontend` hoặc khi có yêu cầu kiểm tra lại mã nguồn Client/UI trước khi bàn giao.
Tham chiếu: `docs/srs/music-tracker-srs-v1.0.md`.

---

## 4 Chiều Đánh giá Chi tiết:

### 1. Security (Bảo mật Client)
- **XSS Prevention:** Tuyệt đối không sử dụng `dangerouslySetInnerHTML` khi render tên bài hát, tên nghệ sĩ hoặc context từ API bên thứ ba.
- **Lưu trữ dữ liệu nhạy cảm:** Không lưu trữ Client Secret, token quản trị hoặc thông tin cá nhân chưa mã hóa trong `localStorage` hay `sessionStorage`.
- **Dữ liệu gửi lên API:** Không dựa hoàn toàn vào kiểm tra form ở giao diện; kiểm tra schema dữ liệu qua Zod trước khi gửi lên Server.

---

### 2. Performance & Vòng đời React
- **Tính bất biến của State (Immutability):** Tuyệt đối không thay đổi trực tiếp thuộc tính của object hoặc mảng trong state (bắt buộc dùng cú pháp spread `...` hoặc bản sao mới).
- **Vòng lặp vô tận (Infinite Re-renders):** Kiểm tra mảng phụ thuộc (dependency array) trong `useEffect`, `useCallback`, `useMemo`; không cập nhật state bên trong `useEffect` mà không có điều kiện dừng.
- **Rò rỉ bộ nhớ (Memory Leaks):** Các tác vụ bất đồng bộ, event listener trên `window`/`document`, hoặc polling trong `useEffect` bắt buộc phải trả về cleanup function để hủy khi component unmount.
- **Tối ưu hóa Polling:** Tránh polling vô hạn khi tab chuyển sang background trong TanStack Query.

---

### 3. Correctness & UX States (Tính Đúng đắn & Trải nghiệm)
- **Quản lý Server State:** Dữ liệu bất đồng bộ từ API bắt buộc được quản lý qua **TanStack Query** (useQuery, useMutation), không lưu trữ trùng lặp vào state cục bộ.
- **Trạng thái UI đầy đủ:** Kiểm tra xem giao diện đã hiển thị đầy đủ 4 trạng thái hay chưa: Loading (đang tải), Empty (dữ liệu rỗng), Error (báo lỗi) và Success (dữ liệu bình thường).
- **Form & Validation:** Sử dụng **React Hook Form** + **Zod schema** theo chuẩn shadcn/ui, không tự cài thêm thư viện form bên ngoài khi chưa thống nhất.
- **Type Safety:** Bật kiểm tra kiểu nghiêm ngặt trong TypeScript, không lạm dụng `any` hoặc ép kiểu tùy tiện (`as unknown as ...`).

---

### 4. Style & Convention (Quy ước Mã nguồn)
- **Tổ chức thư mục Module:** 100% mã nguồn tính năng phải nằm gọn bên trong thư mục `src/modules/<feature-name>/`.
- **UI Components:** Tái sử dụng các UI primitives từ `src/components/ui/` (shadcn/ui).
- **Đặt tên file:** Tuân thủ đúng chuẩn kebab-case theo quy ước: `[feature].[type].tsx` (ví dụ: `connection-card.component.tsx`, `use-sync-status.hook.ts`, `sync.api.ts`).
- **Kích thước file & hàm:** File không vượt quá 300 dòng, function không vượt quá 75 dòng theo `docs/guidelines/frontend/coding-convention.md`.
- **Clean JSX:** Không viết biểu thức tính toán nặng hoặc chuỗi xử lý mảng phức tạp trực tiếp trong JSX; tách riêng ra hook hoặc helper function.
- **Dọn dẹp code:** Xóa bỏ toàn bộ các lệnh `console.log`, biến không sử dụng và các đoạn mã comment-out cũ.

---

## Mẫu Báo cáo Đánh giá (Review Output)

```markdown
### Kết quả Review: [APPROVED | CHANGES REQUESTED]

#### Danh sách vấn đề cần điều chỉnh (nếu có):
- **[File:Dòng]** — `[Security | Performance | Correctness | Style]`
  - **Vấn đề:** <Mô tả chi tiết lỗi>
  - **Đề xuất khắc phục:** <Đoạn code sửa lại mẫu>
```
