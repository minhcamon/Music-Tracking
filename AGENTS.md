# AGENTS.md — Antigravity Engineering OS & Project Hub

> Trang điều phối trung tâm của dự án Music Tracker trên Antigravity.
> Điều phối tri thức dự án (`docs/`), kỹ năng chuyên môn (`.agents/skills/`), vai trò (`.agents/agents/`) và các cổng kiểm soát (Gates).
>
> Quy tắc **MUST / NEVER** ở **§8** có độ ưu tiên CAO NHẤT, ghi đè mọi hành vi mặc định.
> Tham chiếu đặc tả: `docs/srs/music-tracker-srs-v1.0.md`.

---

## §0 — Lệnh Vận hành Nhanh (Command Palette)

### Backend (NestJS + TypeScript + Prisma)
```bash
# Khởi động PostgreSQL cục bộ
docker-compose up -d postgres

# Chạy server phát triển (Hot reload)
pnpm run start:dev

# Prisma DB Migration & Client Generate
npx prisma migrate dev --name <migration_name>
npx prisma generate
npx prisma studio

# Kiểm thử tự động
pnpm run test
pnpm run test:e2e
```

### Frontend (React 19 + Vite + Tailwind CSS + shadcn/ui)
```bash
# Chạy dev server Vite
pnpm run dev

# Kiểm tra kiểu và đóng gói production
pnpm run build

# Chạy unit tests
pnpm run test
```

---

## §1 — Quy chuẩn Kỹ thuật (Guidelines) · CẤP NỀN

### Eager (Đọc trước)
- `docs/guidelines/shared/gotchas.md`
- `docs/guidelines/shared/git-workflow.md`
- `docs/guidelines/shared/security-policy.md`

### Tham chiếu On-Demand — Đọc theo ngữ cảnh công việc
| File | Đọc khi nào |
|---|---|
| `docs/guidelines/backend/tech-stack.md` | Trước khi thiết kế / code / review Backend (NestJS, Prisma) |
| `docs/guidelines/backend/coding-convention.md` | Trước khi thiết kế / viết / review code Backend |
| `docs/guidelines/backend/api-convention.md` | Khi thiết kế / viết API Backend (`/api/v1`, envelope `{ code, message, data }`) |
| `docs/guidelines/frontend/tech-stack.md` | Trước khi thiết kế / code / review Frontend (React, shadcn/ui) |
| `docs/guidelines/frontend/coding-convention.md` | Trước khi thiết kế / code / review Frontend |

---

## §2 — Ngữ cảnh & Tri thức Dự án (Docs Hub)

### Eager Core (Nạp tự động vào mọi phiên làm việc)
- `docs/context/project-context.md` (Tầm nhìn, sứ mệnh, đối tượng người dùng, vai trò hệ sinh thái)
- `docs/context/scope.md` (Hợp đồng ranh giới In-Scope, Out-of-Scope, Deferred, Hard Constraints)
- `docs/context/workflow.md` (Giao thức vận hành AI, Adaptive Workflow, DoD)
- `docs/context/architecture.md` (Kiến trúc Modular Monolith, Data Flow, Prisma Schema)
- `docs/context/domain-glossary.md` (Từ điển thuật ngữ nghiệp vụ VI $\leftrightarrow$ EN)

### On-Demand Knowledge
- Quản lý Phiên bản & Changelog: `docs/releases/versioning-policy.md`, `docs/releases/CHANGELOG.md`
- Đặc tả SRS gốc: `docs/srs/music-tracker-srs-v1.0.md`, `docs/srs/ecosystem-srs.md`
- Đặc tả Chức năng: `docs/specs/business-spec/<MÃ_CHỨC_NĂNG>/` (ví dụ `MUSIC_TRACKER_MVP`)
- Thiết kế Kỹ thuật: `docs/specs/design/<MÃ_CHỨC_NĂNG>/`
- Kế hoạch Đã duyệt (Tasks): `docs/specs/tasks/<MÃ_CHỨC_NĂNG>/` (ví dụ `task-plan.md`, `plan-01` $\rightarrow$ `plan-05`)
- Bằng chứng Xác minh: `docs/specs/verification/`
- Quyết định Kiến trúc: `docs/decisions/` (ADR-0001 $\rightarrow$ ADR-0005)

---

## §3 — Thứ tự Nạp Ngữ cảnh (Context Loading Hierarchy)

