## 2026-01-27 - Caching Static Market Data
**Learning:** The `getMarketScore` function was fetching the entire `JobCategory` table on every invocation. Since this data changes infrequently (only via import), it's a prime candidate for `unstable_cache`.
**Action:** Always check for repeated database calls for static/reference data in calculation functions and use Next.js Data Cache (`unstable_cache`) with tag-based revalidation.
