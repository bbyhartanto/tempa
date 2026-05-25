# Implement GSAP Observer for Smooth Section Scrolling

The objective is to implement scroll-like behavior using GSAP Observer, similar to the GreenSock codepen (Animated Continuous Sections). This will hijack the native scroll and instead smoothly transition between full-screen sections upon a user's wheel, touch, or pointer swipe.

## User Review Required

> [!WARNING]
> Implementing GSAP Observer for full-page slides involves disabling native browser scrolling on the page. All sections must be styled to fit within `100vh` (the viewport height) or have internal scrolling enabled. This is a significant architectural change to how your site flows.

## Open Questions

> [!IMPORTANT]
> **1. Handling Tall Sections (e.g., `SectionServices`)**
> The `SectionServices` component contains a lot of content and may exceed the screen height on smaller devices (like laptops or tablets). For the Observer pattern, each section typically needs to be strictly `100vh`. 
> *How would you like to handle overflow?* 
> - **Option A:** Allow internal vertical scrolling within the `SectionServices` slide itself when it overflows.
> - **Option B:** Break `SectionServices` into two or three separate slides (e.g., "Design Services" slide and "Development Services" slide).

> [!IMPORTANT]
> **2. Handling `SectionFooter`**
> The `SectionFooter` is currently injected by the `home.astro` layout, meaning it applies globally. 
> *How should it behave with the new slider logic?*
> - **Option A:** Include it as the final slide in the GSAP Observer. This means it will snap in full-screen like the other sections.
> - **Option B:** Leave it outside the Observer slider and only reveal it when scrolling past the last CTA section (this is trickier to mix with scroll-jacking).

## Proposed Changes

We will introduce a wrapper for all sections to act as slides and apply GSAP Observer to navigate between them.

### `src/pages/index.astro`

#### [MODIFY] index.astro
- Add a common class (e.g., `observer-section`) to all top-level sections (Hero, `SectionServices`, `SectionTechStack`, and the CTA).
- Restructure the DOM to group these sections together so they can be layered absolutely (`position: absolute`, `width: 100vw`, `height: 100vh`, `top: 0`, `left: 0`).
- Update the `<script>` tag:
  - Import `Observer` from GSAP.
  - Implement the `gotoSection(index, direction)` logic.
  - Create the `Observer.create(...)` instance to listen for wheel and drag events, calling `gotoSection` to smoothly translate/slide the sections in and out.

### `src/layouts/home.astro`

#### [MODIFY] home.astro
- Add a conditional class or inline style to the `<body>` element to apply `overflow: hidden` so that the native scrollbar does not interfere with the GSAP Observer logic on the home page.

## Verification Plan

### Automated Tests
- Run `npm run dev` and ensure there are no build errors.

### Manual Verification
- Verify that native scrolling is disabled on the home page.
- Test scroll wheel on desktop: verify that one scroll tick smoothly slides the next section in from the bottom.
- Test trackpad/touch swipe to verify swipe gestures trigger the transitions.
- Ensure the Hero timeline animations still play correctly when the page loads or when transitioning back to the Hero slide.
