# PLAN-05: Giao diện Quản trị Frontend React & shadcn/ui

> **Mã kế hoạch:** `PLAN-05` | **Mã chức năng:** `MUSIC_TRACKER_MVP`  
> **Trạng thái:** **ĐÃ PHÊ DUYỆT (READY TO IMPLEMENT)** | **Phê duyệt bởi:** Solution Architect & Tech Lead  
> **Tham chiếu:** [srs.md](../../business-spec/MUSIC_TRACKER_MVP/srs.md) (Mục 11), [ADR-0003](../../decisions/0003-frontend-react-vite-shadcn-tailwind.md), [tech-stack.md](../../guidelines/frontend/tech-stack.md), [coding-convention.md](../../guidelines/frontend/coding-convention.md).

---

### 1. Mục tiêu & Phạm vi (Goal & Scope)
- **Mục tiêu:** Xây dựng ứng dụng Frontend Single Page Application (SPA) bằng React 19, Vite, Tailwind CSS và shadcn/ui. Cung cấp giao diện trực quan để người dùng kết nối/ngắt kết nối tài khoản Spotify, chọn tần suất đồng bộ, kích hoạt sync thủ công và theo dõi nhật ký thực thi.
- **Phạm vi:**
  - `src/components/ui/`: Bộ linh kiện shadcn/ui (Button, Card, Badge, Dialog, Table, Select, Switch, Progress, Toast).
  - `src/modules/connection/`: Màn hình & component quản lý liên kết tài khoản.
  - `src/modules/sync/`: Màn hình cấu hình chu kỳ & bảng nhật ký đồng bộ.
  - `src/modules/history/`: Màn hình hiển thị danh sách lịch sử nghe nhạc gần đây.

### 2. Luồng Dữ liệu (Data Flow)
```text
React Component ──► TanStack Query Hook ──► API Client (fetch/axios)
        │
        ▼
Backend API (/api/v1) ──► Envelope Response { code, message, data }
        │
        ▼
TanStack Query Cache ──► Re-render UI & Toast thông báo
```

### 3. Module & File bị Ảnh hưởng
- `src/app/App.tsx`, `src/app/providers.tsx`, `src/app/router.tsx`
- `src/core/api/api-client.ts`: Cấu hình base fetch client, xử lý unwrapping envelope `{ code, message, data }`.
- `src/modules/connection/`: `useConnectionStatus`, `ConnectionCard`, `ScopeModal`.
- `src/modules/sync/`: `useSyncStatus`, `useTriggerSync`, `SyncIntervalSelector`, `SyncRunTable`.
- `src/modules/history/`: `useListeningHistory`, `ListeningEventList`.

### 4. Thay đổi API / Interface
- Tiêu thụ trực tiếp các API do Backend cung cấp:
  - `/api/v1/provider/spotify/*`
  - `/api/v1/sync/*`
  - `/api/v1/listening-events`

### 5. Ảnh hưởng UI / UX
- Thiết kế giao diện hiện đại, chuẩn mực:
  - Nút bấm kết nối có logo Spotify, hiển thị badge xanh lá khi `CONNECTED`.
  - Hiệu ứng spinning khi đang sync; nút manual sync bị disable tạm thời khi job đang chạy.
  - Hiển thị toast thông báo kết quả: "Đã nạp thành công 12 bài hát mới".
  - Bảng lịch sử nghe nhạc hiển thị ảnh bìa, tên bài hát, nghệ sĩ, mốc `playedAt` (định dạng theo giờ địa phương).

### 6. Trường hợp Biên (Edge Cases)
- **Mất kết nối mạng Client:** TanStack Query tự động retry với exponential backoff và hiển thị cảnh báo offline.
- **Trạng thái REAUTH_REQUIRED:** Hiển thị banner cảnh báo màu hổ phách (Amber) yêu cầu người dùng bấm nút cấp quyền lại.
- **Không có bản ghi nghe:** Hiển thị Empty State thân thiện kèm nút hướng dẫn mở Spotify nghe nhạc.

### 7. Rủi ro & Giả định (Risks & Assumptions)
- **Rủi ro:** CORS issue giữa Frontend (vd: port 5173) và Backend (port 3000).
  - *Biện pháp:* Cấu hình CORS middleware trên NestJS và proxy server trong `vite.config.ts`.
- **Giả định:** Người dùng truy cập trên trình duyệt máy tính hoặc tablet hiện đại hỗ trợ ES2022+.

### 8. Chiến lược Kiểm thử (Testing Strategy)
- Kiểm thử unit component với Vitest & React Testing Library.
- Kiểm thử tích hợp luồng: Bấm nút "Đồng bộ ngay" $\rightarrow$ Kiểm tra trạng thái pending/spinner $\rightarrow$ Kiểm tra UI cập nhật danh sách bài hát mới.
- Kiểm thử responsive trên các kích thước màn hình (Desktop, Tablet, Mobile).

### 9. Ảnh hưởng Kiến trúc (Architecture Impact)
- Phân tách rõ ràng giữa Presentation Layer (UI) và Domain/API Logic, đảm bảo dễ bảo trì và mở rộng trong tương lai.
