# Implementation Plan: Executive Landing Page

## Overview

Build a premium executive personal landing page for Carlos Alberto Figueroa Martínez using Angular 17+ (standalone components, signals, SSR), SCSS design tokens + TailwindCSS, GSAP animations, deployed on Vercel with a Neon PostgreSQL backend for contact form lead capture. Implementation follows an incremental approach: project scaffolding → design tokens & shared utilities → section components → serverless API → SSR & deployment configuration.

## Tasks

- [x] 1. Project scaffolding and core configuration
  - [x] 1.1 Initialize Angular 17+ project with standalone components, SSR, and configure app.config.ts with provideClientHydration, provideHttpClient(withFetch), provideAnimations
    - Set up angular.json with SCSS support and TailwindCSS
    - Install dependencies: gsap, @ngneat/until-destroy, lucide-angular, @neondatabase/serverless, fast-check (dev)
    - Configure tailwind.config.js with custom theme extending design tokens
    - _Requirements: 10.6, 12.6, 14.1_

  - [x] 1.2 Create SCSS design tokens system and global styles
    - Create `src/styles/_tokens.scss` with all color, typography, spacing, glassmorphism, gradient, breakpoint, and animation variables
    - Create `src/styles/_glassmorphism.scss` with reusable glassmorphism mixins
    - Create `src/styles/_typography.scss` with font-face declarations and heading styles
    - Create `src/styles/_animations.scss` with keyframe definitions
    - Create `src/styles/styles.scss` importing all partials and Google Fonts
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [x] 1.3 Create all TypeScript interfaces and data models
    - Create `src/app/models/` directory with all interfaces: Lead, MetricChip, NavLink, Achievement, TimelineEntry, SkillCategory, SkillBar, EducationEntry, Certification
    - _Requirements: 4.3, 5.8, 6.1, 7.2, 7.3, 8.1_

  - [x] 1.4 Set up index.html with meta tags, Open Graph, Twitter Card, and JSON-LD structured data
    - Add title, description, keywords meta tags
    - Add og:title, og:description, og:image, og:url, og:type
    - Add twitter:card, twitter:title, twitter:description, twitter:image
    - Add schema.org Person JSON-LD with name, jobTitle, url, sameAs
    - Configure Google Fonts preconnect and link tags for Inter + Bricolage Grotesque
    - _Requirements: 12.2, 12.3, 12.4, 12.5, 10.3_

- [x] 2. Core services and directives
  - [x] 2.1 Implement ThemeService with reduced-motion detection and font loading monitor
    - Detect `prefers-reduced-motion` media query and expose as signal
    - Monitor Google Fonts loading with 3-second timeout fallback
    - _Requirements: 10.7, 11.8, 13.9_

  - [x] 2.2 Implement ScrollService with scroll progress tracking and smooth scroll navigation
    - Track scroll position and calculate scroll progress (0-100) as signals
    - Implement `scrollToSection()` with smooth scroll behavior (300-800ms)
    - Track active section based on scroll position
    - _Requirements: 1.9, 11.5_

  - [x] 2.3 Implement AnimationService with GSAP integration and Intersection Observer triggers
    - Implement `fadeInStagger()` for entry animations with configurable stagger delay
    - Implement `countUp()` for animated number counting
    - Implement `initScrollTrigger()` with Intersection Observer and threshold config
    - Respect `prefersReducedMotion` signal — skip animations when enabled
    - Implement `cleanup()` for destroying GSAP instances
    - _Requirements: 11.1, 11.4, 11.8_

  - [x] 2.4 Implement IntersectionObserverDirective
    - Create standalone directive with configurable threshold input
    - Emit `inView` event when element visibility crosses threshold
    - Expose `isVisible` signal for template binding
    - Clean up observer on destroy
    - _Requirements: 11.4, 4.2, 3.3_

  - [x] 2.5 Implement TypewriterDirective with cycling title animation
    - Accept `titles` array, `typingSpeed` (80ms default), `pauseDuration` (2000ms default)
    - Type characters sequentially, pause on complete title, clear, then type next
    - Cycle back to first title after last
    - Respect reduced-motion preference (show static first title)
    - _Requirements: 2.3, 11.3, 11.8_

  - [ ]* 2.6 Write property test for TypewriterDirective
    - **Property 4: Typewriter cycles through all titles in sequence**
    - Generate random string arrays, verify accumulated characters form each title in order and cycle correctly
    - **Validates: Requirements 2.3**

  - [x] 2.7 Implement CountUpDirective with Intersection Observer trigger
    - Accept `targetValue`, `duration` (2000ms default), `threshold` (0.5 default)
    - Animate from 0 to target value using requestAnimationFrame
    - Trigger only once per page load (`hasTriggered` signal)
    - Respect reduced-motion preference (show final value immediately)
    - _Requirements: 4.2, 4.5, 11.4, 11.8_

  - [ ]* 2.8 Write property test for CountUpDirective
    - **Property 5: Count-up animation reaches exact target value**
    - Generate random integers [0-100] and durations [500-3000ms], verify final value equals target
    - **Validates: Requirements 4.2**

