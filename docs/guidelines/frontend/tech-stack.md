# Tech Stack — Frontend React & shadcn/ui

> Quy chuẩn công nghệ Frontend chuẩn cho dự án **React + TypeScript + Vite + shadcn/ui**.
> Kiến trúc: **Modular Single Page Application (SPA)**, tổ chức theo module nghiệp vụ.
> Ràng buộc: AI bắt buộc tuân thủ danh mục công nghệ và thư viện được duyệt bên dưới, **không tự ý cài thêm dependencies**.
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 4, Mục 11).

---

## 1. Framework & Thư viện Cốt lõi

| Phân nhóm | Công nghệ | Phiên bản khuyến nghị | Vai trò |
|---|---|---|---|
| Core Framework | **ReactJS** | **19.x** | Xây dựng giao diện component-driven hiện đại |
| Language | **TypeScript** | **5.x** (strict mode) | Đảm bảo an toàn kiểu dữ liệu compile-time, giảm lỗi runtime |
| Build Tool & Bundler | **Vite** | **6.x+** | Dev server HMR siêu nhanh, đóng gói production tối ưu |
| Routing | **React Router** | **v7.x** | Định tuyến client-side, hỗ trợ lazy-loading theo module |
| Server State | **TanStack Query** (React Query) | **v5.x** | Quản lý fetch, cache, polling trạng thái sync và mutation |
| UI Component Kit | **shadcn/ui** (Radix UI) | Chuẩn | Bộ component giao diện tùy biến cao, mã nguồn mở trực tiếp |
| Styling | **Tailwind CSS** | **3.4+ / 4.x** | Utility-first CSS linh hoạt, cấu hình design system đồng bộ |
| Icons | **Lucide React** (`lucide-react`) | Chuẩn | Bộ icon vector hiện đại, tối ưu cho shadcn/ui |
| Form & Validation | **React Hook Form** + **Zod** | Chuẩn | Quản lý form hiệu năng cao, validate schema chuẩn shadcn/ui |
| Client UI State | **React Context API** | Native | Quản lý state UI toàn cục nhẹ nhàng (Theme, Auth profile) |
| HTTP Client | **Fetch API** / **Axios** | Native / 1.x | Giao tiếp API với Backend NestJS `/api/v1` |

---

## 2. Chiến lược Quản lý State (State Management)

- **Server State:** BẮT BUỘC dùng **TanStack Query v5** cho mọi luồng dữ liệu tương tác với Backend (trạng thái kết nối, cấu hình sync, nhật ký sync, kích hoạt manual sync).
- **Global UI State:** Dùng **React Context API** cho các trạng thái giao diện toàn cục (chế độ Dark/Light, thông tin tài khoản hiện tại).
- **Local Module State:** Sử dụng `useState`, `useReducer` cục bộ trong từng component.
- **Hạn chế:** Không cài đặt thêm các thư viện store phức tạp (Redux Toolkit, Zustand, MobX) trong giai đoạn MVP.

---

## 3. Kiến trúc & Tổ chức Giao diện (Modular Architecture)

- **Cấu trúc hướng module (Module-based):** Mỗi phân hệ màn hình là một thư mục độc lập trong `src/modules/`:
  - `src/modules/connection/`: Quản lý liên kết tài khoản Spotify, hiển thị quyền và trạng thái.
  - `src/modules/sync/`: Cấu hình tần suất đồng bộ, nút kích hoạt manual sync, xem lịch sử và log lỗi.
  - `src/modules/dashboard/`: Tổng quan trạng thái hệ thống.
- **Thư mục UI dùng chung:**
  - `src/components/ui/`: Chứa các component của **shadcn/ui** (Button, Dialog, Card, Badge, Table, Dropdown...).
  - `src/shared/`: Layouts, headers, footers, tiện ích định dạng ngày giờ.
- **Luồng dữ liệu chuẩn:**
  `Giao diện (JSX Component) ──► Custom Hook ──► TanStack Query ──► API Client ──► Backend API`

---

## 4. Danh mục Thư viện được duyệt (Approved Libraries)

> [!IMPORTANT]
> **Ràng buộc cứng đối với AI:** AI **CHỈ ĐƯỢC PHÉP** sử dụng các thư viện nằm trong danh sách này.

| Thư viện | Mục đích sử dụng | Trạng thái |
|---|---|---|
| `react`, `react-dom` | Core React runtime | ✅ Duyệt |
| `typescript` | Trình biên dịch TypeScript | ✅ Duyệt |
| `vite` | Dev server & Build bundler | ✅ Duyệt |
| `@tanstack/react-query` | Quản lý Server State & Polling | ✅ Duyệt |
| `tailwindcss` | Utility CSS Styling | ✅ Duyệt |
| `clsx`, `tailwind-merge` | Trợ thủ gộp class Tailwind (`cn` helper) | ✅ Duyệt |
| `@radix-ui/*` | Headless UI primitives cho shadcn/ui | ✅ Duyệt |
| `lucide-react` | Icon vector cho giao diện | ✅ Duyệt |
| `react-hook-form` | Quản lý form | ✅ Duyệt |
| `zod` | Validate schema cho form và dữ liệu | ✅ Duyệt |
| `@hookform/resolvers` | Cầu nối giữa Zod và React Hook Form | ✅ Duyệt |
| `react-router-dom` | Điều hướng trang | ✅ Duyệt |
| `dayjs` | Định dạng ngày giờ UTC sang múi giờ người dùng | ✅ Duyệt |
| `vitest`, `@testing-library/react` | Viết Unit Test cho Component & Hook | ✅ Duyệt |

---

## 5. Biến môi trường & Scripts

- **Biến môi trường chuẩn Vite (`.env`):**
  - `VITE_API_BASE_URL=http://localhost:3000/api/v1`
  - `VITE_APP_TITLE=Music Tracker`
- **Scripts trong `package.json`:**
  - `dev`: `vite`
  - `build`: `tsc -b && vite build`
  - `preview`: `vite preview`
  - `test`: `vitest run`
