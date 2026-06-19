---
name: Arteesans Admin
description: Operations dashboard for reviewing artisans, service requests, matching work, and categories.
colors:
  brand-blue: "#1e5896"
  brand-blue-dark: "#083769"
  brand-blue-light: "#55a7ff"
  brand-blue-muted: "#e8f0f9"
  background: "#ffffff"
  foreground: "#252525"
  muted-surface: "#f3f4f7"
  muted-foreground: "#404a5d"
  border: "#eaeaea"
  input-border: "#d0d5dd"
  success: "#009933"
  success-muted: "#e6f5ec"
  warning: "#ffae00"
  warning-muted: "#fff7e6"
  danger: "#e02d3c"
  danger-muted: "#fdeaec"
typography:
  title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "0"
  body:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0"
  data:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "32px"
    typography: "{typography.body}"
  button-secondary:
    backgroundColor: "{colors.muted-surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "32px"
    typography: "{typography.body}"
  input-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
    height: "32px"
    typography: "{typography.body}"
  badge-status:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "20px"
    typography: "{typography.label}"
  card-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: Arteesans Admin

## 1. Overview

**Creative North Star: "The Operations Desk"**

Arteesans Admin is a restrained operations workstation for the internal team reviewing artisan applications, monitoring service requests, manually matching customers to artisans, and maintaining categories. The visual system should feel precise, scan-friendly, and trustworthy at desk distance under ordinary office lighting. It is an app surface, not a brand campaign.

The current implementation uses a neutral shadcn base with Outfit typography and compact primitives. Future admin work should preserve that density while bringing in the Arteesans mobile brand palette: blue is the primary operational accent, neutrals remain quiet, and semantic colors communicate status rather than decoration.

This system explicitly rejects the PRODUCT.md anti-references: generic SaaS dashboards, cream or sand backgrounds, purple gradients, hero metric cards, identical icon-heavy marketing grids, over-rounded UI, glassmorphism, dense enterprise tables with no hierarchy, tiny uppercase tracked eyebrows on every section, placeholder metrics presented as real, and typical AI-generated admin UI slop.

**Key Characteristics:**
- Compact task density for repeated operational review sessions.
- One-family typography with Outfit across headings, labels, body, and data.
- Restrained neutral surfaces with Arteesans blue reserved for primary actions, active navigation, and important links.
- Tables and cards are functional containers, not decorative set pieces.
- State colors exist for approval, warning, and rejection outcomes.

## 2. Colors

The palette is restrained: white and cool neutral surfaces do most of the work, Arteesans blue marks action and selection, and semantic colors carry operational status.

### Primary
- **Arteesans Blue** (`brand-blue`): The brand accent for primary actions, active navigation, key links, focus moments, and selected states. Use it sparingly so it remains an operational signal.
- **Deep Arteesans Blue** (`brand-blue-dark`): Stronger blue for pressed states, dense headers, or high-emphasis brand moments when the default blue needs more contrast.
- **Light Arteesans Blue** (`brand-blue-light`): Limited to charts, subtle highlights, and non-critical data accents. Do not use it for body text.
- **Blue Review Wash** (`brand-blue-muted`): Low-emphasis blue surface for selected filters, informative callouts, and table row state when a full accent would be too loud.

### Neutral
- **Worksurface White** (`background`): Main page and card surface. The admin should stay bright and legible rather than atmospheric.
- **Ink Text** (`foreground`): Primary readable text for titles, table values, and labels.
- **Panel Neutral** (`muted-surface`): Secondary panels, table hover rows, card footers, and sidebar accents.
- **Secondary Ink** (`muted-foreground`): Supporting text, descriptions, timestamps, and metadata. It must remain readable against white and muted surfaces.
- **Divider Line** (`border`): Table rules, card rings, section boundaries, and sidebar borders.
- **Field Line** (`input-border`): Form control borders where fields need clearer affordance than a hairline divider.

### Tertiary
- **Approval Green** (`success`): Approved, matched, or complete statuses only.
- **Approval Mist** (`success-muted`): Background tint for success badges and non-interactive success callouts.
- **Attention Amber** (`warning`): Pending review, needs information, or delayed work.
- **Attention Mist** (`warning-muted`): Background tint for warning badges and low-priority alerts.
- **Rejection Red** (`danger`): Reject, destructive, failed, or blocked states.
- **Rejection Mist** (`danger-muted`): Background tint for destructive badges and error surfaces.

### Named Rules

**The Blue Is Work Rule.** Blue is not decoration. It means proceed, select, review, navigate, or act.

**The Neutral Is Not Beige Rule.** Admin surfaces stay white, cool neutral, or brand-tinted. Do not introduce cream, sand, parchment, tan, or warm paper backgrounds.

**The Status Means Status Rule.** Green, amber, and red are reserved for real operational state. Never use them as ornamental palette variety.

## 3. Typography

**Display Font:** Outfit with system sans fallbacks.
**Body Font:** Outfit with system sans fallbacks.
**Label/Mono Font:** Geist Mono is available for code-like values only; operational UI should default to Outfit.

**Character:** Outfit gives the dashboard a clean marketplace-ops tone without becoming generic enterprise UI. The hierarchy is intentionally tight because this is a dashboard with tables, filters, and repeated actions.

### Hierarchy
- **Display** (600, `1.875rem`, 1.2): Use only for dashboard metrics or empty-state lead text. Product UI should not use oversized marketing display type.
- **Headline** (600, `1.25rem`, 1.3): Page titles and major panel titles.
- **Title** (500, `1rem`, 1.375): Card titles, table entity names, dialog titles, and sidebar brand text.
- **Body** (400, `0.875rem`, 1.5): Default UI copy, table cells, descriptions, and form help. Keep longer prose to 65-75ch.
- **Label** (500, `0.75rem`, 1.25, no tracking): Badges, compact metadata, small controls, and table-adjacent labels. Do not uppercase labels by default.

