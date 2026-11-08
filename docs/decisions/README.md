# Architecture Decision Records (ADR)

Thư mục lưu trữ các **quyết định kiến trúc quan trọng (ADR)** của dự án theo chuẩn format Michael Nygard.

---

## 1. Mục đích & Phạm vi áp dụng

- **ADR là gì?** Ghi nhận các quyết định kỹ thuật mang tính nền tảng, có sự đánh đổi (trade-offs) và tác động lâu dài đến toàn bộ hệ thống (ví dụ: lựa chọn cơ chế xác thực, chiến lược phân vùng CSDL, phương án đồng bộ dữ liệu, ranh giới phân tách modules).
- **Phân biệt với Log phiên:** Các quyết định kỹ thuật nhỏ, mang tính cục bộ trong phiên code hàng ngày (như đặt tên hàm, chọn vòng lặp) được ghi tự động vào `.agents/state/<dev-id>/decisions-log.md`, **không** lập ADR tại đây.

---

## 2. Quy trình tạo & Cập nhật ADR

1. **Khởi tạo:** Sao chép file `_template.md` thành file mới theo định dạng `NNNN-tieu-de-kebab-case.md` (ví dụ: `0001-su-dung-tanstack-query-quan-ly-server-state.md`).
2. **Số thứ tự (`NNNN`):** 4 chữ số tăng dần liên tục (`0001`, `0002`...). Số thứ tự là **bất biến**, không tái sử dụng kể cả khi ADR đó bị hủy bỏ.
3. **Vòng đời trạng thái:**
   - `Proposed`: Đang đề xuất, chờ thảo luận hoặc review qua PR/MR.
   - `Accepted`: Đã được duyệt và áp dụng chính thức vào dự án.
   - `Deprecated`: Quyết định không còn giá trị áp dụng.
   - `Superseded`: Bị thay thế hoàn toàn bởi một ADR mới hơn (ghi rõ: `Superseded by ADR-XXXX`).

> **Nguyên tắc bất biến (Immutability):** Không sửa đổi nội dung quyết định của một ADR đã ở trạng thái `Accepted`. Nếu muốn thay đổi hướng đi, bắt buộc tạo một ADR mới và đánh dấu ADR cũ bị thay thế.

---

## 3. Tương tác với AI Agent

- Khi phân tích hoặc thiết kế tính năng mới, AI Agent sẽ quét thư mục này để đảm bảo giải pháp không vi phạm các quyết định kiến trúc đã `Accepted`.
- AI sử dụng skill `decisions-relevance` để rà soát, phát hiện các ADR lỗi thời, mâu thuẫn hoặc mồ côi so với hiện trạng source code.