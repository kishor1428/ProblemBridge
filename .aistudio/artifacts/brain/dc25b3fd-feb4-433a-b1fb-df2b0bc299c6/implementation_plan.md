# Implementation Plan — ProblemBridge Master Production Upgrade

## 1. Executive Summary & Vision

**ProblemBridge** is a high-impact, real-time collaboration ecosystem connecting problem owners (MSMEs, rural clinics, non-profits, civic entities) with skilled solvers (engineers, students, researchers, domain experts).

This plan outlines the systematic transformation of ProblemBridge from an in-memory/JSON-backed prototype into a secure, production-grade, full-stack platform powered by **Cloud Firestore**, **Firebase Authentication**, **Express + Firebase Admin SDK**, and **Google Gemini 2.5 Flash** server-side assistants.

---

## 2. Confirmed Product Requirements

Based on user inputs from the clarification stage:
1. **Authentication Providers**: Both **Google Sign-In** and **Email with Password** (with email verification and password reset flows).
2. **Data Migration**: Auto-seed existing sample data (`db.json`) into Cloud Firestore on server startup if collections are uninitialized, ensuring zero downtime and immediate availability of rich initial challenges.
3. **Collaboration Workspace**: Full-featured workspace with task assignment boards, milestone tracking, shared documents/files, and team permissions.
4. **AI Assistance**: Gemini API strictly server-side (`server.ts`) for Problem Formulation, Proposal Structuring, Solution Guidance, and Profile Analysis.
5. **Role-Based Access Control (RBAC)**: Backend verification for Problem Owners, Solvers, and Platform Administrators.

---

## 3. Codebase Audit & Security Vulnerabilities

| Area | Current Implementation | Identified Vulnerability / Gap | Production Target |
| :--- | :--- | :--- | :--- |
| **Authentication** | Client-side simulated user switching via `activeUserId` in React state. | Anyone can forge `ownerId`, `solverId`, or `admin` requests; zero token verification. | Firebase Auth (JWT Bearer tokens), verified server-side with Firebase Admin SDK. |
| **Database** | Local `src/db/db.json` with synchronous `fs.writeFileSync`. | Not scalable across processes; race conditions; data loss risk on crashes; lack of row-level security. | Cloud Firestore with subcollections, indexing, and strict `firestore.rules`. |
| **Proposals** | In-memory CRUD without concurrency or state transition validation. | Duplicate applications allowed; applicants can mutate accepted proposals; unauthenticated status changes. | Firestore transactions with atomic terminal state enforcement (`pending` -> `accepted` / `rejected`). |
| **Messaging** | Mock threads stored in `db.json` with synchronous REST polling. | No real-time listeners; unauthenticated message creation; no cross-member access controls. | Real-time Firestore snapshots (`conversations/{id}/messages`) protected by participant checks. |
| **Workspace** | Fragmented task lists in UI without team authorization or milestone tracking. | Lack of shared workspace authorization; anyone with task ID can delete or modify tasks. | Dedicated `projects/{projectId}` with role-governed `projectTasks` and `milestones`. |
| **AI Assistants** | Server-side Gemini endpoint without user rate-limiting or payload sanitization. | Potential key abuse; inconsistent response schemas causing UI render issues. | Structured JSON schemas with Gemini 2.5 Flash, request sanitization, and quota safeguards. |
| **Admin Console** | Frontend-only boolean check (`user.role === 'admin'`). | Any client can call admin management APIs by sending arbitrary requests. | Custom Auth Claims (`request.auth.token.admin == true`) verified in Firestore rules & Express middleware. |

---

## 4. System Architecture

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  |  React 19 + Vite   |   |   Tailwind CSS UI     |   |   Firebase Client SDK  |  |
|  |  - Auth Context    |   |   - Problem Discovery |   |   - Auth & State       |  |
|  |  - Workspace UI    |   |   - Proposal Modals   |   |   - Real-time Sync     |  |
|  |  - Messaging Room  |   |   - Admin Governance  |   |   - Direct Firestore   |  |
|  +---------+----------+   +-----------+-----------+   +-----------+------------+  |
+------------|--------------------------|---------------------------|---------------+
             | HTTPS (Bearer JWT)       | REST APIs                 | Real-time WS
             v                          v                           |
+-------------------------------------------------------------------|---------------+
|                                BACKEND TIER                       |               |
|  +-------------------------------------------------------------+  |               |
|  |                  Express Application Server                 |  |               |
|  |  - Auth Middleware (Firebase Admin Token Verification)       |  |               |
|  |  - Rate Limiting & Input Validation (Zod)                   |  |               |
|  |  - Gemini AI Proxy (Problem / Proposal / Doubt Assistant)   |  |               |
|  |  - Firestore Auto-Seeder (Initializes from db.json)         |  |               |
|  +------------------------------+------------------------------+  |               |
|                                 | Firebase Admin SDK              |               |
+---------------------------------|---------------------------------|---------------+
                                  v                                 v
+-----------------------------------------------------------------------------------+
|                                CLOUD SERVICES                                     |
|  +---------------------------+  +--------------------------+  +----------------+  |
|  |      Cloud Firestore      |  |     Firebase Auth        |  |   Gemini AI    |  |
|  |  - Users & Profiles       |  |  - Email / Password      |  |  - 2.5 Flash   |  |
|  |  - Problems & Proposals   |  |  - Google OAuth          |  |  - Structured  |  |
|  |  - Projects & Tasks       |  |  - Custom Claims (Admin) |  |    Responses   |  |
|  |  - Messages & Logs        |  |                          |  |                |  |
|  +---------------------------+  +--------------------------+  +----------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 5. Firestore Schema Blueprint & RBAC