- [x] 3. Checkpoint - Core infrastructure verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Navigation and layout components
  - [x] 4.1 Implement NavbarComponent with glassmorphism scroll effect and mobile menu
    - Sticky positioning with z-index above all content
    - Apply glassmorphism effect when scrolled past 50px (opacity 0.8-0.95, backdrop-blur 8px+)
    - Display "CF" monogram logo linking to hero section
    - Display navigation links for all sections
    - Hide nav links and show hamburger menu below 768px
    - Implement full-screen mobile overlay with close on link tap, outside tap, or close icon
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10_

  - [x] 4.2 Implement ScrollProgressBarComponent
    - Fixed 4px bar at top of viewport
    - Width reflects scroll percentage using accent gradient (cyan to violet)
    - Subscribe to ScrollService.scrollProgress signal
    - _Requirements: 11.5_

  - [x] 4.3 Implement ParticleCanvasComponent with animated network nodes
    - Render ~60 nodes on canvas with slow random movement and connection lines
    - Use dark navy-black background (#0A0E1A)
    - Connection lines at 10% opacity electric cyan, nodes in premium violet
    - Reduce to ~30 nodes below 768px viewport
    - Maintain 60fps performance
    - Disable animation when prefers-reduced-motion is enabled (static positions)
    - Handle resize events and cleanup on destroy
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x] 4.4 Implement FooterComponent
    - Display copyright, social links (LinkedIn), and contact email
    - Consistent styling with design tokens
    - _Requirements: 10.1, 10.2_

