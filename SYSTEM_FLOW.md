# ICT Bangladesh Chat System Architecture & Flow

## 1. Roles & Access Control
There are two distinct roles in the system:
1.  **User (`role: user`)**:
    -   Access URL: `/chat`
    -   Standard interface for students/clients.
    -   Interacts initially with AI.
2.  **Support (`role: support`)**:
    -   Access URL: `/support`
    -   Dashboard interface for human agents.
    -   Can view all conversations, filter by `needs_human`, and take over chats.
    -   *Note: In production, this requires authentication via the `/api/login` endpoint.*

## 2. Chat Logic & Handoff Flow
The system implements a strict 3-way handoff mechanism:

1.  **User <-> AI (Default State)**
    -   User sends message.
    -   Backend checks `handled_by` flag (default: 'ai').
    -   AI (Gemini) analyzes context + new message.
    -   **Filters**: Inappropriate content or non-ICT queries are rejected.
    -   **Refusal**: If AI cannot answer, it sets `needs_human = true`.

2.  **Handoff to Support**
    -   Trigger: AI confidence low OR explicit user request.
    -   System sets `needs_human = true`.
    -   Support Dashboard highlights the chat.
    -   Support clicks "Take Over" -> System sets `handled_by = 'human'`.
    -   **CRITICAL**: Once `handled_by = 'human'`, the AI **stops processing** messages for this chat.

3.  **User <-> Support (Human State)**
    -   Support replies manually.
    -   User sees support messages (labeled 'Support Agent').
    -   AI remains silent.

4.  **Release / Offline (Return to AI)**
    -   Support clicks "Release to AI".
    -   System sets `handled_by = 'ai'`.
    -   AI resumes interaction, having access to the full history (including human messages) for context.

## 3. Data Retention
-   Messages are stored in PostgreSQL.
-   **Retention Policy**: 7 days.
-   **Cleanup**: Cron job triggers daily. Old conversations are summarized by AI and raw messages are deleted to save space.

## 4. UI/UX Philosophy
-   **Header**: Clean, minimal, official branding (Logo only).
-   **Theme**: Dark, professional, educational.
-   **Layout**: ChatGPT-style (Sidebar + Main Chat).

---
*Next Phase: Knowledge Injection (Courses, Policies, FAQs)*
