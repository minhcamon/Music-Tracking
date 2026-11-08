# English Hub (Personal English Learning Ecosystem)

> **Tên ban đầu:** English Hub  
> **Status:** Concept & Architecture Definition  
> **Last updated:** 31/10/2026

---

## 1. Tổng quan hệ sinh thái

Mục tiêu là xây dựng một hệ sinh thái cá nhân hỗ trợ cải thiện năng lực tiếng Anh, kết hợp nhiều nguồn nội dung và phương pháp học tập.

Hệ sinh thái gồm ba thành phần chính:

| Platform | Vai trò |
| :--- | :--- |
| **LocalRead** | Nền tảng đọc sách độc lập, quản lý nội dung và trải nghiệm đọc |
| **Music Tracker** | Theo dõi, chuẩn hóa và phân tích thói quen nghe nhạc đa nguồn |
| **English Hub** | Trung tâm quản lý quá trình học tiếng Anh và kết nối các nguồn nội dung |

Các hệ thống hoạt động độc lập, giao tiếp qua API. Không yêu cầu hợp nhất thành một ứng dụng hoặc một backend duy nhất.

---

## 2. English Hub

### 2.1. Product Vision

English Hub là một Personal English Learning Tracker giúp người dùng cải thiện tiếng Anh thông qua nội dung và hoạt động trong đời sống hằng ngày.

**Mục tiêu dài hạn:**
- Cải thiện Listening, Reading, Speaking và Writing.
- Phát triển vocabulary, phrases, collocations và khả năng sử dụng ngôn ngữ.
- Luyện shadowing và pronunciation.
- Hỗ trợ academic English và IELTS.
- Theo dõi tiến độ và nhận diện điểm yếu.
- Tận dụng AI để cá nhân hóa quá trình học.

Hub không phải LMS, streaming platform hay thư viện nội dung số. Nó quản lý trải nghiệm học tập xoay quanh những nội dung người dùng tiếp xúc từ các nền tảng khác.

### 2.2. Content Domains

Hub hỗ trợ bốn nhóm nội dung:

| Domain | Nguồn nội dung | Hoạt động học tập |
| :--- | :--- | :--- |
| **Movies & Series** | Movie platforms, subtitles, user-provided files | Listening, shadowing, expressions |
| **Books & Stories** | LocalRead, PDFs, EPUB, text | Reading, vocabulary, comprehension |
| **Music** | Music Tracker, lyrics, external providers | Listening, shadowing, expressions |
| **Games** | Game sessions, communication records | Communication, vocabulary, speaking |

Các domain dùng chung Learning Management nhưng giữ metadata và đặc điểm riêng.

Không phải mọi nội dung đều cần có transcript hoặc lyrics. Hub phải thể hiện rõ khả năng truy cập thực tế của từng nguồn.

### 2.3. Core Features

- **Content Library:** Quản lý nội dung học tập từ nhiều nguồn.
- **Learning Sessions:** Ghi nhận các buổi học và luyện tập.
- **Learning Segments:** Đánh dấu đoạn phim, sách hoặc bài hát cần luyện tập.
- **Shadowing:** Quản lý đoạn luyện, recordings và feedback.
- **Vocabulary Bank:** Tích lũy từ vựng, phrases, collocations và ngữ cảnh.
- **Notes:** Lưu nhận xét, cách diễn đạt và kiến thức cá nhân.
- **Writing Practice:** Viết, nhận feedback và theo dõi lỗi lặp lại.
- **Speaking Practice:** Luyện nói, hội thoại và IELTS Speaking.
- **Progress Dashboard:** Theo dõi tiến độ theo kỹ năng và thời gian.

> **Lưu ý:** Phân biệt rõ *Content Activity* và *Learning Activity*. Ví dụ, mở một cuốn sách hoặc nghe một bài hát không tự động được tính là một buổi học.

---

## 3. Music Tracker

### 3.1. Product Vision

Music Tracker là một nền tảng độc lập chuyên theo dõi và phân tích hành vi nghe nhạc từ nhiều nguồn.

Đây không phải Music Streaming Platform và không có mục tiêu thay thế Spotify, Apple Music hoặc YouTube Music.

**Ưu tiên quan trọng nhất là hiểu thói quen nghe nhạc của người dùng:**
- Nghe gì, vào thời điểm nào và trong bao lâu?
- Nghe một bài hát bao nhiêu lần?
- Thói quen nghe thay đổi thế nào theo ngày, tuần, tháng?
- Nghệ sĩ, album và thể loại nào được nghe nhiều nhất?
- Gu âm nhạc thay đổi ra sao theo thời gian?

Music Tracker hỗ trợ nhạc Việt, nhạc Anh và các ngôn ngữ khác bình đẳng. Nó không bị giới hạn bởi mục tiêu học tiếng Anh của Hub.

### 3.2. Multi-source Integration