- [x] 5. Hero and Profile sections
  - [x] 5.1 Implement HeroSectionComponent with typewriter, metrics, and CTAs
    - 60/40 layout (content left, photo right) on desktop 1024px+
    - Circular photo with rotating gradient ring (cyan to violet, 3s rotation)
    - Integrate TypewriterDirective for cycling professional titles
    - Display 4 metric chips with hover floating animation (translateY up to 6px)
    - "Descargar CV" button triggering PDF download with error handling
    - "Ver Logros" button smooth-scrolling to achievements section
    - Responsive: stack vertically below 768px, single-column centered 768-1023px with 2x2 metric grid
    - GSAP fade-in stagger animation on load (150ms delay between elements, total ≤1.5s)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 11.1, 11.2_

  - [x] 5.2 Implement ProfileSectionComponent with orbiting keyword tags
    - Two-column layout: professional summary left, orbiting tags right
    - Include all 16 keyword tags (Transformación Digital, IA Aplicada, BPM, etc.)
    - Orbital floating animation triggered at 20% visibility via IntersectionObserverDirective
    - Gradient text heading (cyan to violet)
    - Fade-in animation on section entry
    - Stack vertically below 768px (summary first, tags below)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 6. Achievements and Timeline sections
  - [x] 6.1 Implement AchievementsSectionComponent with glassmorphism cards and count-up
    - Display 7 glassmorphism cards in responsive grid (3-col desktop, 2-col tablet, 1-col mobile)
    - Each card shows percentage, title, and company description
    - Integrate CountUpDirective triggered at 50% visibility (once per page load)
    - Hover effect: translateY(-8px) + colored glow; touch: tap toggle
    - Count-up completes within 2 seconds per card
    - Include all 7 metrics data (95%, 80%, 90%, 85%, 100%, 98%, 40%)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 6.2 Implement TimelineSectionComponent with expandable nodes
    - Vertical timeline with alternating left/right entries on 768px+
    - Reverse chronological order (2026 to 2004)
    - Collapsed by default showing company name and date range
    - Click to expand: reveal position, duration, up to 5 responsibility bullets
    - Click expanded node to collapse
    - Pulsing ring animation on each node (every 2s)
    - Fade-in slide effect on viewport entry (0.6s)
    - Single-column left-aligned below 768px
    - Include all 9 timeline entries
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 11.7_

  - [ ]* 6.3 Write property test for timeline ordering
    - **Property 6: Timeline entries are sorted in reverse chronological order**
    - Generate random arrays of timeline entries with various start years, verify descending order invariant
    - **Validates: Requirements 5.2**

- [x] 7. Skills and Education sections
  - [x] 7.1 Implement SkillsSectionComponent with categories and animated bars
    - Display 4 category groups in responsive grid (2x2 desktop, 2-col tablet, 1-col mobile)
    - Staggered fade-in animation on tags within 1 second
    - Horizontal skill bars animating from 0% to target width (1.5s) via Intersection Observer
    - 4-6 key competency bars with percentage labels
    - Hover effect on tags: scale + accent glow
    - 3-8 tags per category group
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [ ]* 7.2 Write property test for skill category tag bounds
    - **Property 7: Skill categories contain between 3 and 8 tags**
    - Generate category objects with random tag arrays, verify count is within [3, 8]
    - **Validates: Requirements 6.8**

  - [x] 7.3 Implement EducationSectionComponent with cards and certification badges
    - Two-column layout on 1024px+: education cards left, certifications right
    - Include 4 education entries with degree, institution, year/status
    - Include 9 certification badges with title, institution, year
    - Fade-in slide-up animation on viewport entry (0.6s each)
    - Stack vertically below 768px (education above certifications)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 8. Checkpoint - UI components verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Contact form and serverless API
  - [x] 9.1 Implement ContactFormComponent with validation and submission
    - Glassmorphism card with fields: nombre (required, max 100), empresa (optional, max 100), email (required, max 150, valid format), motivo dropdown (Consultoría, Colaboración, Docencia, Otro), mensaje (required, max 1000)
    - Inline validation errors adjacent to invalid fields
    - Submit to ContactService, handle success (show confirmation, reset form), error (show error, preserve data), and rate-limit states
    - Display alternative contact methods (email, LinkedIn) on error
    - _Requirements: 8.1, 8.3, 8.4, 8.5_

  - [x] 9.2 Implement ContactService for API communication
    - POST to `/api/contact` with ContactFormData payload
    - Return Observable<LeadResponse> with success/error handling
    - _Requirements: 8.1, 8.2_

  - [x] 9.3 Implement serverless API handler (api/contact.ts) with validation, rate limiting, and database persistence
    - Create `api/_utils/validation.ts` with `validateContactForm()` function
    - Create `api/_utils/rate-limiter.ts` with `checkRateLimit()` (3 submissions per IP per hour)
    - Create `api/_utils/db.ts` with Neon Pool connection using DATABASE_URL env var with SSL
    - Create `api/contact.ts` handler: validate → check rate limit → hash IP → persist to leads table
    - Return appropriate HTTP status codes (200, 400, 429, 503, 504, 500)
    - Handle missing DATABASE_URL (503), connection timeout >10s (504)
    - _Requirements: 8.2, 8.6, 8.7, 8.8, 14.2, 14.3, 14.5, 14.6_

  - [ ]* 9.4 Write property test for contact form validation
    - **Property 1: Contact form validation rejects all invalid inputs**
    - Generate payloads with random combinations of empty/missing required fields and malformed emails, verify `validateContactForm` returns `{ valid: false }` with errors
    - **Validates: Requirements 8.5, 8.6**

  - [ ]* 9.5 Write property test for IP hashing
    - **Property 2: IP hashing is deterministic and non-reversible**
    - Generate random IPv4/IPv6 strings, verify same input produces same output and output does not contain original IP
    - **Validates: Requirements 8.7**

  - [ ]* 9.6 Write property test for rate limiter
    - **Property 3: Rate limiter enforces 3 submissions per IP per hour**
    - Generate sequences of timestamps within/outside 1-hour windows, verify first 3 allowed and subsequent rejected
    - **Validates: Requirements 8.8**

