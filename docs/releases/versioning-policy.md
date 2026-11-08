# Quy chuẩn Quản lý Phiên bản (Versioning Policy) — Music Tracker

> Quy định chính thức về việc đánh số phiên bản, quản lý vòng đời phát hành, gắn thẻ Git (Git Tag), kiểm soát phiên bản API và Migration Cơ sở dữ liệu.
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md`, [git-workflow.md](../guidelines/shared/git-workflow.md).

---

## 1. Nguyên tắc Đánh số Phiên bản (Semantic Versioning 2.0.0)

Dự án áp dụng chuẩn **SemVer** theo định dạng: `MAJOR.MINOR.PATCH`

```text
       v 1 . 2 . 3 - alpha.1
         │   │   │     │
         │   │   │     └── Pre-release Identifier (alpha, beta, rc)
         │   │   └──────── PATCH (Sửa lỗi tương thích ngược)
         │   └──────────── MINOR (Thêm tính năng mới, giữ tương thích ngược)
         └──────────────── MAJOR (Thay đổi phá vỡ tương thích - Breaking changes)
```

### 1.1. Quy tắc Tăng Phiên bản
| Thành phần | Điều kiện tăng số | Ví dụ kịch bản |
|---|---|---|
| **MAJOR** (`X.0.0`) | Phá vỡ tương thích ngược API Contract (`/api/v1` $\rightarrow$ `/api/v2`), thay đổi kiến trúc cốt lõi, breaking change toàn bộ DB schema không thể migrate tự động. | Chuyển đổi toàn diện sang multi-provider hoặc thay đổi cấu trúc xác thực JWT |
| **MINOR** (`0.X.0` / `1.X.0`) | Bổ sung tính năng nghiệp vụ mới hoàn toàn nhưng vẫn bảo toàn tương thích ngược; bổ sung bảng mới hoặc trường nullable trong DB. | Bổ sung module Manual Sync, tích hợp thêm provider mới (Apple Music) |
| **PATCH** (`0.0.X` / `1.0.X`) | Vá lỗi kỹ thuật (bug fix), cải thiện hiệu năng (perf), chỉnh sửa giao diện nhỏ (hotfix) không làm đổi API hay DB schema. | Sửa lỗi tính toán Retry-After, xử lý edge case null display name |
| **Pre-release** (`-alpha`, `-beta`, `-rc`) | Các mốc xây dựng nội bộ trong quá trình phát triển tính năng trước khi chốt bản chính thức. | `v0.1.0-alpha.1` (Khởi tạo baseline & Schema v1.0) |

---

## 2. Chiến lược Gắn thẻ Git (Git Tagging Convention)

Mọi bản phát hành đều được gắn tag có ký tự tiền tố `v`:

```bash
# Tag bản pre-release kiểm thử nội bộ
git tag -a v0.1.0-alpha.1 -m "release(init): baseline architecture, docs and db schema v1.0"

# Tag bản phát hành chính thức
git tag -a v1.0.0 -m "release(mvp): official MVP release for Spotify tracking"

# Đẩy tag lên GitHub
git push origin --tags
```

---

## 3. Quản lý Phiên bản API (API Versioning)

- **Chuẩn định tuyến:** Đánh version trực tiếp trên đường dẫn URI theo định dạng `/api/v{major}`.
- **Hiện tại:** `/api/v1/`
  - Ví dụ: `/api/v1/provider/spotify/auth-url`, `/api/v1/sync/status`, `/api/v1/listening-events`
- **Quy tắc bất biến:**
  - Trong cùng một Major Version (v1), **CẤM** xóa trường, đổi tên trường hoặc thay đổi kiểu dữ liệu của trường đang có trong Response DTO.
  - Các trường mới bổ sung trong v1 **BẮT BUỘC** phải là trường tùy chọn (Optional / Nullable) để không làm vỡ các client đang tiêu thụ.
  - Phá vỡ contract bắt buộc phải nâng lên `/api/v2`.

---

## 4. Quản lý Phiên bản Cơ sở Dữ liệu (Prisma Migration Versioning)

- Mọi thay đổi schema CSDL phải được kiểm soát qua Prisma Migrate:
  - Tên migration đặt theo định dạng chuẩn: `YYYYMMDDHHMMSS_<ten_migration_ngan_gon_kebab_case>`
  - Ví dụ: `20261108183000_init_schema_v1`
- **Nguyên tắc an toàn:**
  - Môi trường Local: `npx prisma migrate dev --name <migration_name>`
  - Môi trường CI / Production: `npx prisma migrate deploy`
  - Tuyệt đối không can thiệp thủ công sửa file migration đã merge vào nhánh `main`.

---

## 5. Tiêu chí Phát hành Phiên bản (Release Gate & DoD)

Một phiên bản chỉ được gắn tag và phát hành khi thỏa mãn:
1. **Vertical Completeness:** Luồng nghiệp vụ của toàn bộ tính năng trong version đã được kiểm chứng thông suốt (End-to-End).
2. **Policy Compliance:** Không vi phạm bất kỳ điều khoản nào của Spotify Developer Policy (khóa phân tích thói quen, khóa chuyển dữ liệu sang English Hub).
3. **Honest Data Rule:** Toàn bộ bản ghi không tự suy diễn thời lượng phát.
4. **Security Pass:** Không có token dạng plain text; biến môi trường được bảo vệ qua `.gitignore`.
5. **Changelog Updated:** File `docs/releases/CHANGELOG.md` đã ghi nhận đầy đủ các mục thay đổi.
