# Security Specification — ProblemBridge

## 1. Core Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or modified by the authenticated user whose `request.auth.uid == userId`. Role escalation to `admin` via client write is strictly forbidden.
2. **Problem Ownership Invariant**: Only authenticated users with `role in ['owner', 'admin']` or validated owners can publish problems. The `ownerId` must equal `request.auth.uid` on creation and remains immutable on updates.
3. **Proposal Integrity Invariant**: A proposal at `/proposals/{proposalId}` can only be created by the applicant (`solverId == request.auth.uid`). Once submitted, only the owner can change status to `Accepted`/`Rejected`, and only the applicant can edit technical details or withdraw.
4. **Workspace Partitioning Invariant**: Project workspaces (`/projects/{projectId}`) and their subcollections (`tasks`, `files`) are accessible exclusively to verified team members (`ownerId` or members of `solverIds`) or admins.
5. **Direct Communication Confidentiality Invariant**: Conversations and messages are restricted strictly to users present in `participantIds`.
6. **Notification Privacy Invariant**: Notifications can only be retrieved or marked as read by the specified `recipientId == request.auth.uid`.

## 2. The Dirty Dozen Attack Payloads
1. **Identity Spoofing**: Attempting to create a profile with a mismatched UID (`request.auth.uid = 'alice'`, payload `id = 'bob'`). Expect `PERMISSION_DENIED`.
2. **Ghost Field Injection**: Attempting to add an arbitrary undocumented field `isAdmin: true` during profile update. Expect `PERMISSION_DENIED`.
3. **Problem Hijack**: Attempting to update `ownerId` on an existing problem. Expect `PERMISSION_DENIED`.
4. **Unauthenticated Problem Publication**: Attempting to post a problem with `request.auth = null`. Expect `PERMISSION_DENIED`.
5. **Unauthorized Proposal Status Transition**: Solver attempting to set their own proposal status from `Submitted` to `Accepted`. Expect `PERMISSION_DENIED`.
6. **Workspace Intrusion**: User not in `solverIds` or `ownerId` attempting to read `/projects/{projectId}/tasks`. Expect `PERMISSION_DENIED`.
7. **Task Field Poisoning**: Assigning task to an unauthenticated ID or passing 1MB text into `title`. Expect `PERMISSION_DENIED`.
8. **Message Forgery**: Creating a message in another user's conversation with `senderId != request.auth.uid`. Expect `PERMISSION_DENIED`.
9. **Notification Scraping**: Non-recipient querying `/notifications` to read another user's alerts. Expect `PERMISSION_DENIED`.
10. **Connection Request Mutation**: Non-owner approving or modifying a connection request. Expect `PERMISSION_DENIED`.
11. **Immortal Field Tampering**: Attempting to modify `createdAt` or `problemId` on an accepted proposal. Expect `PERMISSION_DENIED`.
12. **Blanket Query Exploitation**: Unfiltered query on private subcollection without `isOwner` condition. Expect `PERMISSION_DENIED`.