### Named Rules

**The One Sans Rule.** Use Outfit for product UI. Do not introduce display fonts for buttons, labels, tables, or navigation.

**The Dense But Legible Rule.** Prefer the existing `text-sm` and 32-36px control heights for admin workflows, but never reduce muted text below readable contrast.

## 4. Elevation

The admin is flat by default and uses tonal layering, borders, and rings for structure. Existing cards use a 1px foreground ring and occasional `shadow-xs`; sidebar floating mode may use `shadow-sm`. Avoid wide blurred shadows and avoid pairing a decorative border with a large soft shadow.

### Shadow Vocabulary
- **Hairline Container Ring** (`ring: 1px solid color-mix with foreground at 10%`): Default card and grouped surface boundary.
- **Tiny Lift** (`box-shadow: var(--shadow-xs)`): Acceptable for dashboard stat cards when the container needs to separate from a flat page.
- **Floating Sidebar Lift** (`box-shadow: var(--shadow-sm)`): Only for the optional floating sidebar variant.

### Named Rules

**The Flat-First Rule.** Surfaces sit on the page unless interaction or layout requires separation. Reach first for spacing, border, or tonal contrast.

**The No Ghost Cards Rule.** Do not combine a 1px border with a soft shadow blur of 16px or more on cards, buttons, alerts, or panels.

## 5. Components

### Buttons
- **Shape:** Compact rounded rectangles (8-10px radius), never pill buttons for standard admin actions.
- **Primary:** Arteesans blue background with white text, 32px default height, `text-sm` medium weight. Use for Apply, Review, Save, Approve, and other primary workflow actions.
- **Hover / Focus:** Hover darkens or reduces opacity; focus uses a 3px ring with the ring token at 50% opacity. Active may translate down by 1px.
- **Secondary / Ghost / Tertiary:** Secondary uses neutral muted surfaces. Ghost buttons should only appear in toolbars, sidebars, and row actions where the surrounding structure supplies the affordance.

### Chips
- **Style:** Status badges use 20px height, pill radius, `text-xs` medium weight, and either outline or semantic muted backgrounds.
- **State:** Badges must mirror real data states such as pending, approved, rejected, matched, active, or needs information. Avoid decorative badges.

### Cards / Containers
- **Corner Style:** Soft product radius (12px for cards).
- **Background:** White by default; stat cards may use a subtle blue-tinted top gradient only when tied to dashboard metrics.
- **Shadow Strategy:** Hairline ring and optional `shadow-xs`; no soft decorative card shadows.
- **Border:** Use full ring or border treatment, not colored side stripes.
- **Internal Padding:** 16px default card spacing, 12px for small cards, 24px page rhythm around dashboard groups.

### Inputs / Fields
- **Style:** 32px height, 8px radius, transparent or white background, clear field border.
- **Focus:** Border shifts to ring color and receives a 3px focus ring at 50% opacity.
- **Error / Disabled:** Error uses destructive border and ring tint. Disabled fields reduce opacity and use muted input background.

### Navigation
- **Style:** Left sidebar, 16rem desktop width, 18rem mobile sheet width, lucide icons, compact row buttons, and clear active states.
- **Default / Hover / Active:** Default items stay neutral. Hover uses muted surface. Active items should use blue or blue-muted treatment when branded navigation is implemented.
- **Mobile Treatment:** Sidebar becomes a sheet. Keep the sheet direct and utility-first; no modal-like marketing treatment.

### Tables
- **Style:** Tables are the core admin affordance. Use `text-sm`, 40px header height, 8px cell padding, horizontal overflow, border-bottom row separation, and hover rows using muted surface.
- **Hierarchy:** Entity names are medium weight; contact details and metadata use secondary ink. Actions align right and use blue link treatment or compact buttons.

## 6. Do's and Don'ts

### Do:
- **Do** use Arteesans blue (`brand-blue`) for primary actions, active navigation, key links, and selected operational states.
- **Do** preserve Outfit as the UI typeface across headings, labels, body text, data, buttons, and navigation.
- **Do** keep the dashboard dense enough for operators handling multiple pending items in one session.
- **Do** use real status vocabulary and real data in tables, badges, and dashboard cards.
- **Do** use full borders, rings, tonal fills, and spacing to separate surfaces.
- **Do** keep cards at 12px radius or less unless the component is a badge or icon button that genuinely needs pill geometry.
- **Do** provide hover, focus, active, disabled, loading, error, and empty states for interactive admin components.

### Don't:
- **Don't** build generic SaaS dashboards with cream/sand backgrounds, purple gradients, hero metric cards, or identical icon+heading+text card grids.
- **Don't** use over-rounded UI with 32px+ card radii, glassmorphism, or the ghost-card pattern of a 1px border plus wide soft shadow.
- **Don't** make dense enterprise tables with no visual hierarchy; entity, metadata, status, and action columns need different weight and tone.
- **Don't** add tiny uppercase tracked eyebrows on every section.
- **Don't** present placeholder or demo data as if real.
- **Don't** use side-stripe borders as colored accents on cards, list items, callouts, or alerts.
- **Don't** use gradient text, decorative page-load choreography, or display fonts in UI labels, buttons, and data.
- **Don't** treat modals as the first design answer; prefer inline review, progressive disclosure, sheets, or detail pages for admin workflows.
