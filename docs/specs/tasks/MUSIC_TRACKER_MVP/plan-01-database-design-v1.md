# PLAN-01: Thiết kế Cơ sở Dữ liệu & Schema v1.0 (Database Design Plan)

> **Mã kế hoạch:** `PLAN-01` | **Mã chức năng:** `MUSIC_TRACKER_MVP`  
> **Trạng thái:** **HOÀN THÀNH (DONE)** | **Phê duyệt bởi:** Solution Architect & Tech Lead  
> **Tham chiếu:** [prisma/schema.prisma](../../../prisma/schema.prisma), [ADR-0002](../../decisions/0002-persistence-postgresql-prisma.md), [architecture.md](../../context/architecture.md#L132).

---

### 1. Mục tiêu & Phạm vi (Goal & Scope)
- **Mục tiêu:** Thiết lập lược đồ cơ sở dữ liệu PostgreSQL chuẩn hóa, hỗ trợ multi-user, phân tách Canonical Catalog độc lập với nguồn phát (Spotify-first, multi-source extensible), tuân thủ Honest Data Rule và kiểm soát audit log sync.
- **Phạm vi:** 16 models và 8 enums trong `prisma/schema.prisma`.

### 2. Luồng Dữ liệu (Data Flow)
```text
Provider API (Spotify)
        │
        ▼
Provider Catalog (provider_tracks, provider_artists, provider_albums)
        │ (Link & Normalization)
        ▼
Canonical Catalog (tracks, artists, albums, track_artists, track_albums)
        │
        ▼
Listening Domain (listening_events) ──► Thuộc sở hữu User (users)
```

### 3. Module & File bị Ảnh hưởng
- `prisma/schema.prisma`: Định nghĩa 16 models, 8 enums.
- `docs/context/architecture.md`: Section 4 mô tả chi tiết 6 nhóm bảng.
- `docs/context/domain-glossary.md`: Từ điển thuật ngữ 16 thực thể.
- `docs/decisions/0002-persistence-postgresql-prisma.md`: Ghi nhận quyết định kiến trúc.

### 4. Thay đổi API / Interface
- Chưa áp dụng (tầng persistence). Cung cấp Prisma Client types an toàn kiểu dữ liệu compile-time cho Backend.

### 5. Ảnh hưởng UI / UX
- Chuẩn bị nền tảng dữ liệu cho giao diện hiển thị: Lịch sử nghe nhạc, trạng thái kết nối, tiến độ sync.

### 6. Trường hợp Biên (Edge Cases)
- **Trùng lặp bài hát:** Xử lý bằng composite unique constraint `@@unique([connection_id, provider_track_id, played_at])`.
- **Nghệ sĩ có tên trùng:** `Artist` unique theo `[user_id, name]` để deduplicate trong kho cá nhân của user.
- **Release date của album không đầy đủ:** Lưu `VARCHAR(50)` do Spotify có thể trả về `YYYY`, `YYYY-MM` hoặc `YYYY-MM-DD`.

### 7. Rủi ro & Giả định (Risks & Assumptions)
- **Rủi ro:** Payload metadata từ Spotify thay đổi format.
  - *Biện pháp:* Lưu nguyên bản `raw_metadata` dạng `JSONB` trong các bảng Provider Catalog.
- **Giả định:** Người dùng quản lý dữ liệu cá nhân theo `userId`.

### 8. Chiến lược Kiểm thử (Testing Strategy)
- `npx prisma validate`: Kiểm tra cú pháp schema SDL.
- `npx prisma format`: Tự động format định dạng schema chuẩn.
- Migration dev: Chạy `npx prisma migrate dev` trên PostgreSQL container.

### 9. Ảnh hưởng Kiến trúc (Architecture Impact)
- Đảm bảo khả năng mở rộng thêm Apple Music, YouTube Music hay Local Files mà không cần đập đi xây lại bảng `tracks` hay `listening_events`.

