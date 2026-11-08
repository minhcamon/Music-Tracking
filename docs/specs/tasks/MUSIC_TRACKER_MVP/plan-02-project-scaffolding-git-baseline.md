# PLAN-02: Khởi tạo Dự án & Git Baseline (Project Scaffolding Plan)

> **Mã kế hoạch:** `PLAN-02` | **Mã chức năng:** `MUSIC_TRACKER_MVP`  
> **Trạng thái:** **HOÀN THÀNH (DONE)** | **Phê duyệt bởi:** Solution Architect & Tech Lead  
> **Tham chiếu:** [git-workflow.md](../../guidelines/shared/git-workflow.md), [security-policy.md](../../guidelines/shared/security-policy.md).

---

### 1. Mục tiêu & Phạm vi (Goal & Scope)
- **Mục tiêu:** Khởi tạo Git repository sạch, cấu hình remote GitHub chính thức `https://github.com/minhcamon/Music-Tracking`, thiết lập tệp mẫu biến môi trường và container PostgreSQL cho môi trường dev.
- **Phạm vi:** Root repository setup, Docker Compose, `.gitignore`, `.env.example`.

### 2. Luồng Dữ liệu (Data Flow)
```text
Dev Local ──► Git Add / Conventional Commit ──► Branch 'main' ──► Push Origin (GitHub)
```

### 3. Module & File bị Ảnh hưởng
- `.gitignore`: Bổ sung toàn diện các quy tắc loại trừ secrets, node_modules, build outputs, logs.
- `.env.example`: Cung cấp đầy đủ danh mục biến môi trường yêu cầu.
- `docker-compose.yml`: Cấu hình PostgreSQL 16 Alpine container cho môi trường phát triển cục bộ.
- `AGENTS.md` & `README.md`: Cập nhật hướng dẫn vận hành nhanh.

### 4. Thay đổi API / Interface
- Không có (hạ tầng cấu hình môi trường).

### 5. Ảnh hưởng UI / UX
- Không có.

### 6. Trường hợp Biên (Edge Cases)
- **Rò rỉ credentials:** File `.gitignore` chủ động chặn toàn bộ các mẫu `.env*`, `*.pem`, `*.key`, `id_rsa`.
- **Độ trễ khởi động PostgreSQL:** Thêm khối `healthcheck` với lệnh `pg_isready` trong `docker-compose.yml`.

### 7. Rủi ro & Giả định (Risks & Assumptions)
- **Rủi ro:** Xung đột cổng 5432 cục bộ nếu máy dev đã có PostgreSQL service đang chạy.
  - *Biện pháp:* Cấu hình ánh xạ port linh hoạt qua biến môi trường khi cần.

### 8. Chiến lược Kiểm thử (Testing Strategy)
- Kiểm tra `git status` và `git remote -v`.
- Thực hiện `git push -u origin main` thành công.
- Kiểm tra cú pháp `docker-compose.yml` qua `docker-compose config`.

### 9. Ảnh hưởng Kiến trúc (Architecture Impact)
- Đảm bảo tính bảo mật và toàn vẹn mã nguồn ngay từ commit gốc đầu tiên.