Áp dụng cơ chế **Lazy Loading** theo thứ bậc phụ thuộc chuẩn:
```text
Layer 0 — Agent Contract (AGENTS.md, MUST/NEVER)
Layer 1 — Project Context (docs/context/project-context.md)
Layer 2 — Scope / Constraints (docs/context/scope.md)
Layer 3 — Architecture (docs/context/architecture.md)
Layer 4 — Requirements / SRS (docs/specs/business-spec/ hoặc docs/srs/)
Layer 5 — Technical Design (docs/specs/design/)
Layer 6 — Existing Implementation (Mã nguồn hiện tại)
Layer 7 — Execution State (.agents/state/<dev-id>/current-task.md)
```

---

## §4 — Điều phối Orchestrator & Phân loại Tác vụ (Task Classification)

Mọi yêu cầu kỹ thuật đều đi qua **Orchestrator** để xác định độ sâu quy trình thích ứng (*Adaptive Workflow*):

| Loại Tác vụ | Phân loại | Quy trình Thực thi Tối thiểu |
|---|---|---|
| `QUESTION` | Câu hỏi tra cứu / giải thích | Tra cứu context $\rightarrow$ Trả lời trực tiếp |
| `TRIVIAL` | Sửa typo / chỉnh 1 dòng rõ ràng | Hiểu $\rightarrow$ Sửa $\rightarrow$ Verify nhanh |
| `BUG_FIX` | Sửa lỗi hệ thống / UI / Sync | Tái hiện $\rightarrow$ Chẩn đoán $\rightarrow$ Sửa $\rightarrow$ Layer Verify |
| `SMALL_MODIFY` | Mở rộng nhẹ logic có sẵn | Context liên quan $\rightarrow$ Kế hoạch ngắn $\rightarrow$ Sửa $\rightarrow$ Verify |
| `NEW_FEATURE` | Tính năng mới (In-Scope MVP) | Requirements $\rightarrow$ Design $\rightarrow$ Plan 9 mục $\rightarrow$ Code $\rightarrow$ Vertical Verify $\rightarrow$ DoD |
| `ARCHITECTURAL_CHANGE` | Thay đổi DB/Auth/API/Lib lớn | Scope check $\rightarrow$ Phân tích $\rightarrow$ ADR $\rightarrow$ Phê duyệt $\rightarrow$ Code $\rightarrow$ E2E Verify |

---

## §5 — Phân công Vai trò & Định tuyến Kỹ năng (Skill Routing)

> Chi tiết các vai trò xem tại `.agents/agents/`. Các kỹ năng chuyên môn xem tại `.agents/skills/`.

| Phạm vi / Trách nhiệm | Vai trò (Procedure) | Kỹ năng Kích hoạt |
|---|---|---|
| Điều phối chung / Gates | `orchestrator` | `.agents/skills/orchestrate` |
| Thiết kế Kiến trúc & Spec | `solution-architect` | `.agents/skills/technical-design` |
| Review Thiết kế & Scope | `architect-reviewer` | `docs/context/scope.md` + `docs/context/architecture.md` |
| Code Server (API, DB, Sync) | `developer-backend` | `docs/guidelines/backend/` + `.agents/skills/task-state-init` |
| Code Client (UI, shadcn/ui) | `developer-frontend` | `docs/guidelines/frontend/` + `.agents/skills/task-state-init` |
| Review Code 4 chiều | `code-reviewer-*` | `.agents/skills/code-review-*` |
| Xác minh đa cấp & Vertical Flow | `orchestrator` / `developer-*` | `.agents/skills/verification` |
| Debug & Xử lý sự cố | `developer-*` | `.agents/skills/debug-*` |

---

## §6 — Quản lý Trạng thái Thực thi (State Management)

> Lưu trữ tại `.agents/state/<dev-id>/` (mặc định `<dev-id>` = `local-dev` hoặc email git user).

- `current-task.md`: Task đang thực hiện (duy nhất 1 task/thời điểm).
- `progress.md`: Tiến độ chi tiết theo từng bước code.
- `session-handoff.md`: Trạng thái bàn giao giữa các phiên làm việc.

---

## §7 — Báo cáo Thực thi Minh bạch 5 Điểm (Execution Report)

