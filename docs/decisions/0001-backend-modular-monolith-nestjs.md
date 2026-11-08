# ADR-0001: Lựa chọn Kiến trúc Modular Monolith với NestJS & TypeScript cho Backend

> Chuẩn định dạng: Architecture Decision Record (Michael Nygard).
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 4, Mục 5).

| Thuộc tính | Giá trị |
|---|---|
| **Trạng thái** | `Accepted` |
| **Ngày tạo** | 2026-11-03 |
| **Tác giả / Quyết định bởi** | Solution Architect |
| **Tài liệu liên quan** | `docs/context/architecture.md`, `docs/guidelines/backend/tech-stack.md` |

---

## 1. Bối cảnh (Context)

Music Tracker là một nền tảng theo dõi và chuẩn hóa lịch sử nghe nhạc cá nhân. Ở giai đoạn MVP, hệ thống tập trung vào việc tích hợp Spotify Web API, quản lý token, đồng bộ định kỳ và chuẩn hóa dữ liệu.
Hệ thống cần có độ ổn định cao, thời gian phát triển nhanh, cấu trúc phân tầng rõ ràng để dễ dàng mở rộng thêm các Adapter cho Apple Music, YouTube Music, Local files trong tương lai mà không làm phức tạp hóa hạ tầng vận hành.

---

## 2. Quyết định (Decision)

Hệ thống Backend sẽ được xây dựng theo mô hình **Modular Monolith** sử dụng **NestJS + TypeScript** (Node.js LTS).
- Core domain model hoàn toàn trung lập với các provider.
- Toàn bộ logic giao tiếp với Spotify được đóng gói cô lập trong thư mục `src/integrations/spotify/`.
- Chưa triển khai Microservices, Redis, Kafka hay RabbitMQ trong MVP.

**Phương án thay thế đã cân nhắc:**
- *Microservices:* Bị loại vì gây phức tạp hạ tầng không cần thiết (network overhead, deployment complexity, distributed transaction) cho một dự án cá nhân ở giai đoạn MVP.
- *Java & Spring Boot:* Đã cân nhắc ở starter kit gốc, nhưng bị loại vì TypeScript/NestJS đồng nhất ngôn ngữ với Frontend, nhẹ hơn về tài nguyên container trên VPS, và phù hợp với baseline kỹ thuật đã chốt trong SRS v1.0.

---

## 3. Hệ quả & Đánh đổi (Consequences)

### Tích cực (Pros)
- Tận dụng hệ sinh thái TypeScript đồng bộ (Fullstack TS).
- NestJS cung cấp cơ chế Dependency Injection (IoC), Module system mạnh mẽ, chuẩn hóa kiến trúc Clean Architecture.
- Dễ dàng triển khai đơn giản qua một container Docker Compose trên VPS.

### Tiêu cực & Chi phí đánh đổi (Cons / Trade-offs)
- Khi khối lượng dữ liệu nghe tăng rất lớn trong tương lai (hàng triệu events từ nhiều nguồn), có thể cần phân tách tác vụ worker/sync ra process riêng.

### Điểm cần theo dõi (Neutral / Follow-up)
- Giám sát CPU/Memory khi scheduler đồng bộ cho nhiều tài khoản; cân nhắc tách sync worker nếu tài nguyên VPS bị chiếm dụng lớn.

