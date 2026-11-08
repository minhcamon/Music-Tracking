# Coding Convention — Backend NestJS / TypeScript

> Quy ước lập trình **NestJS & TypeScript** chuẩn cho Backend.
> **Clean Code & Contract-First**: Đảm bảo tính nhất quán, dễ đọc, an toàn kiểu dữ liệu compile-time và tối ưu hiệu năng.
> Bổ trợ: [tech-stack.md](tech-stack.md), [api-convention.md](api-convention.md).
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md`.

---

## 1. Quy ước Đặt tên (Naming Conventions)

### 1.1 Quy tắc chung
- **MUST** đặt tên mọi định danh (class, interface, type, method, biến, hằng số, file) **100% bằng tiếng Anh** mô tả đúng vai trò nghiệp vụ. **NEVER** đặt tên bằng tiếng Việt hay phiên âm.
- Đặt tên biến **tự giải thích vai trò** (self-documenting). Tránh các tên viết tắt vô nghĩa (`tmp`, `chk`, `data1`).

### 1.2 Tên file & thư mục
- Tên thư mục và tên file sử dụng **kebab-case** có hậu tố định danh vai trò:

| Vai trò | Quy cách đặt tên file | Ví dụ |
|---|---|---|
| Module | `[name].module.ts` | `provider.module.ts`, `synchronization.module.ts` |
| Controller | `[name].controller.ts` | `provider-connection.controller.ts`, `sync.controller.ts` |
| Service | `[name].service.ts` | `provider-token.service.ts`, `sync-processor.service.ts` |
| Repository | `[name].repository.ts` | `listening-event.repository.ts` |
| DTO Request/Response | `[feature].dto.ts` | `sync-trigger.dto.ts`, `provider-status.dto.ts` |
| Adapter / Client | `[provider].adapter.ts`, `[provider].client.ts` | `spotify.adapter.ts`, `spotify-api.client.ts` |
| Exception Filter | `[name].filter.ts` | `http-exception.filter.ts` |
| Interceptor | `[name].interceptor.ts` | `transform-response.interceptor.ts` |
| Interface / Type | `[name].interface.ts`, `[name].type.ts` | `music-provider.interface.ts`, `spotify-api.types.ts` |

### 1.3 Class, Interface & Type
- **Class, Interface, Type alias, Enum:** Dùng **PascalCase**:
  - `ProviderConnectionService`, `ListeningEventController`.
  - Interface đại diện hợp đồng nghiệp vụ: Không dùng tiền tố `I` (dùng `MusicProviderAdapter`, `SyncProcessor`).
  - Enum: `ConnectionStatus`, `SyncStatus`, `SyncMode`.

### 1.4 Phương thức (Method) & Biến
- Dùng **camelCase** bắt đầu bằng động từ rõ nghĩa:
  - `createConnection()`, `refreshToken()`, `retrieveRecentlyPlayed()`, `commitCheckpoint()`.
- Phương thức trả về **boolean** phải bắt đầu bằng: `is`, `has`, `can`, `should` (`isConnected`, `hasExpired`, `canSync`).
- **Hằng số (`const` toàn cục / static readonly)**: Dùng **UPPER_SNAKE_CASE** (`DEFAULT_SYNC_INTERVAL_MINUTES`, `OVERLAP_BUFFER_MS`).

---

## 2. Định dạng & Phong cách Mã nguồn (Code Style)

### 2.1 Thụt lề & Cú pháp
- **2 khoảng trắng (spaces)** cho mỗi cấp thụt lề, **KHÔNG** dùng tab.
- Độ dài dòng tối đa **120 ký tự**.
- Luôn sử dụng dấu chấm phẩy `;` ở cuối câu lệnh.
- Sử dụng dấu ngoặc nhọn `{}` cho mọi khối điều kiện (`if`, `else`, `for`), kể cả khi chỉ có 1 dòng.

### 2.2 An toàn Kiểu dữ liệu (Type Safety)
- Bật `"strict": true` trong `tsconfig.json`.
- **CẤM lạm dụng kiểu `any`**. Nếu chưa xác định rõ kiểu từ bên thứ ba, dùng `unknown` kết hợp type guards hoặc định nghĩa interface chi tiết.
- Tận dụng Union types và Enums thay vì string literal trôi nổi.

### 2.3 Dependency Injection trong NestJS
- Luôn inject dependency qua Constructor sử dụng cú pháp ngắn gọn `private readonly`:
  ```typescript
  @Injectable()
  export class SyncProcessorService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly spotifyAdapter: SpotifyAdapter,
      private readonly logger: CustomLoggerService,
    ) {}
  }
  ```

---

## 3. Kiến trúc Phân tầng & Đóng gói (Modular Encapsulation)

### 3.1 Quy tắc Cô lập Provider (Provider Isolation Rule)
- Toàn bộ các kiểu dữ liệu, API URL, header và logic đặc thù của Spotify **chỉ được phép tồn tại** trong `src/integrations/spotify/`.
- Khi dữ liệu vượt qua biên giới của Adapter để đi vào tầng Domain (`modules/listening/`), nó bắt buộc phải được ánh xạ sang thực thể chuẩn hóa `ListeningEvent`.
- **CẤM** import bất kỳ type nào từ `integrations/spotify/` vào các service của `modules/listening/`.

### 3.2 Quy tắc Dữ liệu Trung thực (Honest Data Invariants)
- Khi map dữ liệu nghe từ Spotify:
  - `startedAt` = `null`
  - `endedAt` = `null`
  - `listenedDurationMs` = `null`
  - `startProgressMs` = `null`
  - `endProgressMs` = `null`
  - `completionRate` = `null`
- Tuyệt đối không tự tính toán thời lượng nghe từ `trackDurationMs` hay `playedAt`.

---

## 4. Xử lý DTO & Validation

- Mọi endpoint nhận Request Body hoặc Query Params đều phải có DTO tương ứng.
- Sử dụng các decorator của `class-validator` để ràng buộc chặt chẽ:
  ```typescript
  export class UpdateSyncSettingsDto {
    @IsEnum(SyncMode)
    syncMode: SyncMode;

    @IsOptional()
    @IsIn([15, 30, 60])
    syncIntervalMinutes?: number;
  }
  ```
- Kích hoạt `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` toàn cục.

---

## 5. Xử lý Ngoại lệ (Exception Handling) & Logging

- **Không nuốt lỗi:** Tuyệt đối không dùng `catch (e) {}` rỗng.
- Ném ngoại lệ chuẩn của NestJS (`NotFoundException`, `BadRequestException`, `UnauthorizedException`) với mã lỗi rõ ràng.
- Ghi log có cấu trúc:
  ```typescript
  this.logger.error(`[SYNC_FAILED] connectionId=${connectionId} error=${error.message}`, error.stack);
  ```
- **Bảo mật Log:** Không ghi token, client secret, hoặc thông tin cá nhân của người dùng vào log.

---

## 6. MUST / NEVER (Backend Rules)

- **MUST** lưu trữ toàn bộ mốc thời gian dưới dạng chuẩn **UTC** với độ chính xác millisecond.
- **MUST** bọc 100% response trả về Client qua Envelope chuẩn `{ code, message, data }`.
- **MUST** tôn trọng header `Retry-After` khi nhận HTTP 429 từ Spotify.
- **NEVER** hardcode secret, API key hay Spotify Client Secret trong source code.
- **NEVER** tự ý suy diễn hoặc bịa đặt dữ liệu phát nhạc mà Spotify không cung cấp.
- **NEVER** gọi trực tiếp thư viện Spotify SDK từ core business modules.