### Collections Structure

1. **`users/{userId}`**
   - Public profile: `displayName`, `email`, `role` (`solver` | `owner` | `admin`), `avatarUrl`, `bio`, `skills[]`, `organization`, `rating`, `createdAt`.
   - Private subcollection: `users/{userId}/private/settings` (notifications, contact details).

2. **`problems/{problemId}`**
   - Fields: `title`, `description`, `category`, `requiredSkills[]`, `difficulty` (`beginner` | `intermediate` | `expert`), `status` (`draft` | `open` | `under_review` | `in_progress` | `completed` | `closed`), `ownerId`, `ownerName`, `ownerAvatar`, `budgetOrStipend`, `deadline`, `proposalCount`, `selectedSolverIds[]`, `createdAt`, `updatedAt`.

3. **`proposals/{proposalId}`**
   - Fields: `problemId`, `problemTitle`, `solverId`, `solverName`, `solverAvatar`, `solverSkills[]`, `proposedSolution`, `estimatedDurationDays`, `budgetEstimate`, `status` (`submitted` | `shortlisted` | `accepted` | `rejected` | `withdrawn`), `createdAt`.

4. **`projects/{projectId}`** (Created upon proposal acceptance)
   - Fields: `problemId`, `title`, `ownerId`, `acceptedProposalId`, `solverIds[]`, `status` (`planning` | `in_progress` | `review` | `completed`), `milestones[]`, `createdAt`, `updatedAt`.
   - Subcollection: `projects/{projectId}/tasks/{taskId}`: `title`, `description`, `assigneeId`, `status` (`todo` | `in_progress` | `done`), `priority` (`low` | `medium` | `high`), `dueDate`.
   - Subcollection: `projects/{projectId}/files/{fileId}`: `fileName`, `fileUrl`, `fileSize`, `uploadedBy`, `uploadedAt`.

5. **`conversations/{conversationId}`**
   - Fields: `participantIds[]`, `type` (`direct` | `project`), `projectId` (optional), `lastMessage`, `lastMessageTime`, `unreadCounts`.
   - Subcollection: `conversations/{conversationId}/messages/{messageId}`: `senderId`, `senderName`, `senderAvatar`, `text`, `attachments[]`, `createdAt`.

6. **`notifications/{notificationId}`**
   - Fields: `recipientId`, `actorId`, `actorName`, `type` (`proposal_received`, `proposal_accepted`, `proposal_rejected`, `task_assigned`, `new_message`, `project_status`), `referenceId`, `title`, `body`, `read`, `createdAt`.

7. **`auditLogs/{logId}`** (Admin only)
   - Fields: `adminId`, `action`, `targetType`, `targetId`, `details`, `timestamp`.

---

## 6. Phased Implementation Roadmap

### Phase 1: Firebase Provisioning & Security Baseline
- Trigger Firebase setup UI via `show_aistudio_ui` (`firebase_setup`).
- Provision Firestore database via `rpc_action` (`ProvisionFirebase`).
- Install Firebase client and admin packages (`firebase`, `firebase-admin`).
- Draft strict `firestore.rules` adhering to the blueprint with ownership and RBAC enforcement.
- Initialize Firebase Admin in `server.ts` with authentication verification middleware (`verifyAuthToken`).

### Phase 2: Problems Lifecycle, Filter Engine & Data Seeding
- Implement startup database seeder in `server.ts` to populate Firestore from `db.json` if collections are empty.
- Build Firestore-backed Problem services (CRUD with real-time updates and pagination).
- Create multi-criteria discovery engine: full-text search, categories, difficulty, status, and required skills filtering.
- Implement problem creation & editing modal with rich validation and category selection.

### Phase 3: Proposal System & Full Collaboration Workspace
- Build Proposal submission flow with duplicate application prevention and profile preview.
- Build Owner Proposal Review portal (Shortlist, Accept, Reject, View Solver Profile).
- Implement atomic project generation upon proposal acceptance.
- Build **Collaboration Workspace** (`/workspace/:projectId`):
  - Kanban / List Task board with real-time drag/status updates.
  - Milestone progress tracker with completion verification.
  - Shared Project Document / File vault.
  - Team member directory with role indicators.

### Phase 4: Persistent Real-Time Messaging & Notifications
- Implement 1-to-1 and Project-wide messaging channels backed by Firestore real-time snapshots.
- Build instant notification trigger engine (proposals, acceptances, task assignments, messages).
- Connect the notification center dropdown with interactive action buttons (review candidate profile, approve, dismiss).

### Phase 5: Gemini AI Assistants & Platform Governance
- Refactor backend Gemini endpoints to use `@google/genai` (`gemini-2.5-flash`):
  - **AI Problem Formulator**: Clarifies vague problem descriptions and suggests skills.
  - **AI Proposal Structurer**: Helps solvers craft competitive technical solutions.
  - **AI Doubt Solver**: Answers technical and architectural questions in-context.
  - **AI Profile & Opportunity Matcher**: Suggests relevant challenges to solvers based on their expertise.
- Build Administrator Console with user management, status moderation, category manager, and platform analytics.

### Phase 6: End-to-End Verification & Production Readiness
- Verify all routes, auth flows, and database listeners.
- Run `lint_applet` and `compile_applet`.
- Verify mobile responsiveness and cross-device display.
- Conduct final security audit to ensure no exposed API keys, no open Firestore rules, and no unauthenticated mutations.

---

## 7. Approval & Execution

Click **Proceed** below to approve this implementation plan and begin Phase 1: Firebase Provisioning & Authentication setup.