Kết thúc mỗi tác vụ có sửa đổi code, Agent **BẮT BUỘC** phản hồi theo 5 phần:
1. **What changed:** Danh sách file và tính năng đã thêm/sửa/xóa.
2. **Why:** Lý do kỹ thuật hoặc mục tiêu nghiệp vụ.
3. **Risk / Impact:** Mức độ ảnh hưởng toàn hệ thống (Low / Medium / High).
4. **Assumptions:** Các giả định kỹ thuật đã áp dụng.
5. **Not done / Remaining:** Các hạng mục tồn đọng hoặc bước tiếp theo.

---

## §8 — HỢP ĐỒNG HÀNH VI: MUST & NEVER (TỰ ĐỘNG THỰC THI)

### MUST (Bắt buộc thực thi từ A-Z)
1. **Phân loại & Kiểm tra Ranh giới (Scope Guard):** Trước khi code, phải kiểm tra `docs/context/scope.md`. Nếu yêu cầu vượt scope hoặc hoãn lại $\rightarrow$ **STOP**, giải thích lý do, đưa vào danh sách đề xuất backlog và xin xác nhận.
2. **Spotify Policy Gate (Release Blocker):** KHÓA TOÀN BỘ các tính năng Analytics, User Taste Profiling, AI Analysis đối với dữ liệu Spotify và CẤM chuyển dữ liệu Spotify sang English Hub cho đến khi có văn bản phê duyệt chính thức từ Spotify.
3. **Nguyên tắc Dữ liệu Trung thực (Honest Data Rule):** Các trường `startedAt`, `endedAt`, `listenedDurationMs`, `startProgressMs`, `endProgressMs`, `completionRate` **BẮT BUỘC ĐỂ NULL** trên cơ sở dữ liệu. Tuyệt đối không tự suy diễn số liệu.
4. **Cô lập Provider (Provider Isolation):** Toàn bộ logic API, headers và types riêng của Spotify phải nằm trong `src/integrations/spotify/`. Core domain chỉ làm việc với thực thể chuẩn hóa `ListeningEvent`.
5. **Mã hóa Token at Rest:** Token access và refresh của người dùng bắt buộc mã hóa AES-256-GCM trước khi lưu trữ vào bảng `provider_connections`.
6. **Kiểm tra Kiến trúc (Architecture Guard):** Nếu thay đổi tác động đến DB Schema, API Contract, Authentication, Module boundaries hoặc thêm thư viện mới $\rightarrow$ Phải lập ADR trong `docs/decisions/` và xin phê duyệt trước khi code.
7. **Kế hoạch Thích ứng (Plan Gate):** Lập kế hoạch phù hợp với độ phức tạp của task trước khi viết code (Plan 9 mục đối với New Feature).
8. **Quản lý Trạng thái:** Chạy skill `task-state-init` khi bắt đầu tính năng mới và đồng bộ `progress-tracker` sau mỗi bước hoàn thành.
9. **Xác minh Hoàn tất theo Chiều dọc (Vertical Completeness):** Đối với tính năng có giao diện người dùng, phải kiểm chứng toàn bộ luồng nghiệp vụ thực tế (User Action $\rightarrow$ UI $\rightarrow$ API $\rightarrow$ Backend $\rightarrow$ DB $\rightarrow$ Response $\rightarrow$ UI State $\rightarrow$ Re-open/Persist) trước khi đánh dấu hoàn thành.
10. **Đánh giá DoD & Báo cáo:** Kiểm tra Definition of Done và trả về Báo cáo 5 điểm minh bạch khi kết thúc task.

### NEVER (Cấm Tuyệt đối)
- **NEVER** tự ý mở rộng phạm vi (Scope Creep) hoặc tiện tay sửa những phần ngoài scope đã duyệt (*Scope Expansion Protection*).
- **NEVER** tự ý thêm library / framework ngoài danh mục đã duyệt trong `docs/guidelines/*/tech-stack.md`.
- **NEVER** tự suy diễn thời lượng nghe thực tế từ `trackDurationMs` hay `playedAt`.
- **NEVER** lưu token dạng plain text vào cơ sở dữ liệu hoặc in token / raw request headers ra file log.
- **NEVER** coi một tính năng hoàn thành chỉ vì build/compile pass mà chưa kiểm chứng luồng hoạt động thực tế.
- **NEVER** âm thầm thay đổi kiến trúc hoặc phá vỡ envelope API chuẩn `{ code, message, data }`.
- **NEVER** nạp toàn bộ tài liệu dự án một cách bừa bãi cho các task đơn giản (tránh lãng phí context window).

