# PLAN-03: Backend Core & Spotify Provider Integration

> **Mã kế hoạch:** `PLAN-03` | **Mã chức năng:** `MUSIC_TRACKER_MVP`  
> **Trạng thái:** **ĐÃ PHÊ DUYỆT (READY TO IMPLEMENT)** | **Phê duyệt bởi:** Solution Architect & Tech Lead  
> **Tham chiếu:** [srs.md](../../business-spec/MUSIC_TRACKER_MVP/srs.md) (FR-01, FR-02, FR-09), [architecture.md](../../context/architecture.md#L32), [ADR-0001](../../decisions/0001-backend-modular-monolith-nestjs.md).

---

### 1. Mục tiêu & Phạm vi (Goal & Scope)
- **Mục tiêu:** Xây dựng khung Backend Modular Monolith với NestJS, hoàn thiện Module kết nối Spotify OAuth 2.0 (Authorization Code Flow), cơ chế mã hóa AES-256-GCM lưu trữ Token và Adapter giao tiếp Spotify API.
- **Phạm vi:**
  - `src/common/`: Envelope interceptor `{ code, message, data }`, exception filter, crypto utility.
  - `src/modules/provider/`: ProviderConnectionController & Service.
  - `src/integrations/spotify/`: SpotifyApiClient, SpotifyAdapter, SpotifyPlayHistoryMapper.

### 2. Luồng Dữ liệu (Data Flow)
```text
User ──► FE ──► GET /api/v1/provider/spotify/auth-url ──► Redirect Spotify Auth
       │
Spotify Callback ──► GET /api/v1/provider/spotify/callback?code=...
       │
NestJS Backend ──► Trao đổi Token với Spotify ──► Mã hóa AES-256-GCM ──► Lưu provider_connections (CONNECTED)
```

### 3. Module & File bị Ảnh hưởng
- `src/main.ts`, `src/app.module.ts`
- `src/common/utils/crypto.util.ts`: Mã hóa/giải mã AES-256-GCM.
- `src/common/filters/http-exception.filter.ts`: Chuẩn hóa lỗi API envelope.
- `src/common/interceptors/transform-response.interceptor.ts`: Bọc dữ liệu response `{ code: 0, message: "OK", data }`.
- `src/modules/provider/`: Quản lý kết nối, lưu token, ngắt kết nối.
- `src/integrations/spotify/`: Độc quyền xử lý HTTP client, refresh token và mapping.

### 4. Thay đổi API / Interface
- `GET /api/v1/provider/spotify/auth-url`: Lấy URL ủy quyền OAuth kèm state/PKCE.
- `GET /api/v1/provider/spotify/callback`: Tiếp nhận authorization code, trao đổi access/refresh token.
- `GET /api/v1/provider/spotify/status`: Kiểm tra trạng thái kết nối (`CONNECTED`, `REAUTH_REQUIRED`, `DISCONNECTED`).
- `DELETE /api/v1/provider/spotify/disconnect`: Thu hồi token và ngắt kết nối.

### 5. Ảnh hưởng UI / UX
- Cung cấp endpoints để giao diện hiển thị nút "Kết nối Spotify", avatar/email người dùng và trạng thái sẵn sàng đồng bộ.

### 6. Trường hợp Biên (Edge Cases)
- **Người dùng từ chối cấp quyền trên Spotify:** Trả về mã lỗi thân thiện, không tạo bản ghi connection.
- **Token hết hạn khi đang gọi API:** Tự động phát hiện 401 hoặc kiểm tra `tokenExpiresAt` để gọi refresh token trước khi thực thi.
- **Refresh token bị thu hồi:** Chuyển trạng thái sang `REAUTH_REQUIRED`, gửi thông báo cho user đăng nhập lại.

### 7. Rủi ro & Giả định (Risks & Assumptions)
- **Rủi ro:** Khóa `ENCRYPTION_SECRET` bị mất hoặc sai độ dài 32 bytes $\rightarrow$ Không thể giải mã token.
  - *Biện pháp:* Validate chặt chẽ độ dài biến môi trường ngay lúc khởi động app.
- **Giả định:** Ứng dụng đã đăng ký thành công trên Spotify Developer Dashboard và có Client ID/Secret.

### 8. Chiến lược Kiểm thử (Testing Strategy)
- Unit test thuật toán mã hóa/giải mã AES-256-GCM (`crypto.util.spec.ts`).
- Mock Spotify OAuth endpoint để test luồng callback và lưu DB.
- Test endpoint envelope format qua Supertest (E2E).

### 9. Ảnh hưởng Kiến trúc (Architecture Impact)
- Bảo toàn nguyên tắc **Provider Isolation**: Tuyệt đối không import thư viện hoặc types của Spotify vào core domain.

