# ADR-0002: Lựa chọn PostgreSQL và Prisma ORM cho Tầng Lưu trữ Dữ liệu

> Chuẩn định dạng: Architecture Decision Record (Michael Nygard).
> Tham chiếu: `Music Tracker — Software Requirements Specification v1.0 (Final).md` (Mục 4, Mục 8).

| Thuộc tính | Giá trị |
|---|---|
| **Trạng thái** | `Accepted` |
| **Ngày tạo** | 2026-11-03 |
| **Tác giả / Quyết định bởi** | Solution Architect |
| **Tài liệu liên quan** | `docs/context/architecture.md §4`, `docs/context/scope.md` |

---

## 1. Bối cảnh (Context)

Music Tracker lưu trữ lịch sử nghe nhạc dưới dạng chuỗi sự kiện thời gian (`ListeningEvent`) kèm các tham chiếu phức tạp (nghệ sĩ, album, context, metadata).
Yêu cầu hệ thống cần:
- Lưu trữ quan hệ chặt chẽ giữa ProviderConnection, ProviderSyncState và ListeningEvent.
- Hỗ trợ lưu trữ JSON linh hoạt cho metadata nghệ sĩ (`artist_references`) và album (`album_reference`).
- Hỗ trợ ràng buộc toàn vẹn dữ liệu cứng: Composite Unique Constraint `(providerConnectionId, providerTrackId, playedAt)` để chống trùng lặp dữ liệu.
- Quản lý phiên bản CSDL và schema migration một cách an toàn, dễ kiểm soát (migration scripts).

---

## 2. Quyết định (Decision)

Hệ thống lựa chọn **PostgreSQL** làm hệ quản trị cơ sở dữ liệu quan hệ chính và **Prisma ORM** (Prisma Migrate) làm công cụ truy xuất và quản lý migration.

### Thiết kế Schema v1.0 chính thức (16 Models & 8 Enums)
1. **Multi-user Ready:** Tách biệt tài khoản ứng dụng (`User`, `AuthSession`, `AuthToken`) với kết nối dịch vụ âm nhạc (`ProviderConnection`). Mỗi user sở hữu trọn vẹn catalog và lịch sử nghe riêng.
2. **Tách biệt Canonical Catalog & Provider Catalog:**
   - *Canonical Catalog* (`Track`, `Artist`, `Album`, `TrackArtist`, `TrackAlbum`): Thuộc sở hữu của `User`, chuẩn hóa thực thể bài hát, nghệ sĩ, album độc lập nguồn phát.
   - *Provider Catalog* (`ProviderTrack`, `ProviderArtist`, `ProviderAlbum`, `ProviderTrackArtist`): Gắn liền với `ProviderConnection`, lưu trữ định danh nguồn (Spotify ID, URI, URLs) và raw JSON metadata.
3. **Honest Data Rule:** Bảng `ListeningEvent` bắt buộc để `null` các trường `startedAt`, `endedAt`, `listenedDurationMs`, `startProgressMs`, `endProgressMs`, `completionRate`. Không tự suy diễn thời lượng thực tế từ `durationMs`.
4. **Synchronization Engine:** Tách biệt checkpoint vận hành (`ProviderSyncState` quan hệ 1-1 với `ProviderConnection`) và nhật ký kiểm toán lịch sử (`SyncRun` quan hệ 1-N).
5. **Multi-source Extensible:** Sẵn sàng mở rộng tích hợp Apple Music, YouTube Music hay Local Files qua enum `MusicProvider` mà không làm vỡ cấu trúc catalog cốt lõi.

**Phương án thay thế đã cân nhắc:**
- *TypeORM:* Đã cân nhắc vì tích hợp sâu với NestJS, nhưng bị loại do cú pháp migration và type-safety kém trực quan hơn Prisma, thường xuyên gặp vấn đề breaking change giữa các phiên bản.
- *MongoDB / NoSQL:* Bị loại vì thiếu tính toàn vẹn quan hệ (foreign keys), khó đảm bảo ACID khi commit checkpoint và xử lý transaction đồng thời.
- *Single Table Catalog / Inline JSONB only:* Từng được cân nhắc cho MVP tối giản, nhưng bị loại vì không thể hỗ trợ cross-provider track identity resolution và khó bảo đảm tính nhất quán khi mở rộng nhiều nguồn.

---

## 3. Hệ quả & Đánh đổi (Consequences)

### Tích cực (Pros)
- PostgreSQL hỗ trợ mạnh mẽ cả dữ liệu quan hệ chuẩn và kiểu dữ liệu JSONB cho metadata.
- Prisma sinh TypeScript client tự động 100% type-safe, loại bỏ hoàn toàn sai sót kiểu dữ liệu giữa Schema và Code.
- Prisma Migrate giúp kiểm soát lịch sử thay đổi schema CSDL thông qua các file SQL rõ ràng.

### Tiêu cực & Chi phí đánh đổi (Cons / Trade-offs)
- Prisma có thể có overhead nhẹ đối với các câu query batch quá lớn (hàng chục nghìn records cùng lúc); tuy nhiên với giới hạn 50 records/trang của Spotify API thì hoàn toàn tối ưu.

### Điểm cần theo dõi (Neutral / Follow-up)
- Đánh chỉ mục (Index) hiệu quả cho các trường hay lọc: `(played_at DESC)`, `(user_id)`, `(next_sync_at)`.

