# Project Context (Product & Business Truth)

> Tài liệu định nghĩa mục tiêu sản phẩm, tầm nhìn, đối tượng người dùng và các ràng buộc cốt lõi.
> Đây là "Kim chỉ nam" cho AI để hiểu rõ giá trị nghiệp vụ của hệ thống trước khi thực thi bất kỳ tác vụ nào.
> Tham chiếu chính thức: `Music Tracker — Software Requirements Specification v1.0 (Final).md`.

---

## 1. Tổng quan Sản phẩm (Product Overview)

- **Tên dự án / Sản phẩm:** `Music Tracker` (Tên làm việc; các ứng viên đặt tên lại: `LexiListen`, `LexiHear`).
- **Trạng thái:** Final Draft v1.0 — Phạm vi kỹ thuật đã chốt; Spotify Policy Clearance đang chờ xác nhận (Release Blocker).
- **Loại sản phẩm:** Personal Music Activity Tracker (Nền tảng độc lập).
- **Provider đầu tiên:** Spotify (Web API).
- **Mục tiêu cốt lõi (Core Mission):**
  - Biến lịch sử nghe nhạc rải rác ở nhiều dịch vụ thành một bộ dữ liệu thống nhất, trung thực về nguồn gốc, không suy diễn những gì provider không cung cấp, và tôn trọng chính sách của từng nền tảng.
- **Tầm nhìn (Vision Statement):**
  - *Một nơi duy nhất để hiểu bạn đã nghe gì, khi nào và như thế nào, bất kể bạn nghe ở đâu.*
- **Vấn đề giải quyết (Problem Statement):**
  - Người dùng nghe nhạc trên nhiều dịch vụ (Spotify, Apple Music, YouTube Music, local...), nhưng lịch sử nghe nằm rải rác, mỗi nơi một định dạng và giới hạn khác nhau. Dữ liệu nghe không thuộc về người dùng và dễ bị mất theo thời gian.
- **Giá trị mang lại (Value Proposition):**
  - Nền tảng dữ liệu nghe nhạc có xuất xứ rõ ràng (provenance), lưu trữ độc lập lâu dài dưới quyền kiểm soát của người dùng, chuẩn hóa dữ liệu đa nguồn mà không suy diễn sai lệch.

---

## 2. Vai trò trong Hệ sinh thái (Ecosystem Role)

Music Tracker là một trong ba trụ cột của **Personal English Learning Ecosystem**:
1. **LocalRead:** Nền tảng đọc sách độc lập, quản lý nội dung và trải nghiệm đọc.
2. **Music Tracker:** Nền tảng theo dõi, chuẩn hóa và lưu trữ lịch sử nghe nhạc đa nguồn.
3. **English Hub:** Trung tâm quản lý quá trình học tiếng Anh và kết nối các nguồn nội dung.

### Nguyên tắc Độc lập Tuyệt đối:
- Music Tracker là **một dự án độc lập hoàn chỉnh**, sở hữu backend, database, API và giao diện riêng.
- Vẫn đầy đủ chức năng tracking ngay cả khi English Hub không tồn tại.
- Hỗ trợ nhạc Việt, nhạc Anh và mọi ngôn ngữ bình đẳng; không bị giới hạn bởi mục tiêu học tiếng Anh.
- Không có phụ thuộc ngược: Music Tracker không import code, không chia sẻ database và không yêu cầu English Hub để chạy. English Hub chỉ là một consumer tùy chọn qua API có versioning & authentication.
- **Lưu ý Policy:** Dữ liệu có nguồn gốc Spotify **tuyệt đối không được chuyển** sang English Hub cho đến khi có xác nhận chính sách bằng văn bản từ Spotify.

---

## 3. Đối tượng Người dùng (Target Audience / Personas)

1. **Người nghe nhạc cá nhân (Primary Persona — Music Listener):**
   - **Mục tiêu:** Lưu trữ lịch sử nghe nhạc cá nhân lâu dài, theo dõi thói quen nghe đa nền tảng, quản lý kết nối dịch vụ nhạc (bắt đầu từ Spotify).
   - **Điểm đau (Pain points):** Lịch sử trên Spotify bị trôi nhanh (Recently Played chỉ lưu tối đa 50 bài), không tổng hợp được khi nghe nhiều nền tảng, sợ mất dữ liệu.
2. **Người học ngôn ngữ (Future Secondary Persona — via English Hub):**
   - **Mục tiêu:** Học từ vựng, shadowing qua bài hát yêu thích.
   - **Ràng buộc:** Chỉ khả thi khi có dữ liệu từ các nguồn mở/local hoặc khi Spotify chấp thuận cho chuyển dữ liệu.

---

## 4. Các Trụ cột Tính năng (Core Pillars)

1. **Multi-source Ingestion (Đa nguồn độc lập):**
   - Mỗi provider có một Adapter riêng biệt chịu trách nhiệm authentication, data collection, normalization và rate limit handling.
2. **Unified Model & Data Provenance (Mô hình thống nhất & Rõ nguồn gốc):**
   - Thực thể trung tâm là `ListeningEvent`. Phân biệt rõ: dữ liệu quan sát được từ provider, dữ liệu vận hành do tracker sinh ra, và dữ liệu ước tính.
3. **Honest Data (Dữ liệu trung thực — Không suy diễn):**
   - Không tự suy diễn thời lượng nghe thực tế (`listenedDurationMs`), thời điểm bắt đầu/kết thúc (`startedAt`/`endedAt`), hay completion rate nếu provider không cung cấp.
4. **Strict Policy Compliance (Tuân thủ chính sách nghiêm ngặt):**
   - Tuân thủ Spotify Developer Terms & Policy. Áp dụng Policy Gate: Khóa toàn bộ tính năng analytics, profiling, AI/ML và data transfer đối với dữ liệu Spotify trong MVP.

---

## 5. Ràng buộc Dự án (Project Constraints)

- **Ràng buộc Kiến trúc:** Modular Monolith (NestJS + TypeScript + Prisma + PostgreSQL + React/Vite/shadcn/ui). Không triển khai microservices, Redis hay message queue trong MVP.
- **Ràng buộc Môi trường Vận hành:** Docker Compose + VPS, Node.js LTS, PostgreSQL.
- **Ràng buộc Spotify Policy (Release Blocker):**
  - Không phân tích nội dung Spotify để tạo chỉ số phái sinh, usage statistics, user taste profile, benchmarking.
  - Không đưa dữ liệu Spotify vào mô hình AI/ML.
  - Không chuyển dữ liệu sang English Hub hoặc dịch vụ khác.
  - Development Mode quota: Cửa sổ 30 giây, tối đa 5 users trong allowlist, cần tài khoản Spotify Premium của chủ app để kiểm thử.