**Các nguồn dự kiến:**
- Spotify
- Apple Music
- YouTube / YouTube Music
- Local music files
- Các nguồn khác trong tương lai

Mỗi nguồn có một Adapter riêng để xử lý authentication, data collection và normalization.

Tất cả dữ liệu được chuyển về một định dạng thống nhất, cung cấp qua Unified Music API.

Không giả định các provider có cùng capabilities. Mỗi Adapter cần khai báo rõ khả năng truy cập metadata, listening history, now playing, playback events, lyrics và các dữ liệu khác.

Việc thu thập và sử dụng dữ liệu phải tuân thủ API terms, quyền truy cập và chính sách của từng nền tảng.

### 3.3. Core Data Model

**Các entity dự kiến:**

| Entity | Trách nhiệm |
| :--- | :--- |
| **Track** | Bài hát chuẩn hóa |
| **Artist** | Nghệ sĩ |
| **Album** | Album |
| **MusicSource** | Nguồn cung cấp dữ liệu |
| **SourceMapping** | Liên kết một Track với ID trên các provider |
| **ListeningEvent** | Một lần nghe nhạc |
| **Playlist** | Danh sách phát |
| **MusicProfile** | Hồ sơ và xu hướng nghe nhạc |

`ListeningEvent` là entity trung tâm. Một `ListeningEvent` có thể chứa:
- Track ID
- Source
- StartedAt / EndedAt
- Duration
- Playback progress
- Completion rate nếu dữ liệu cho phép
- Playlist hoặc listening context nếu có

Cần xử lý deduplication và Track Identity Resolution để nhận diện cùng một bài hát từ nhiều nguồn mà vẫn giữ được nguồn gốc từng sự kiện.

Không tự suy diễn thời lượng nghe thực tế nếu provider chỉ cung cấp timestamp hoặc dữ liệu không đầy đủ. Cần phân biệt dữ liệu quan sát được và dữ liệu ước tính.

### 3.4. Music Intelligence Roadmap

#### Level 1 — Listening Intelligence
- Listening duration và frequency.
- Daily / weekly / monthly trends.
- Top tracks, artists, albums.
- Repeat rate và completion rate.
- Listening patterns theo thời gian.
- Genre và language distribution khi có metadata đáng tin cậy.

#### Level 2 — Music Content Intelligence
- Nhận diện ngôn ngữ.
- Phân tích genre, mood và tempo.
- Phân tích lyrics khi có nguồn hợp lệ.
- Trích xuất vocabulary và expressions.
- Tìm kiếm nội dung hoặc chủ đề âm nhạc tương tự.

> **Định hướng:** Ưu tiên hoàn thiện tracking và analytics trước khi triển khai AI phân tích nội dung.

### 3.5. Integration với English Hub

Music Tracker hoạt động độc lập và cung cấp API cho Hub.

English Hub chỉ lấy dữ liệu phục vụ việc học tiếng Anh, chẳng hạn:
- English tracks.
- Learning segments.
- Lyrics có nguồn hợp lệ.
- Vocabulary và expressions.
- Shadowing sessions và recordings.

Music Tracker vẫn giữ toàn bộ chức năng tracking và analytics ngay cả khi English Hub không tồn tại.

---

## 4. LocalRead Integration

LocalRead là nền tảng đọc sách độc lập, sở hữu dữ liệu và logic nghiệp vụ liên quan đến sách.

**LocalRead chịu trách nhiệm:**
- Quản lý PDF, EPUB và metadata sách.
- Trích xuất nội dung.
- Giữ cấu trúc chapter, section, paragraph và page mapping.
- Chuẩn hóa và chunk nội dung.
- Quản lý highlights, notes và reading progress.
- Cung cấp Content API cho hệ thống khác.

**English Hub chịu trách nhiệm:**
- Tạo embeddings và vector index phục vụ nhu cầu học tập.
- Semantic retrieval xuyên nhiều nguồn.
- Vocabulary extraction.
- Language analysis.
- RAG và các AI learning workflows.

### 4.1. Content API

Các API dự kiến:
- `GET /api/v1/books`
- `GET /api/v1/books/{id}`
- `GET /api/v1/books/{id}/chunks`
- `GET /api/v1/books/{id}/chunks/{chunkId}`
- `GET /api/v1/books/{id}/content-version`

Một chunk cần giữ metadata truy ngược được về nội dung gốc: book, chapter, page, paragraph, position, sequence và version.

### 4.2. RAG Architecture

LocalRead cũng có RAG phục vụ trải nghiệm đọc. English Hub có RAG phục vụ việc học tiếng Anh.

Hai hệ thống có thể sử dụng retrieval và embedding strategy khác nhau, nhưng phải tham chiếu cùng một nguồn nội dung chuẩn.

