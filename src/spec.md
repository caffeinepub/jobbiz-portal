# Specification

## Summary
**Goal:** Add admin approval system for employee, employer, and business listings.

**Planned changes:**
- Add approval status (pending, approved, rejected) to employee, employer, and business data models with timestamps and rejection reasons
- Set all new registrations and listings to pending status by default
- Create admin dashboard at /admin route to review and approve/reject pending items
- Filter public job listings and business directory to show only approved entries
- Display approval status on user profile page with informative messaging
- Add admin-only navigation link in header
- Implement backend authorization to restrict approval actions to admin users only

**User-visible outcome:** Admin users can review and approve/reject new employee, employer, and business registrations through a dedicated dashboard. Public listings only show approved content. Users can see their approval status on their profile page.
