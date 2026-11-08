# Tech Stack — Backend NestJS

> Quy chuẩn công nghệ Backend chuẩn cho dự án **NestJS + TypeScript**.
> Kiến trúc: **Modular Monolith**, phân tách Core Domain và Provider Integrations.
> Ràng buộc: AI bắt buộc tuân thủ danh mục công nghệ và thư viện được duyệt bên dưới, **không tự ý cài thêm dependencies**.
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 4).

---

## 1. Ngôn ngữ & Runtime

- **Node.js LTS (v20+ hoặc v22+)**.
- **TypeScript 5.x** với cấu hình strict mode (`"strict": true` trong `tsconfig.json`).
- Quản lý gói phụ thuộc: **pnpm** (ưu tiên) hoặc **npm**.
- Đóng gói triển khai: Multi-stage Dockerfile chạy trên container Node Alpine / Slim, phối hợp qua `docker-compose.yml`.

---

## 2. Framework & Thư viện Cốt lõi

| Phân nhóm | Công nghệ | Phiên bản khuyến nghị | Vai trò |
|---|---|---|---|
| Core Framework | **NestJS** | **10.x / 11.x** | Khung phát triển ứng dụng chính, Dependency Injection (IoC), Module System |
| Language | **TypeScript** | **5.x** | An toàn kiểu dữ liệu compile-time, decorators |
| Database & ORM | **PostgreSQL** + **Prisma** | **5.x / 6.x** | Hệ quản trị CSDL quan hệ và ORM type-safe hàng đầu |
| Database Migration | **Prisma Migrate** | Native | Quản lý schema evolution bằng các file SQL migration an toàn |
| Background Scheduler | **`@nestjs/schedule`** | Native | Quản lý tác vụ định kỳ (Cron jobs) phục vụ polling và đồng bộ |
| Authentication / OAuth | **Passport** (`@nestjs/passport`) | Chuẩn | Xử lý Authorization Code Flow với Spotify |
| DTO Validation | **`class-validator`** + **`class-transformer`** | Chuẩn | Validate dữ liệu đầu vào tự động qua `ValidationPipe` |
| API Standard & Docs | **`@nestjs/swagger`** (OpenAPI 3) | Chuẩn | Tự động sinh tài liệu Swagger UI tại `/api/docs` |
| HTTP Client | **Native Fetch** (Node 20+) hoặc **`@nestjs/axios`** | Native / 3.x | Giao tiếp REST API với Spotify và các dịch vụ ngoài |
| Testing Suite | **Jest** + **`@nestjs/testing`** | **29.x** | Unit test, Service mock, Integration test và E2E |

---

## 3. Cơ sở Dữ liệu & Quy tắc Migration (Prisma)

- **Hệ quản trị CSDL:** PostgreSQL 15+ / 16+.
- **Quy tắc Schema Prisma:**
  - Tên bảng: `snake_case` số nhiều thông qua thuộc tính `@@map("table_names")`.
  - Tên cột trên DB: `snake_case` thông qua `@map("column_name")`.
  - Tên field trong model Prisma: `camelCase` để đồng bộ hoàn toàn với TypeScript code.
  - Toàn bộ thời gian lưu dạng UTC: `@db.Timestamptz`.
- **Composite Unique Constraint:**
  - Bắt buộc khai báo ràng buộc chống trùng lặp: `@@unique([providerConnectionId, providerTrackId, playedAt])`.
- **Quy trình Migration:**
  - Môi trường dev: `npx prisma migrate dev --name <migration_name>`.
  - Môi trường production/CI: `npx prisma migrate deploy` (tuyệt đối không dùng `db push` trên production).

---

## 4. Kiến trúc Modular Monolith

Mọi module Backend tổ chức mã nguồn tuân thủ tính đóng gói cao:

```text
src/
├── common/             # Interceptors, Filters, Guards, Decorators, Utils
├── modules/            # Business modules trung lập (provider, listening, synchronization)
└── integrations/       # Các adapter chuyên biệt cho bên thứ ba (spotify, ...)
```

> **Quy tắc cô lập:** Thư mục `integrations/spotify/` là nơi DUY NHẤT được phép import các type hoặc logic đặc thù của Spotify Web API. Các module trong `modules/` chỉ làm việc với các interface và thực thể domain chuẩn hóa.

---

## 5. Danh mục Thư viện được duyệt (Approved Libraries)

> [!IMPORTANT]
> **Ràng buộc cứng đối với AI:** AI **CHỈ ĐƯỢC PHÉP** sử dụng các thư viện nằm trong danh sách này. Không tự ý thêm package ngoài vào `package.json` nếu chưa được phê duyệt.

| Thư viện | Mục đích sử dụng | Trạng thái |
|---|---|---|
| `@nestjs/common`, `@nestjs/core` | Core NestJS runtime | ✅ Duyệt |
| `@nestjs/platform-express` | HTTP server adapter | ✅ Duyệt |
| `@nestjs/config` | Quản lý biến môi trường (`.env`) an toàn | ✅ Duyệt |
| `@nestjs/schedule` | Động cơ hẹn giờ đồng bộ nền | ✅ Duyệt |
| `@nestjs/passport`, `passport` | Khung xác thực | ✅ Duyệt |
| `passport-oauth2` | Xử lý Spotify OAuth 2.0 Authorization Code Flow | ✅ Duyệt |
| `@prisma/client`, `prisma` | ORM type-safe và Migration tool | ✅ Duyệt |
| `class-validator`, `class-transformer` | Validate DTO request đầu vào | ✅ Duyệt |
| `@nestjs/swagger`, `swagger-ui-express` | Tài liệu hóa API Swagger UI | ✅ Duyệt |
| `@nestjs/axios`, `axios` (hoặc native fetch) | HTTP client gọi Spotify API | ✅ Duyệt |
| `jest`, `@nestjs/testing`, `ts-jest` | Khung kiểm thử tự động | ✅ Duyệt |
| `supertest` | Kiểm thử E2E HTTP endpoints | ✅ Duyệt |

---

## 6. Build & Scripts Chuẩn

- **Phát triển local:** `pnpm run start:dev` (hoặc `npm run start:dev`).
- **Prisma Studio:** `npx prisma studio` (mở giao diện duyệt CSDL nhanh).
- **Kiểm thử tự động:** `pnpm run test` (Unit test) và `pnpm run test:e2e` (E2E test).
- **Đóng gói production:** `pnpm run build` (`nest build`).
