# Coding Convention — Frontend React / TypeScript & shadcn/ui

> Quy ước lập trình **React (TypeScript)** chuẩn cho Frontend với **Tailwind CSS & shadcn/ui**.
> Mô hình kiến trúc: **Module-based (hướng domain)**, dễ mở rộng và tối ưu cho AI Agent đọc hiểu.
> Bổ trợ: [tech-stack.md](tech-stack.md), [../backend/api-convention.md](../backend/api-convention.md).
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md`.

---

## 1. Nguyên tắc Tổ chức Mã nguồn

- **Module-based:** Tổ chức code theo từng tính năng/nghiệp vụ (domain). Không tạo thư mục tùy tiện rải rác ngoài cấu trúc đã định nghĩa.
- **Tính độc lập:** Các module nghiệp vụ trong `src/modules/` hoạt động độc lập, hạn chế tối đa việc phụ thuộc chéo trực tiếp lẫn nhau.
- **Phân tách trách nhiệm:**
  - `src/app/`: Khởi tạo ứng dụng, root providers, global routing. **Tuyệt đối không chứa business logic.**
  - `src/core/`: Dịch vụ hệ thống dùng chung (Singleton): Auth token helper, API client, Storage. Không import ngược từ `modules/` vào `core/`.
  - `src/components/ui/`: Các component tái sử dụng từ **shadcn/ui** (Button, Dialog, Badge, Card, Table...).
  - `src/shared/`: Layouts dùng chung (MainLayout, Header, Sidebar), formatters, generic utils (`cn` helper). **Không chứa logic nghiệp vụ.**
- **AI-friendly:** Cấu trúc gom cụm theo module giúp AI chỉ cần đọc đúng thư mục của tính năng đó là nắm trọn vẹn luồng xử lý mà không phải quét toàn bộ project.

---

## 2. Cấu trúc Thư mục Chuẩn

```text
src/
├── app/                       # Root providers, router setup, app entry
├── components/
│   └── ui/                    # shadcn/ui primitives (Button, Card, Badge, Dialog...)
├── core/                      # API client, HTTP interceptors, Auth storage
├── layouts/                   # Header, Sidebar, MainLayout
├── modules/                   # Nghiệp vụ tính năng
│   ├── connection/            # Quản lý kết nối Spotify (Connect/Disconnect)
│   │   ├── components/        # ConnectionCard, ScopeList
│   │   ├── hooks/             # useConnectionStatus, useSpotifyOAuth
│   │   ├── api/               # connection.api.ts
│   │   ├── types/             # connection.type.ts
│   │   └── connection.page.tsx
│   └── sync/                  # Quản lý đồng bộ & giám sát
│       ├── components/        # SyncIntervalSelector, SyncLogTable, ManualSyncButton
│       ├── hooks/             # useSyncStatus, useTriggerSync
│       ├── api/               # sync.api.ts
│       ├── types/             # sync.type.ts
│       └── sync.page.tsx
└── shared/                    # Utility formatters (dayjs formatters, cn helper)
```

---

## 3. Quy định Viết Code (Coding Standards)

### 3.1 Quy ước đặt tên (Naming)

- **MUST đặt tên 100% bằng tiếng Anh:** Áp dụng cho component, hook, biến, hàm, type, file và thư mục. **NEVER** đặt tên tiếng Việt hoặc phiên âm.
- **Tên file & thư mục:** Sử dụng **kebab-case** theo cấu trúc `[tên-chức-năng].[loại-file].[tsx|ts]`:

| Loại file | Quy cách đặt tên | Ví dụ |
|---|---|---|
| Màn hình (Page) | `[feature].page.tsx` | `connection.page.tsx`, `sync-dashboard.page.tsx` |
| UI Component | `[feature].component.tsx` | `connection-card.component.tsx` |
| Custom Hook | `use-[feature].hook.ts` | `use-sync-status.hook.ts` |
| API Call | `[feature].api.ts` | `connection.api.ts`, `sync.api.ts` |
| Data Types / Interface | `[feature].type.ts` | `connection.type.ts`, `sync.type.ts` |

- **Component:** `PascalCase` (`ConnectionCard`, `SyncSettingsForm`).
- **Hook:** `camelCase` bắt đầu bằng tiền tố `use` (`useSyncStatus`).
- **Biến / Hàm:** `camelCase` (`triggerManualSync`, `isSynchronizing`).

### 3.2 Phong cách Code (Code Style)

- **Giới hạn kích thước:** File **≤ 300 dòng**; hàm **≤ 75 dòng** (nếu vượt quá phải tách nhỏ component hoặc đẩy logic vào custom hook).
- Thụt lề: **2 khoảng trắng (spaces)**, không dùng tab.
- Biến: Mặc định dùng **`const`**, chỉ dùng `let` khi cần gán lại giá trị; **CẤM dùng `var`**.
- Dùng **Arrow function** cho functional component, callback và helper nội bộ.
- **Thứ tự khai báo trong Component:**
  ```tsx
  export const ConnectionCard = ({ connectionId }: ConnectionCardProps) => {
    // 1. Hooks (TanStack Query, custom hooks, navigation)
    const { status, isLoading } = useConnectionStatus(connectionId);

    // 2. Local State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // 3. Event Handlers & Mutations
    const handleDisconnect = () => { ... };

    // 4. Render JSX (Không viết logic lọc dữ liệu phức tạp trong JSX)
    return ( ... );
  };
  ```

### 3.3 Quản lý Form & Validation
- Sử dụng **React Hook Form** kết hợp với **Zod schema validation** theo chuẩn của shadcn/ui Form component.
- Không tự ý cài đặt thêm các thư viện form khác (Formik, Ant Design Form).

### 3.4 Thực tiễn tốt nhất với React (Best Practices)
- **Tách biệt Logic và UI:** NEVER gọi API trực tiếp trong Component. Mọi thao tác gọi API phải đi qua tầng API/Hook (TanStack Query).
- **Chống Memory Leak:** Sử dụng `useEffect` phải luôn chú ý hàm cleanup (hủy listener, cancel interval/polling).
- **Trạng thái UI đầy đủ:** Bắt buộc xử lý đủ 4 trạng thái: Loading, Empty, Error và Success.
- **Dọn dẹp Log:** NEVER để lại `console.log` trên môi trường production.

---

## 4. MUST / NEVER

- **MUST** đặt tên file theo chuẩn `[feature].[type].tsx/.ts` và toàn bộ code bằng tiếng Anh.
- **MUST** dùng **TanStack Query** cho mọi tác vụ lấy hoặc sửa dữ liệu từ Backend.
- **MUST** bọc kiểu TypeScript chặt chẽ (`strict: true`), hạn chế tối đa việc sử dụng kiểu `any`.
- **NEVER** import trực tiếp giữa các module ngang hàng trong `src/modules/` (dùng Shared hoặc Core để giao tiếp).
- **NEVER** viết biểu thức tính toán, lọc mảng phức tạp trực tiếp bên trong khối thẻ JSX.
