# Security Specification

## Data Invariants
1. A Project must have 3 images and a valid category ('Client' or 'Personal').
2. Pricing cards must have at least one feature.
3. Only the verified owner (hamimsamiul7@gmail.com) can modify data.
4. Timestamps (createdAt, updatedAt) must be server-validated.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempt to create a project as an unauthenticated user.
2. **Identity Spoofing (Email)**: Attempt to update settings as an authenticated user who is NOT the admin (e.g., hacker@gmail.com).
3. **Identity Spoofing (Untrusted Claim)**: Attempt to update settings by spoofing a non-verified email.
4. **Resouce Poisoning (ID)**: Attempt to create a document with a 2KB string as ID.
5. **Schema Violation**: Create a project with only 1 image instead of 3.
6. **Schema Violation (Type)**: Set `order` to a string instead of a number.
7. **Shadow Field Injection**: Update a project and inject `isApproved: true` (a field not in the blueprint).
8. **State Shortcutting**: Attempt to update `updatedAt` with an arbitrary client timestamp.
9. **Denial of Wallet**: Attempt to list projects with a query that filters on 1MB string.
10. **Orphaned Writes**: Create a project with an ID that uses invalid characters like `!@#$%`.
11. **PII Leak**: Attempt to read a (hypothetical) `users` collection without being the owner.
12. **Immutable Field Change**: Attempt to change the `createdAt` timestamp of a project during an update.

## Test Runner Logic
The following tests will be implemented in `firestore.rules.test.ts` (conceptual for now, rules will be generated to block these).
- Unauthenticated write -> DENIED
- Authenticated non-admin write -> DENIED
- Non-verified email write -> DENIED
- Invalid ID write -> DENIED
- Schema mismatch write -> DENIED
- Shadow key write -> DENIED
- Client-side timestamp write -> DENIED
