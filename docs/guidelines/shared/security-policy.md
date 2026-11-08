# Security Policy & Secure Coding Guidelines — Music Tracker

> Chính sách bảo mật và tiêu chuẩn viết mã an toàn cho toàn bộ dự án Music Tracker.
> Ràng buộc cứng: AI Agent TUYỆT ĐỐI KHÔNG sinh ra mã nguồn vi phạm các quy tắc bảo mật dưới đây.
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 12, Mục 13).

---

## 1. Quản lý Bí mật & Khóa (Secrets & Credentials)

- **CẤM TUYỆT ĐỐI hardcode bí mật:** Không bao giờ đưa `SPOTIFY_CLIENT_SECRET`, khóa mã hóa `ENCRYPTION_SECRET`, JWT Secret key trực tiếp vào mã nguồn hay file commit Git.
- **Biến môi trường:** Mọi cấu hình nhạy cảm nạp qua biến môi trường (`.env`). Commit file `.env.example` với giá trị mẫu an toàn. Thêm `.env`, `.env.*.local` vào `.gitignore`.
- **Mã hóa Token at Rest (BẮT BUỘC):**
  - Toàn bộ `accessToken` và `refreshToken` từ Spotify khi lưu vào bảng `provider_connections` **bắt buộc phải được mã hóa** bằng thuật toán đối xứng **AES-256-GCM**.
  - Khóa mã hóa (32 bytes) cấu hình qua `ENCRYPTION_SECRET`.
  - Mỗi bản ghi mã hóa lưu kèm Initialization Vector (IV 12 bytes ngẫu nhiên) và Authentication Tag (16 bytes) để chống can thiệp dữ liệu.
- **Phân tách Frontend / Backend:** `SPOTIFY_CLIENT_SECRET` và token bí mật tuyệt đối không bao giờ được gửi về Frontend.

---

## 2. Tuân thủ Chính sách Quyền riêng tư của Spotify (Privacy & Data Deletion)

- **Nguyên tắc Thu thập Tối thiểu (Data Minimization):**
  - Chỉ yêu cầu scope tối thiểu cần thiết cho nghiệp vụ: `user-read-recently-played`.
  - Không yêu cầu các scope vượt ngoài phạm vi (như `user-modify-playback-state`, `playlist-modify-public`).
- **Quy trình Xóa dữ liệu khi Ngắt kết nối (Disconnect & Data Purge):**
  - Khi người dùng kích hoạt ngắt kết nối (FR-02):
    1. Dừng ngay lập tức các tác vụ đồng bộ nền của kết nối đó.
    2. Thu hồi hoặc vô hiệu hóa refresh token trên hệ thống.
    3. Thực hiện quy trình xóa Spotify Personal Data đã lưu trữ theo yêu cầu của Spotify Developer Terms.
    4. Cập nhật trạng thái `ProviderConnection` sang `DISCONNECTED`.

---

## 3. Phòng chống Injection & Lỗi Bảo mật Web

- **SQL / Query Injection:**
  - Bắt buộc sử dụng Prisma ORM với parameterized queries có sẵn.
  - Tuyệt đối không dùng `$queryRawUnsafe` với chuỗi ghép thô từ người dùng.
- **XSS (Cross-Site Scripting):**
  - React JSX tự động escape dữ liệu khi hiển thị.
  - CẤM sử dụng `dangerouslySetInnerHTML` khi hiển thị tên bài hát, tên nghệ sĩ hoặc context từ API bên thứ ba.
- **Bảo vệ CORS & Headers:**
  - Cấu hình CORS chặt chẽ: Chỉ cho phép nguồn từ Frontend domain được cấu hình.
  - Sử dụng middleware bảo mật `helmet` trên NestJS production.

---

## 4. Bảo vệ Dữ liệu Nhạy cảm & Quy tắc Ghi Log (Data Privacy & Logging)

- **Quy tắc Ghi Log:**
  - Không bao giờ ghi access token, refresh token, authorization code, client secret hoặc toàn bộ payload thô từ Spotify vào file log.
  - Khi bắt ngoại lệ từ API bên ngoài, chỉ log HTTP status và message lỗi tóm tắt:
    ```typescript
    // CHUẨN AN TOÀN:
    this.logger.error(`[SPOTIFY_API_ERROR] status=${error.response?.status} message=${error.message}`);

    // NGUY HIỂM - CẤM:
    this.logger.error(`Error details:`, error); // Có thể phơi bày request config chứa Authorization Bearer token!
    ```
- **Dữ liệu Trả về API:**
  - Tuyệt đối không để lộ `accessTokenEncrypted`, `refreshTokenEncrypted` trong DTO trả về cho Client. Sử dụng DTO phân tách rõ ràng.

---

## 5. MUST / NEVER

- **MUST** sử dụng giao thức HTTPS cho toàn bộ giao tiếp với Spotify Web API và giữa Client/Server trên môi trường Production.
- **MUST** validate chặt chẽ kiểu dữ liệu, độ dài và enum của tất cả input đầu vào ở tầng Controller (`ValidationPipe`).
- **NEVER** phơi bày nguyên văn Stack Trace hoặc thông tin cấu trúc CSDL trong response trả về khi có lỗi 500.
- **NEVER** chuyển dữ liệu có nguồn gốc Spotify sang các hệ thống khác (English Hub) khi chưa có văn bản chấp thuận chính thức từ Spotify.
