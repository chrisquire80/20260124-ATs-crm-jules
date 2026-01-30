## 2025-01-24 - revalidateTag Signature Mismatch
**Learning:** Next.js 16.1.4 type definitions for `revalidateTag` unexpectedly require a second argument (options/provider), causing build failures when using the standard single-argument signature.
**Action:** Inspect local type definitions or checks when upgrading Next.js versions; use a dummy argument (e.g. `'default'`) if required to satisfy the compiler in this environment.