- [x] 10. SSR, deployment, and accessibility
  - [x] 10.1 Configure Angular SSR with @vercel/node adapter and create vercel.json
    - Configure `main.server.ts` for Vercel SSR handler
    - Create `vercel.json` with rewrites: `/api/*` → serverless functions, `/*` → Angular SSR
    - Configure functions runtime for `api/contact.ts` with @vercel/node@3 and maxDuration 15
    - _Requirements: 12.1, 12.6, 12.7, 14.1_

  - [x] 10.2 Create SQL schema file and README with deployment instructions
    - Create SQL schema for leads table with indexes
    - Write README with: Vercel project setup, environment variable config (DATABASE_URL), Neon provisioning steps, SQL schema, build/deploy commands
    - _Requirements: 14.4_

  - [x] 10.3 Implement accessibility compliance across all components
    - Add alt text to all images (profile photo, og-image)
    - Add aria-labels to all interactive elements (buttons, links, form controls, nav items)
    - Ensure full keyboard navigation with visible focus indicators
    - Verify WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text)
    - Implement lazy loading for below-fold images (WebP format)
    - _Requirements: 13.2, 13.5, 13.6, 13.7, 13.8_

  - [x] 10.4 Wire AppComponent with all section components and finalize responsive layout
    - Import and arrange all standalone components in app.component.html
    - Ensure proper section ordering: Navbar, ParticleCanvas, ScrollProgressBar, Hero, Profile, Achievements, Timeline, Skills, Education, Contact, Footer
    - Verify responsive behavior at all breakpoints (375px, 768px, 1024px, 1440px)
    - Ensure no horizontal overflow or content truncation
    - _Requirements: 13.8, 12.1_

- [x] 11. Final checkpoint - Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using `fast-check` library
- Unit tests validate specific examples and edge cases
- The design uses TypeScript throughout (Angular 17+ with standalone components)
- All animations must respect `prefers-reduced-motion` media query
- Images should be placed in `src/assets/images/` in WebP format
- The CV PDF should be placed in `src/assets/documents/`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.4"] },
    { "id": 3, "tasks": ["2.3", "2.5", "2.7"] },
    { "id": 4, "tasks": ["2.6", "2.8", "4.1", "4.2", "4.4"] },
    { "id": 5, "tasks": ["4.3", "5.1", "5.2"] },
    { "id": 6, "tasks": ["6.1", "6.2", "7.1", "7.3"] },
    { "id": 7, "tasks": ["6.3", "7.2", "9.1", "9.2"] },
    { "id": 8, "tasks": ["9.3"] },
    { "id": 9, "tasks": ["9.4", "9.5", "9.6"] },
    { "id": 10, "tasks": ["10.1", "10.2", "10.3"] },
    { "id": 11, "tasks": ["10.4"] }
  ]
}
```
