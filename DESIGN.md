# Design System Document: The Sovereign Intelligence

## 1. Overview & Creative North Star

This design system is built for high-stakes B2B decision-making. In the world of professional tendering and AI analysis, clarity is a prerequisite, but authority is the differentiator. 

**Creative North Star: The Digital Curator**
The design system rejects the "busy dashboard" trope in favor of an editorial, high-end experience. We treat data as high-value intelligence, using intentional asymmetry and significant breathing room to guide the user’s eye. The aesthetic is inspired by premium financial terminals and sophisticated dark-mode interfaces, moving away from flat "app" looks toward a layered, atmospheric environment. By utilizing deep tonal depth and sharp, intentional typography, we create an interface that feels less like a tool and more like a competitive advantage.

---

## 2. Colors

The palette is anchored in deep, midnight hues that provide a stable foundation for high-contrast data visualization.

### The "No-Line" Rule
To achieve a premium feel, **prohibit the use of 1px solid borders for sectioning.** Structural separation must be achieved through background shifts. For example, a sidebar using `surface_container_low` should sit directly against the `background` (or `surface`) without a divider line. The transition in tone is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of intelligence layers. 
- **Base Layer:** `surface` (#111318) for the main application background.
- **Structural Layer:** `surface_container_low` (#1a1c20) for primary navigation or sidebar zones.
- **Content Layer:** `surface_container` (#1e2024) for main content cards.
- **Active Layer:** `surface_container_high` (#282a2e) for active states or elevated modals.

### The Glass & Gradient Rule
Floating elements (tooltips, dropdowns, AI snackbars) must utilize **Glassmorphism**. Use a semi-transparent `surface_container_highest` with a 12px to 20px backdrop-blur. 
For primary CTAs and hero highlights, use a subtle radial gradient transitioning from `primary` (#adc7ff) to `primary_container` (#002e67). This adds "soul" and prevents the interface from feeling static or "flat."

---

## 3. Typography

The typography strategy leverages two distinct sans-serif families to balance editorial authority with technical legibility.

- **Display & Headlines (Manrope):** We use Manrope for its geometric precision and modern professional tone. Large scales (Display-LG 3.5rem) should be used with tight tracking (-2%) to create a bold, authoritative "editorial" look.
- **Body & Labels (Inter):** Inter is the workhorse. It provides maximum legibility for dense AI tender analysis and data tables. 
- **Scale Hierarchy:** Use `headline-sm` for section titles and `label-sm` for metadata. The high contrast between a `display-md` hero title and `body-sm` descriptive text creates a premium, intentional layout typical of high-end design.

---

## 4. Elevation & Depth

We move beyond traditional Material Design shadows to create an "Atmospheric Depth" model.

- **The Layering Principle:** Depth is conveyed by "stacking" container tokens. A `surface_container_lowest` card placed on a `surface_container_low` section creates a natural "in-set" feel.
- **Ambient Shadows:** Standard drop shadows are forbidden. If an element must float, use a "Large-Blur/Low-Opacity" shadow: `blur: 40px`, `y: 20px`, `color: rgba(0, 0, 0, 0.4)`. The shadow should feel like a soft glow of darkness rather than a hard edge.
- **The Ghost Border Fallback:** If accessibility requires a border, use the `outline_variant` (#454652) at **15% opacity**. This creates a "suggestion" of a boundary without cluttering the visual field.
- **Light Accents:** Following the inspiration image, use subtle glows (radial gradients with 5% opacity of `tertiary`) behind key data widgets to simulate light refracting through a dark lens.

---

## 5. Components

### Buttons
- **Primary:** `primary` background with `on_primary` text. Use `xl` (0.75rem) roundedness. Add a subtle 1px "inner-glow" (top-edge highlight) for a tactile feel.
- **Secondary:** Transparent background with an `outline` ghost border (20% opacity).
- **Tertiary/Ghost:** No background or border. Use for low-priority actions like "Cancel" or "Clear All."

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Execution:** Use the spacing scale `4` (1rem) or `5` (1.25rem) to separate list items. Use a `surface_container_low` hover state to highlight rows.
- **Roundedness:** All cards must use `lg` (0.5rem) or `xl` (0.75rem) to maintain a modern, sophisticated silhouette.

### Data Visualization & Trust Badges
- **Success Indicators:** Use `tertiary` (#e4c27c) or success greens to highlight win probabilities in tenders.
- **Trust Badges:** Rendered as semi-transparent "Glass" chips using `surface_container_highest` and `label-md` Inter.
- **AI Analysis Chips:** Use a gradient stroke (Primary to Tertiary) to signify AI-driven insights, separating them from standard data.

### Input Fields
- **Default State:** `surface_container_highest` background with no border.
- **Active State:** A subtle 1px border using `primary` at 40% opacity and a soft "bloom" shadow.

---

## 6. Do's and Don'ts

### Do
- **Do** use `display-lg` for key metrics; let the numbers tell a story through scale.
- **Do** allow elements to overlap slightly (e.g., an AI insight card overlapping a data table) to break the rigid grid and create depth.
- **Do** use the `24` (6rem) spacing for hero sections to ensure the platform feels "luxurious" and un-crowded.

### Don't
- **Don't** use pure black (#000000). Always use the `surface` or `background` tokens to maintain tonal depth.
- **Don't** use 100% opaque white for text. Use `on_surface_variant` (#c6c5d4) for secondary text to reduce eye strain in dark mode.
- **Don't** use sharp corners. The `none` roundedness scale is strictly prohibited for interactive elements; keep the interface "soft yet professional."
- **Don't** use standard blue hyperlinks. Use the `primary` token with a subtle underline offset by `2px`.