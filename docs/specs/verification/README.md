# Verification & Validation Evidence

> Thư mục lưu trữ chiến lược kiểm thử, kịch bản xác minh đa tầng (Layer, Integration, Vertical Flow) và bằng chứng nghiệm thu chất lượng mã nguồn.

## Các cấp độ xác minh:
1. **Layer Verification:** Kiểm thử đơn vị, kiểm tra logic từng lớp (Service, Controller, Repository, Component).
2. **Integration Verification:** Kiểm thử giao tiếp giữa các thành phần (API contract, DB query, State store).
3. **Vertical Verification (E2E Business Flow):** Kiểm thử toàn diện hành trình người dùng từ UI $\rightarrow$ API $\rightarrow$ Backend Logic $\rightarrow$ DB $\rightarrow$ Response $\rightarrow$ UI State $\rightarrow$ Khôi phục trạng thái.
