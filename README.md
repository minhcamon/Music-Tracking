# 🎵 Music Tracker — AI Engineering Operating System

> Nền tảng cá nhân theo dõi, chuẩn hóa và lưu trữ lịch sử nghe nhạc đa nguồn (bắt đầu từ Spotify Web API).
> Hệ thống áp dụng bộ khung **AI Engineering Operating System** với Lớp Điều phối (Orchestration Layer), Kiểm soát Ranh giới (Boundary Guard), Kế hoạch Thích ứng (Adaptive Planning), Dữ liệu Trung thực (Honest Data) và Tuân thủ Chính sách Nghiêm ngặt (Spotify Policy Gate).
> Tham chiếu đặc tả: `docs/srs/music-tracker-srs-v1.0.md`.

---

## 🏗️ 1. Cấu trúc Hệ thống & Ngữ cảnh Dự án

```text
├── .agents/                      # Toàn bộ kỹ năng, vai trò và trạng thái thực thi cho AI
│   ├── AGENTS.md                 # Ma trận định tuyến kỹ năng & phân công Agent
│   ├── agents/                   # 6 vai trò kỹ thuật chuyên biệt (Architect, Dev, Reviewer)
│   ├── skills/                   # 10 kỹ năng kỹ thuật (orchestrate, verification, review, debug...)
│   └── state/                    # Không gian quản lý task và tiến độ (current-task, progress...)
├── docs/                         # Toàn bộ tài liệu kỹ thuật & nghiệp vụ dự án
│   ├── srs/                      # Đặc tả SRS hệ sinh thái & Music Tracker v1.0 chính thức
│   ├── context/                  # Tầm nhìn sản phẩm, ranh giới scope, kiến trúc, thuật ngữ, workflow
│   ├── decisions/                # Sổ ghi nhận Architecture Decision Records (ADR-0001 -> 0005)
│   ├── guidelines/               # Quy chuẩn kỹ thuật (NestJS, React/shadcn/ui, Security, Gotchas)
│   └── specs/                    # Đặc tả chức năng, hồ sơ thiết kế kỹ thuật, tasks & verification
├── AGENTS.md                     # Antigravity Project Hub, Hợp đồng MUST/NEVER & Lệnh CLI
└── README.md                     # Giới thiệu tổng quan hệ thống
```

---

## ⚡ 2. Ngăn xếp Công nghệ Baseline (SRS v1.0)

- **Backend:** NestJS + TypeScript, Node.js LTS, Modular Monolith.
- **Database & ORM:** PostgreSQL + Prisma ORM (Prisma Migrate).
- **Scheduler:** `@nestjs/schedule` (polling chu kỳ 15/30/60 phút, mặc định 30 phút).
- **Authentication:** Passport + OAuth2 (Spotify Authorization Code Flow).
- **Security:** Mã hóa token at rest bằng **AES-256-GCM**.
- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, **shadcn/ui**, TanStack Query v5, React Router v7.
- **Testing:** Jest + `@nestjs/testing` (Backend), Vitest (Frontend).
- **Deployment:** Docker Compose + VPS.

---

## 🛡️ 3. Các Cổng Kiểm soát Trọng yếu (Core Gates)

1. **Spotify Policy Gate (Release Blocker):** Khóa toàn bộ tính năng Analytics, User Taste Profiling, AI Analysis đối với dữ liệu Spotify và cấm chuyển dữ liệu sang English Hub trong MVP cho đến khi có văn bản chấp thuận chính thức từ Spotify.
2. **Honest Data Rule:** Các trường `startedAt`, `endedAt`, `listenedDurationMs`, `startProgressMs`, `endProgressMs`, `completionRate` **BẮT BUỘC ĐỂ NULL** trên CSDL (không tự suy diễn dữ liệu phát).
3. **Provider Isolation Rule:** Mã nguồn giao tiếp Spotify API được đóng gói cô lập trong `src/integrations/spotify/`. Core domain chỉ làm việc với thực thể chuẩn hóa `ListeningEvent`.
4. **Boundary & Scope Guard:** Bắt buộc đối chiếu `docs/context/scope.md` trước khi code.
5. **Vertical Completeness (Xác minh luồng thực tế):** Tính năng chỉ hoàn thành khi toàn bộ luồng hoạt động thực tế từ UI $\rightarrow$ API $\rightarrow$ Backend $\rightarrow$ DB $\rightarrow$ Response được kiểm chứng thành công.
6. **Báo cáo Thực thi 5 Điểm (Execution Report):** Kết thúc task, phản hồi đủ 5 mục: *What changed, Why, Risk/Impact, Assumptions, Not done/Remaining*.

---

## 🚀 4. Lệnh Vận hành Nhanh

### Backend
```bash
# Chạy database PostgreSQL
docker-compose up -d postgres

# Chạy server phát triển (watch mode)
pnpm run start:dev

# Prisma Migration
npx prisma migrate dev --name <migration_name>
npx prisma studio
```

### Frontend
```bash
# Chạy frontend dev server
pnpm run dev

# Đóng gói kiểm tra production
pnpm run build
```
