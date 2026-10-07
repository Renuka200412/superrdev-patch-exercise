# Notes

### Summary of Changes
- **SQL Operator Precedence**: Added parentheses around `(LOWER(title) LIKE :term OR LOWER(description) LIKE :term)` in `TaskRepository.java`, `search_tasks.sql`, and `task_search_package.sql` to prevent archived tasks from leaking and ensure status filters apply to title matches.
- **Backend Latency & Robustness**: Removed artificial `Thread.sleep` bottleneck in `TaskController.java`. Added safe handling for invalid status query parameters (returns 400 Bad Request) and boundary validation for pagination (`page >= 1`).
- **Frontend State & Concurrency**: Added a cleanup flag in `useTasks.js` to discard stale async responses, ensured `loading` resets to `false` on fetch failure, added a 300ms debounce to search queries, and reset the active page to 1 whenever search or status filters change.

### What Was Not Changed & Why
- Kept in-memory pagination via `subList` rather than refactoring to Spring Data `Pageable`/SQL `LIMIT-OFFSET` to maintain the existing repository contract and keep changes small and focused within the exercise timebox.
- Did not modify UI styling or layout components because existing CSS fulfills functional requirements.

### Biggest Remaining Risk
Pagination and total count queries fetch the entire matching result set into JVM memory. As the task dataset grows into tens of thousands of records, this will degrade heap memory and query performance. It should be refactored to native database-level pagination with composite indexes on `(archived, status, created_at)`.

### Tools & AI Used
Used Antigravity agent to trace the operator precedence bug across Java and PL/SQL artifacts, diagnose unhandled catch blocks in `useTasks.js`, and assist in drafting the debounce hook.
