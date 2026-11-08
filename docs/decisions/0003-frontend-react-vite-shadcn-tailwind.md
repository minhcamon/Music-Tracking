# ADR-0003: Lựa chọn React, Vite, Tailwind CSS và shadcn/ui cho Giao diện Quản trị

> Chuẩn định dạng: Architecture Decision Record (Michael Nygard).
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 4, Mục 11).

| Thuộc tính | Giá trị |
|---|---|
| **Trạng thái** | `Accepted` |
| **Ngày tạo** | 2026-11-03 |
| **Tác giả / Quyết định bởi** | Solution Architect |
| **Tài liệu liên quan** | `docs/guidelines/frontend/tech-stack.md`, `docs/context/scope.md` |

---

## 1. Bối cảnh (Context)

Phần giao diện người dùng của Music Tracker trong giai đoạn MVP phục vụ các nhu cầu:
- Quản lý kết nối tài khoản Spotify (Connect / Disconnect).
- Cấu hình tần suất đồng bộ (15/30/60 phút hoặc thủ công) và kích hoạt manual sync.
- Giám sát trạng thái đồng bộ, tiến độ checkpoint, nhật ký lỗi và số lượng bản ghi.
Yêu cầu giao diện hiện đại, tốc độ phản hồi nhanh, linh hoạt trong việc tùy biến UI dashboard mà không bị gò bó bởi các bộ UI kit cồng kềnh.

---

## 2. Quyết định (Decision)

Frontend sẽ được xây dựng bằng:
- **Core:** React 19 + TypeScript.
- **Build tool:** Vite (HMR siêu nhanh, bundle production tối ưu).
- **Styling & UI:** Tailwind CSS kết hợp với **shadcn/ui** (dựa trên Radix UI primitives).
- **Routing:** React Router v7.
- **Server State Management:** TanStack Query (React Query) v5.

**Phương án thay thế đã cân nhắc:**
- *Ant Design (antd):* Đã được sử dụng trong starter kit mẫu, nhưng bị loại bỏ vì dung lượng bundle lớn, phong cách thiết kế enterprise gò bó, khó tùy biến sâu theo phong cách hiện đại của ứng dụng âm nhạc cá nhân so với shadcn/ui.
- *Next.js:* Bị loại vì MVP chỉ cần Single Page Application (SPA) đơn giản, Backend NestJS đã đảm nhận toàn bộ API logic.

---

## 3. Hệ quả & Đánh đổi (Consequences)

### Tích cực (Pros)
- **shadcn/ui** không phải là thư viện dependency đóng gói sẵn mà là mã nguồn mở chép trực tiếp vào project, cho phép kiểm soát 100% markup và styling.
- Dung lượng bundle cực nhẹ, tốc độ tải trang cao.
- TanStack Query quản lý hoàn hảo việc polling trạng thái sync, mutate manual sync và cache dữ liệu trạng thái kết nối.

### Tiêu cực & Chi phí đánh đổi (Cons / Trade-offs)
- Cần tự cấu hình các component shadcn/ui ban đầu (thay vì import sẵn một gói như antd).

### Điểm cần theo dõi (Neutral / Follow-up)
- Khi phát triển các tính năng thống kê biểu đồ sau này (post-policy clearance), shadcn/ui Chart (dựa trên Recharts) sẽ là giải pháp mở rộng tự nhiên.

