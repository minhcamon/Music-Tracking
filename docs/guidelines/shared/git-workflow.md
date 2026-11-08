# Git Workflow & Commit Convention

> Quy chuẩn quản lý nhánh (branch), cam kết mã nguồn (commit) và quy trình mở Pull Request (PR) / Merge Request (MR).
> Mọi thành viên và AI Agent BẮT BUỘC tuân thủ nghiêm ngặt để đảm bảo lịch sử Git sạch, dễ truy vết.

---

## 1. Chiến lược phân nhánh (Branching Strategy)

Hệ thống áp dụng mô hình GitFlow rút gọn (Feature Branch Workflow):

| Tên nhánh | Vai trò | Quy tắc bảo vệ |
|---|---|---|
| `main` / `master` | Mã nguồn Production đang chạy thực tế | **Protected:** Cấm commit trực tiếp, cấm force-push. Chỉ merge qua PR có duyệt. |
| `develop` | Tích hợp các tính năng chuẩn bị release | **Protected:** Cấm commit trực tiếp. Merge từ các nhánh `feature/*`. |
| `feature/<ten-tinh-nang>` | Phát triển tính năng mới | Rẽ nhánh từ `develop`. Đặt tên ngắn gọn, kebab-case (vd: `feature/auth-jwt`). |
| `bugfix/<ten-loi>` | Sửa lỗi phát hiện trong quá trình dev/test | Rẽ nhánh từ `develop` (vd: `bugfix/fix-null-pointer-user`). |
| `hotfix/<ma-loi>` | Vá lỗi khẩn cấp trực tiếp trên Production | Rẽ nhánh trực tiếp từ `main`, xong merge ngược về cả `main` và `develop`. |

---

## 2. Quy chuẩn Commit Message (Conventional Commits)

Định dạng bắt buộc: `<type>(<scope>): <mô tả ngắn bằng tiếng Anh hoặc tiếng Việt không dấu>`

### 2.1 Danh mục Type hợp lệ
- **`feat`**: Tính năng mới cho người dùng.
- **`fix`**: Sửa lỗi logic hoặc lỗi giao diện.
- **`refactor`**: Tái cấu trúc mã nguồn (không thêm tính năng, không sửa lỗi, chỉ tối ưu cấu trúc).
- **`perf`**: Thay đổi tối ưu hóa hiệu năng.
- **`docs`**: Cập nhật tài liệu, README, spec, comment.
- **`style`**: Định dạng code (thụt lề, chấm phẩy, format) không ảnh hưởng tới logic chạy.
- **`test`**: Bổ sung hoặc sửa đổi Unit Test / Integration Test.
- **`chore`**: Cập nhật build script, dependency, cấu hình IDE, CI/CD.

### 2.2 Ví dụ mẫu
```text
feat(auth): add refresh token rotation mechanism
fix(payment): resolve precision loss in total amount calculation
refactor(user): split UserService into separate domain services
chore(deps): bump spring-boot to version 3.3.4
docs(api): update swagger spec for user endpoints
```

---

## 3. Quy trình tạo Pull Request (PR / MR)

Mỗi PR khi tạo bắt buộc phải có mô tả rõ ràng:

- **Tiêu đề:** Khớp theo định dạng commit message chuẩn.
- **Nội dung:**
  - **Tóm tắt thay đổi:** Những gì đã làm trong PR này.
  - **File ảnh hưởng chính:** Danh sách module/controller/service chính bị tác động.
  - **Cách kiểm thử (Testing steps):** Các bước để reviewer verify tính đúng đắn.
- **Điều kiện Merge:**
  - 100% test case tự động phải pass xanh.
  - Không có xung đột (merge conflicts) với nhánh đích.
  - Code phải được review và pass linter/formatter.

---

## 4. MUST / NEVER đối với AI Agent

- **MUST** kiểm tra nhánh hiện tại trước khi tạo commit (`git status`, `git branch`).
- **MUST** viết commit message đúng chuẩn Conventional Commits.
- **NEVER** thực hiện lệnh `git push --force` lên nhánh `main` hoặc `develop`.
- **NEVER** commit các file cấu hình môi trường chứa secret thật (`.env`, `credentials.json`, `id_rsa`).
- **NEVER** gộp chung code tính năng mới và code format hàng loạt vào trong cùng một commit.