---
name: verification
description: Multi-level verification skill covering Layer Verification, Integration Verification, and Vertical Completeness (E2E business flow validation).
---

# Multi-Level Verification Skill

> Kỹ năng xác minh chất lượng kỹ thuật đa cấp độ.
> Đảm bảo tính toàn vẹn của mã nguồn từ mức đơn vị (Layer), mức tích hợp (Integration) đến luồng nghiệp vụ thực tế hoàn chỉnh (Vertical Flow).

---

## 1. 3 Cấp độ Xác minh (Verification Levels)

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. LAYER VERIFICATION                                       │
│    -> Unit tests, Linter, Typescript check, Component/Class │
├─────────────────────────────────────────────────────────────┤
│ 2. INTEGRATION VERIFICATION                                 │
│    -> API Contract, Database Queries, Store/State Sync      │
├─────────────────────────────────────────────────────────────┤
│ 3. VERTICAL VERIFICATION (E2E Business Flow)                │
│    -> User Action -> UI -> API -> BE -> DB -> State -> UI   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Nguyên tắc Tính Toàn vẹn theo Chiều dọc (Vertical Completeness)

> **Nguyên lý:** *"Feature completion is not equivalent to layer completion."*
> Một tính năng người dùng KHÔNG ĐƯỢC coi là hoàn thành nếu chỉ có backend compile pass hoặc frontend render được mà chưa kiểm chứng luồng hoạt động thực tế.

### Chu trình Xác minh Vertical Flow Tiêu chuẩn:
1. **Khởi tạo:** Người dùng thực hiện thao tác (Click / Input / Upload).
2. **Xử lý:** Giao diện gọi API, Backend xử lý logic và ghi nhận vào CSDL / Storage.
3. **Phản hồi:** Trạng thái UI cập nhật chính xác (Loading $\rightarrow$ Success, hiển thị dữ liệu mới).
4. **Bảo toàn:** Refresh trang hoặc đóng/mở lại ứng dụng vẫn khôi phục chính xác trạng thái vừa lưu.
5. **Biên lỗi:** Thử nghiệm các trường hợp Empty State, Invalid Input, Network Error để đảm bảo ứng dụng không crash và báo lỗi thân thiện.

---

## 3. Checklist Đánh giá Hoàn thành (DoD Verification)

- [ ] Linter và Compiler không báo lỗi/cảnh báo nghiêm trọng.
- [ ] Logic nghiệp vụ tại Service/Domain đã được kiểm tra tính đúng đắn.
- [ ] Chuẩn API Envelope `{ code, message, data }` được tuân thủ.
- [ ] Luồng người dùng thực tế đã được kiểm chứng end-to-end.
- [ ] Các trạng thái UI (Loading, Empty, Error, Success) đều được xử lý đầy đủ.
