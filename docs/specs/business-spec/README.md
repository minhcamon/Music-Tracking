# Business Spec (Tài liệu nghiệp vụ & Yêu cầu)

> Nơi lưu trữ **đặc tả yêu cầu nghiệp vụ (SRS / User Stories)** — đầu vào gốc để AI phân tích và triển khai.
> Nạp **theo nhu cầu** (on-demand), **KHÔNG `@import` vào `AGENTS.md`** nhằm tránh tràn context window.

---

## 1. Vai trò trong luồng vận hành

```text
Yêu cầu nghiệp vụ (docs/specs/business-spec/<MÃ_CHỨC_NĂNG>/)
  ├── 1. solution-architect  → Sinh tài liệu thiết kế (docs/specs/design/<MÃ_CHỨC_NĂNG>/)
  ├── 2. architect-reviewer  → Kiểm tra & xác nhận thiết kế
  └── 3. developer-*         → Đọc spec + design để lập task và viết code
```

Khi bạn ra lệnh "Làm function [X]", AI sẽ tìm kiếm tài liệu tương ứng tại thư mục này để nạp context logic trước khi viết code.

---

## 2. Quy ước tổ chức

- **Cấu trúc thư mục:** Mỗi chức năng/module tổ chức thành 1 thư mục riêng:

```text
docs/specs/business-spec/
├── _template/             # Mẫu spec chuẩn hóa để sử dụng khi cần
│   └── business-spec.md
└── MUSIC_TRACKER_MVP/     # Đặc tả MVP thu thập dữ liệu Spotify
    └── srs.md
```

- **Tên mã chức năng (`<MÃ_CHỨC_NĂNG>`):** Viết hoa, ngắn gọn, dùng tiếng Anh (ví dụ: `MUSIC_TRACKER_MVP`, `AUTH`, `SYNC`). Thư mục thiết kế tương ứng trong `docs/specs/design/` sẽ dùng chung mã này.
- **Nội dung:** Tập trung vào logic nghiệp vụ (Ai dùng, luồng đi thế nào, input/output gì, điều kiện lỗi ra sao). KHÔNG đưa code hoặc cấu hình kỹ thuật sâu vào đây.

---

## 3. Khung mẫu Spec nhanh (Nếu bạn tự viết)

Khi làm dự án cá nhân hoặc nhận yêu cầu tóm tắt, chỉ cần viết file markdown ngắn gọn với 4 mục chính:

1. **Mục tiêu (Objective):** Tính năng này giải quyết bài toán gì?
2. **Luồng thao tác (Main Flow):**
   - **Bước 1:** Người dùng gửi thông tin gì.
   - **Bước 2:** Hệ thống kiểm tra điều kiện gì.
   - **Bước 3:** Phản hồi thành công.
3. **Quy tắc nghiệp vụ & Trường hợp lỗi (Business Rules & Edge Cases):**
   - Điều kiện validate dữ liệu (độ dài, định dạng, trùng lặp).
   - Mã lỗi hoặc thông báo cần hiển thị khi sai điều kiện.
4. **Quyền hạn (Permissions):** Ai được phép thao tác (Public, User, hay Admin).

---

## 4. Lưu ý quan trọng

- **Bảo mật:** Tuân thủ [security-policy.md](../../guidelines/shared/security-policy.md). Tuyệt đối không dán mật khẩu thật, token thật hay thông tin nhạy cảm của khách hàng vào tài liệu spec.
- **Đồng bộ hóa:** Nếu nghiệp vụ thay đổi, cập nhật file markdown tại đây trước, sau đó yêu cầu AI đồng bộ lại code tương ứng.
