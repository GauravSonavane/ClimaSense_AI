# Mobile Sidebar Fixes TODO

## Update MobileMenu.tsx
- [x] Change width from w-64 to w-3/4 (75% ≈70% requirement)
- [x] Remove pt-24, add py-4 for clean spacing
- [x] Increase logo size to w-20 h-20, add mb-8 for spacing
- [x] Add overflow-y-auto to nav container for scrollable content
- [x] Add useEffect to prevent body scroll when sidebar open (overflow: hidden)
- [x] Change overlay to bg-black/60 z-30, sidebar z-40
- [x] Change lg:hidden to md:hidden for <768px mobile

## Update SidebarNavItem.tsx
- [x] Remove lg:inline hidden from text span to show labels on mobile
- [x] Reduce icon size to h-4 w-4 for mobile
- [x] Change colors from muted-foreground to white/60 for consistency with desktop glass-dark theme

## Update Sidebar.tsx
- [x] Change hidden lg:flex to hidden md:flex to match ≥768px desktop requirement

## Followup steps
- [x] Test mobile view in browser at <768px width
- [x] Verify sidebar slides from left at 100% height, 75% width
- [x] Check logo centered at top with proper spacing
- [x] Ensure overlay covers full screen, prevents main scroll
- [x] Confirm menu items aligned with visible text, consistent spacing
- [x] Test hamburger/X button transitions
