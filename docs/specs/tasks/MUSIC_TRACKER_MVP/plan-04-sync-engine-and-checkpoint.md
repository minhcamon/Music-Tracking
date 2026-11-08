# PLAN-04: Synchronization Engine & Checkpoint Management

> **Mã kế hoạch:** `PLAN-04` | **Mã chức năng:** `MUSIC_TRACKER_MVP`  
> **Trạng thái:** **ĐÃ PHÊ DUYỆT (READY TO IMPLEMENT)** | **Phê duyệt bởi:** Solution Architect & Tech Lead  
> **Tham chiếu:** [srs.md](../../business-spec/MUSIC_TRACKER_MVP/srs.md) (FR-03 $\rightarrow$ FR-08, FR-10), [ADR-0004](../../decisions/0004-sync-engine-and-checkpoint-strategy.md), [ADR-0005](../../decisions/0005-spotify-developer-policy-gate-and-honest-data.md).

---

### 1. Mục tiêu & Phạm vi (Goal & Scope)
- **Mục tiêu:** Xây dựng động cơ thu thập lịch sử nghe nhạc tự động theo chu kỳ định kỳ (15/30/60 phút) qua `@nestjs/schedule` và hỗ trợ kích hoạt thủ công từ UI (Manual Sync). Quản lý checkpoint `lastProcessedPlayedAt`, bộ đệm overlap 2 phút và khử trùng lặp dữ liệu tuyệt đối.
- **Phạm vi:**
  - `src/modules/synchronization/`: SyncSchedulerService, SyncCoordinatorService, SyncProcessorService.
  - `src/modules/listening/`: ListeningEventService & ListeningEventRepository.

### 2. Luồng Dữ liệu (Data Flow)
```text
Cron (@nestjs/schedule) hoặc Manual Trigger ──► Tìm connection đến hạn (nextSyncAt <= NOW)
        │
Kiểm tra Token ──► Gọi Spotify API GET /v1/me/player/recently-played?after=...
        │
Ánh xạ qua Adapter ──► Normalized ListeningEvent
        │
Insert DB (skipDuplicates) ──► COMMIT Checkpoint (lastProcessedPlayedAt = max playedAt)
        │
Ghi nhận SyncRun audit log ──► Cập nhật ProviderSyncState (SUCCESS, nextSyncAt = NOW + interval)
```

### 3. Module & File bị Ảnh hưởng
- `src/modules/synchronization/schedulers/sync-scheduler.service.ts`
- `src/modules/synchronization/services/sync-coordinator.service.ts`
- `src/modules/synchronization/services/sync-processor.service.ts`
- `src/modules/synchronization/controllers/sync.controller.ts`
- `src/modules/listening/services/listening-event.service.ts`

### 4. Thay đổi API / Interface
- `POST /api/v1/sync/trigger`: Kích hoạt đồng bộ thủ công ngay lập tức.
- `GET /api/v1/sync/status`: Trả về trạng thái sync hiện tại (`IDLE`, `RUNNING`, `SUCCESS`, `FAILED`), checkpoint và lần chạy tiếp theo.
- `GET /api/v1/sync/runs`: Truy vấn danh sách lịch sử các đợt chạy sync (audit logs).
- `PATCH /api/v1/sync/config`: Cập nhật cấu hình tần suất đồng bộ (`15`, `30`, `60` phút, chế độ `AUTO`/`MANUAL`).

### 5. Ảnh hưởng UI / UX
- Người dùng có thể bấm nút "Đồng bộ ngay", theo dõi tiến độ vòng quay loading, xem số bài hát mới nạp và thời gian đồng bộ lần trước.

### 6. Trường hợp Biên (Edge Cases)
- **Bị Rate Limit (HTTP 429):** Đọc header `Retry-After`, cập nhật trạng thái `RATE_LIMITED`, hoãn `nextSyncAt` tối thiểu bằng `NOW() + Retry-After`.
- **Chạy đồng thời (Race condition):** Sử dụng In-memory lock hoặc PostgreSQL Advisory Lock để ngăn 2 tiến trình sync chạy cùng lúc trên 1 `connectionId`.
- **Khoảng trống dữ liệu lớn (Potential Data Gap):** Nếu khoảng thời gian giữa `lastProcessedPlayedAt` và bản ghi cũ nhất trong batch > 50 bài hát, bật cờ `hasPotentialDataGap = true` trong `SyncRun`.

### 7. Rủi ro & Giả định (Risks & Assumptions)
- **Rủi ro:** Spotify API bị timeout giữa lúc đang phân trang.
  - *Biện pháp:* Checkpoint chỉ được commit khi toàn bộ bản ghi của batch đã lưu an toàn vào DB. Lần chạy sau sẽ fetch lại từ checkpoint cũ kèm 2 phút buffer mà không gây duplicate.
- **Giả định:** Người dùng nghe dưới 50 bài hát giữa 2 lần đồng bộ định kỳ.

### 8. Chiến lược Kiểm thử (Testing Strategy)
- Kiểm thử unit test logic tính toán mốc `after`: `after = lastProcessedPlayedAt - 120000 ms`.
- Kiểm thử tích hợp tính idempotent: Chèn cùng một danh sách 50 bản ghi 2 lần liên tiếp $\rightarrow$ Số lượng `recordsInserted` lần 2 phải bằng 0, không throw error.
- Kiểm thử trạng thái Honest Data: Xác nhận các trường `listenedDurationMs`, `startedAt`, `endedAt` luôn là `null`.

### 9. Ảnh hưởng Kiến trúc (Architecture Impact)
- Đảm bảo hệ thống có khả năng phục hồi hoàn hảo (Fault-tolerant & Self-healing) sau khi server bị crash hoặc khởi động lại.
