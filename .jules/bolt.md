## 2024-05-22 - Server Action N+1
**Learning:** Chaining server actions often leads to N+1 queries if each action fetches its own data.
**Action:** Extract logic into internal helpers that accept data objects, allowing the parent action to fetch all needed data once (including relations) and pass it down.
