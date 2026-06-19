# Product

## Register

product

## Users

Admin operators at Arteesans — the internal team reviewing artisan applications, monitoring service requests, manually matching customers to artisans, and managing service categories. They work at a desk, often handling multiple pending items in a session. The primary surface is the Next.js admin dashboard (`apps/admin`).

Mobile app users (customers and artisans) are secondary for design work right now; their Figma tokens and color palette are the source of truth for brand consistency when polishing the admin.

## Product Purpose

Arteesans is a two-sided service marketplace connecting customers with verified artisans in Nigeria. The admin dashboard is the operations control plane: approve artisans, review requests, assign matches, and maintain categories. Design success means the dashboard feels like a professional ops tool — fast to scan, consistent with the mobile brand, and free of generic AI-dashboard patterns.

## Brand Personality

Professional, efficient, precise. The admin should feel like a serious marketplace operator's workstation — not a marketing page, not a demo dashboard. Clarity and trust over decoration.

## Anti-references

- Generic SaaS dashboards: cream/sand backgrounds, purple gradients, hero metric cards, identical icon+heading+text card grids
- Over-rounded UI (32px+ card radii), ghost-card pattern (1px border + wide soft shadow), glassmorphism
- Dense enterprise tables with no visual hierarchy
- Tiny uppercase tracked eyebrows on every section
- Placeholder or demo data presented as if real
- Typical AI-generated admin UI slop

## Design Principles

1. **Clarity over decoration** — every screen answers "what needs my attention right now?"
2. **Brand consistency** — admin inherits Arteesans blue (`#1e5896`) and Outfit typography from mobile/Figma tokens; admin's default shadcn neutral theme should be aligned
3. **Efficient ops** — minimize clicks for approve, reject, review, and filter workflows
4. **Trust through precision** — real data, accurate status badges, no filler metrics
5. **Restrained surface** — product register; design serves the work, it doesn't perform

## Accessibility & Inclusion

Basic accessibility for now: readable text contrast, sensible focus states, standard keyboard interaction. No strict WCAG AAA requirement yet. Respect `prefers-reduced-motion` when adding animations.