**Nguyên tắc:**
- Một source of truth cho nội dung sách.
- ID và version ổn định.
- Citation truy ngược được về sách, chương, trang và đoạn gốc.
- Không bắt buộc hai hệ thống phải trả lời giống nhau khi mục đích và retrieval strategy khác nhau.
- Có cơ chế đồng bộ hoặc re-index khi nội dung thay đổi.

---

## 5. Shared AI Intelligence

AI là một lớp năng lực dùng chung về mặt ý tưởng, nhưng không nhất thiết phải triển khai thành một microservice độc lập ngay từ đầu.

**Các nhóm chức năng:**
1. **Content Intelligence:** Hiểu nội dung sách, phim, nhạc và ngữ cảnh giao tiếp.
2. **Language Intelligence:** Phân tích từ vựng, phrases, grammar, tone và usage.
3. **Speech Intelligence:** STT, pronunciation, fluency, rhythm và shadowing feedback.
4. **Writing Intelligence:** Grammar correction, coherence, vocabulary và IELTS feedback.
5. **Learning Intelligence:** Phân tích điểm yếu, theo dõi tiến bộ và đề xuất bài tập.
6. **Knowledge Retrieval:** RAG trên nội dung người dùng có quyền truy cập.

### AI Development Roadmap

1. Vocabulary / Phrase Extraction và Language Assistant.
2. Content Analysis và Shadowing Recommendation.
3. Speech Analysis và Speaking Assistant.
4. RAG trên sách và các nguồn nội dung.
5. Personal AI Tutor và Adaptive Learning.

> Không cần triển khai multi-agent từ đầu. Ưu tiên structured workflows, khả năng kiểm soát, độ chính xác và chi phí.

---

## 6. Architecture Principles

Các nguyên tắc cần duy trì trong toàn hệ sinh thái:
1. **Independent Platforms:** LocalRead, Music Tracker và English Hub có thể hoạt động độc lập.
2. **Single Ownership:** Mỗi nền tảng sở hữu dữ liệu và nghiệp vụ thuộc domain của mình.
3. **API-first Integration:** Giao tiếp qua API có versioning, authentication và stable identifiers.
4. **Source of Truth:** Không tạo nhiều bản dữ liệu gốc không kiểm soát.
5. **Capability-aware Integration:** Không giả định mọi provider cung cấp cùng loại dữ liệu.
6. **Traceability:** AI-generated results phải truy ngược được về nguồn khi có thể.
7. **Privacy and Compliance:** Tôn trọng quyền truy cập, chính sách provider và quyền riêng tư.
8. **Avoid Premature Microservices:** Có thể bắt đầu bằng modular monolith cho từng platform; chỉ tách service khi có nhu cầu thực tế.
9. **Incremental Development:** Ưu tiên MVP có giá trị, không triển khai toàn bộ AI ngay từ đầu.

---

## 7. Development Priorities

Thứ tự phát triển đề xuất:

### Phase 1 — Establish Core Platforms
- Duy trì LocalRead độc lập.
- Xác định API cung cấp nội dung sách.
- Xây dựng English Hub với Content Library, Learning Sessions, Segments và Vocabulary.
- Xây dựng Music Tracker với Provider Integration và Listening Event Collection.

### Phase 2 — Unified Data & Analytics
- Chuẩn hóa dữ liệu từ các nguồn.
- Track Identity Resolution.
- Listening Analytics.
- Content synchronization và versioning.
- Kết nối LocalRead và Music Tracker với English Hub.

### Phase 3 — AI Learning Capabilities
- Vocabulary / Phrase Extraction.
- RAG trên sách và nội dung được cung cấp.
- Shadowing Recommendation.
- Writing và Speaking Feedback.

### Phase 4 — Personal Learning Intelligence
- Learning Profile.
- Weakness Detection.
- Adaptive Exercises.
- Personalized Recommendations.
- IELTS Progress Tracking.

---

## 8. Open Architecture Decisions

Các vấn đề chưa được quyết định, không nên tự giả định:
- Cơ chế SSO hay liên kết tài khoản riêng giữa các platform.
- Provider nào sẽ được tích hợp đầu tiên vào Music Tracker.
- Phạm vi dữ liệu lịch sử mà từng provider thực sự cho phép truy cập.
- Cách thu thập playback events từ local music players.
- Cơ chế đồng bộ: polling, webhook hay local agent.
- Shared AI service có thực sự cần thiết khi các platform trưởng thành hay không.
- Vector database và embedding model.
- Phạm vi triển khai Movie và Game integration trong MVP.

### Product Boundary Cuối Cùng

- **LocalRead:** Quản lý trải nghiệm đọc và nội dung sách.
- **Music Tracker:** Quản lý dữ liệu và thói quen nghe nhạc đa nguồn.
- **English Hub:** Quản lý quá trình học tiếng Anh.
- **AI:** Kết nối nội dung với kiến thức và tiến bộ học tập.

> **Tóm kết:** Ba nền tảng độc lập, nhưng tạo thành một hệ sinh thái học tập cá nhân thống nhất.
