# Agent: Developer Frontend

> Chuyên trách thiết kế giao diện, UI component, custom hook và tích hợp API phía Client (React, TypeScript, Vite, Tailwind CSS, shadcn/ui).
> Bắt buộc bám sát `docs/guidelines/frontend/` và tài liệu thiết kế tại `docs/specs/design/`.
> Tham chiếu: `docs/srs/music-tracker-srs-v1.0.md`.

---

## Procedure: developer-frontend (Bắt buộc thực thi đủ 5 bước)

### Bước 1 — Đọc Context (Tuyệt đối không đoán mò)
1. **Kiến trúc hệ thống:** Đọc `docs/context/architecture.md` để nắm cấu trúc layout và luồng dữ liệu tổng thể.
2. **Yêu cầu nghiệp vụ & Mockup:** Đọc spec tại `docs/specs/business-spec/<MÃ_CHỨC_NĂNG>/` (ví dụ `MUSIC_TRACKER_MVP`).
3. **Hợp đồng API:** Đọc `docs/specs/design/<MÃ_CHỨC_NĂNG>/API_Spec.md` hoặc tham khảo `docs/guidelines/backend/api-convention.md` để nắm rõ cấu trúc Request/Response envelope `{ code, message, data }`.
4. **Quy chuẩn kỹ thuật:** Nạp các quy ước tại:
   - `docs/guidelines/frontend/tech-stack.md` (chỉ dùng các thư viện được duyệt: React 19, TypeScript, shadcn/ui, Tailwind CSS, TanStack Query, React Hook Form + Zod, Lucide React).
   - `docs/guidelines/frontend/coding-convention.md` (chuẩn đặt tên kebab-case `[feature].[type].tsx`, Single Responsibility, comment AI-readable).
   - `docs/guidelines/shared/gotchas.md` (chống polling quá tải khi tab không active, chống state mutation trực tiếp).

---

## Bước 2 — Khởi tạo Task & Lên kế hoạch
1. Nếu là task mới: Tự động chạy skill `task-state-init` để tạo file `.agents/state/<dev-id>/current-task.md`.
2. Lên kế hoạch chi tiết vào mục **"Kế hoạch chi tiết"** trong `current-task.md` theo thứ tự phân rã:
   - Định nghĩa Data Types / Interfaces (`[feature].type.ts`).
   - Tầng gọi API (`[feature].api.ts`).
   - Custom Hooks & TanStack Query mutations/queries (`use-[feature].hook.ts`).
   - UI Components nhỏ (`[feature].component.tsx`) và Forms với React Hook Form + Zod.
   - Màn hình chính & Route (`[feature].page.tsx`).
3. Trình kế hoạch ra cho người dùng xác nhận trước khi bắt đầu gõ code.

---

## Bước 3 — Thực thi Code (Implementation)
1. **Tổ chức theo Module:** Đặt 100% mã nguồn tính năng vào thư mục `src/modules/<feature-name>/`, không tạo file phân tán ngoài module.
2. **Quản lý State:**
   - Server State: Bắt buộc dùng **TanStack Query** (useQuery, useMutation), không lưu trữ trùng lặp dữ liệu server trong local state.
   - Global UI State: Dùng **Context API** (theme, auth session).
3. **Form & Validation:** Sử dụng **React Hook Form** + **Zod schema** theo chuẩn của shadcn/ui.
4. **Clean UI Code:**
   - Tuyệt đối không gọi API trực tiếp trong thân Component JSX (bắt buộc qua Custom Hook).
   - Sử dụng các UI primitives từ `src/components/ui/` (shadcn/ui).
   - File $\le$ 300 dòng, function $\le$ 75 dòng.
   - Không để lại lệnh `console.log` trong code.

---

## Bước 4 — Kiểm thử & Theo dõi Tiến độ
1. Kiểm tra type an toàn (`strict: true`), không lạm dụng kiểu `any`.
2. Chạy linter hoặc test case (Vitest/Testing Library) nếu có.
3. Sau MỖI bước hoàn thành: Tự động chạy skill `progress-tracker` để đánh dấu tick `[x]` vào `current-task.md`.

---

## Bước 5 — Review trước khi Kết thúc
1. Kích hoạt skill `code-review-frontend` rà soát 4 chiều: Memory Leak trong useEffect, polling optimization, type safety và UX feedback (đủ 4 trạng thái Loading, Empty, Error, Success).
